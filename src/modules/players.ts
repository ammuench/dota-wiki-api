import * as cheerio from 'cheerio';
import { RequestInit } from 'node-fetch';

import { Base, IDotaWikiConfig } from '../utils/base';

export interface IPlayer {
    handle: string;
    name: string;
    photo: string;
    position: string[];
    region?: string[];
    birthday?: string;
    earnings?: string;
    team?: string;
}

export class DotaPlayers extends Base {

    constructor(config: IDotaWikiConfig) {
        super(config);
    }

    public async getPlayerInfo(playerName: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const requestInfo: RequestInit = {
                headers: {
                    'Accept-Encoding': 'gzip',
                    'User-Agent': this.userAgentValue,
                },
                method: 'GET',
            };
            const playerNameEncoded = playerName.replace(/ /g, '_');
            const playerUrl = (playerNameEncoded.indexOf('.') !== -1)
                ? `${this.cacheFetch.urlStub}?action=parse&origin=*&format=json&page=${playerNameEncoded}&*`
                : `${this.cacheFetch.urlStub}?action=parse&origin=*&format=json&page=${playerNameEncoded}`;
            this.cacheFetch.cacheFetch(playerUrl, requestInfo)
                .then(async (json: any) => {
                    try {
                        const playerJson: any = await this.cacheFetch.checkRedirect(json, requestInfo);
                        resolve(this._parsePlayer(playerJson.parse.text['*'], playerJson.parse.displaytitle));
                    } catch (e) {
                        reject(e);
                    }
                })
                .catch((err: any) => {
                    reject(`Error fetching team list: ${err}`);
                });
        });
    }

    private _parsePlayer(teamHtml: string, displayTitle: string): IPlayer {
        const $ = cheerio.load(teamHtml);
        const handle = displayTitle;
        const playerLogo = `https://liquipedia.net${$('.infobox-image').eq(0).find('img').attr('src')}`;
        const potentialTeamBoxes = $('.fo-nttax-infobox-wrapper.infobox-dota2');
        let $playerBox;
        for (let i = 0, len = potentialTeamBoxes.length; i < len; i++) {
            const teamBoxString = potentialTeamBoxes.eq(i).html();
            if (teamBoxString.indexOf('Player Information') !== -1) {
                $playerBox = cheerio.load(teamBoxString);
                break;
            }
        }
        const playerInfoBlock = $playerBox('.infobox-cell-2.infobox-description');
        const playerInfoObj: any = {};
        for (let i = 0, len = playerInfoBlock.length; i < len; i++) {
            const block = playerInfoBlock.eq(i);
            const blockLabel = block.text();

            switch (blockLabel) {
                case 'Name:':
                    playerInfoObj.name = block.siblings().eq(0).text();
                    break;
                case 'Country:':
                    playerInfoObj.region = this._parseRegions(block.siblings().eq(0).html());
                    break;
                case 'Birth:':
                    playerInfoObj.birthday = this._parseBirthday(block.siblings().eq(0).text());
                    break;
                case 'Team:':
                    playerInfoObj.team = block.siblings().eq(0).text();
                    break;
                case 'Role(s):':
                    playerInfoObj.position = this._parseRoles(block.siblings().eq(0).html());
                    break;
                case 'Approx. Total Earnings:':
                    playerInfoObj.earnings = block.siblings().eq(0).text();
                    break;
            }
        }

        return {
            handle,
            photo: playerLogo,
            ...playerInfoObj,
        };
    }

    private _parseBirthday(birthdayText: string): string {
        const match = birthdayText.match(/\d{4}(-\d{2}){2}/);
        if (match) {
            return match[0];
        }

        return '';
    }

    private _parseRegions(regionHtml: string): string[] {
        const regions: string[] = [];
        const matches = regionHtml.match(/<\/a> <a href="\/dota2\/Category:(\w+)/gm);
        for (const match of matches) {
            if (match) {
                const countryMatch = match.match(/<\/a> <a href="\/dota2\/Category:(\w+)/)[1];
                if (countryMatch) {
                    regions.push(countryMatch);
                }
            }
        }

        return regions;
    }

    private _parseRoles(rolesHtml: string): string[] {
        const roles: string[] = [];
        const matches = rolesHtml.match(/>(\w+|\w+ \w+)</gm);
        for (const match of matches) {
            if (match) {
                const roleMatch = match.match(/>(\w+|\w+ \w+)</)[1];
                if (roleMatch && roleMatch !== 'Captain') {
                    roles.push(roleMatch);
                }
            }
        }

        return roles;
    }

    private _trimDate(dateStr: string): string {
        return dateStr.substr(0, 10);
    }

    private _trimName(name: string): string {
        return /\((.+)\)/.exec(name)[1];
    }
}
