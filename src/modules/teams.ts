import * as cheerio from 'cheerio';
import { RequestInit } from 'node-fetch';

import { Base, IDotaWikiConfig } from '../utils/base';
import { IPlayer } from './players';

export interface ITeam {
    name: string;
    roster: ITeamMember[];
    teamLogo?: string;
    location?: string;
    region: string;
    manager?: string;
    captain?: string;
    earnings?: string;
    rank?: string;
}

export interface ITeamMember {
    handle: string;
    isCaptain: boolean;
    joinDate: string;
    name: string;
    position: string;
    region: string;
}

export class DotaTeams extends Base {

    constructor(config: IDotaWikiConfig) {
        super(config);
    }

    public async getTeamInfo(teamName: string): Promise<ITeam> {
        return new Promise<ITeam>((resolve, reject) => {
            const requestInfo: RequestInit = {
                headers: {
                    'Accept-Encoding': 'gzip',
                    'User-Agent': this.userAgentValue,
                },
                method: 'GET',
            };
            const teamNameEncode = teamName.replace(/ /g, '_');
            const teamURL = (teamNameEncode.indexOf('.') !== -1)
                ? `${this.cacheFetch.urlStub}?action=parse&origin=*&format=json&page=${teamNameEncode}&*`
                : `${this.cacheFetch.urlStub}?action=parse&origin=*&format=json&page=${teamNameEncode}`;
            this.cacheFetch.cacheFetch(teamURL, requestInfo)
                .then(async (json: any) => {
                    try {
                        const teamJson: any = await this.cacheFetch.checkRedirect(json, requestInfo);
                        resolve(this._parseTeam(teamJson.parse.text['*'], teamJson.parse.displaytitle));
                    } catch (e) {
                        reject(e);
                    }
                })
                .catch((err: any) => {
                    reject(`Error fetching team list: ${err}`);
                });
        });
    }

    private _parseTeam(teamHtml: string, displayTitle: string): ITeam {
        const $ = cheerio.load(teamHtml);
        const name = displayTitle;
        const teamLogo = `https://liquipedia.net${$('.infobox-image').eq(0).find('img').attr('src')}`;
        const potentialTeamBoxes = $('.fo-nttax-infobox-wrapper.infobox-dota2');
        let $teamBox;
        for (let i = 0, len = potentialTeamBoxes.length; i < len; i++) {
            const teamBoxString = potentialTeamBoxes.eq(i).html();
            if (teamBoxString.indexOf('Team Information') !== -1) {
                $teamBox = cheerio.load(teamBoxString);
                break;
            }
        }
        const teamInfoBlocks = $teamBox('.infobox-cell-2.infobox-description');
        const teamInfoObj: any = {};
        for (let i = 0, len = teamInfoBlocks.length; i < len; i++) {
            const block = teamInfoBlocks.eq(i);
            const blockLabel = block.text();

            switch (blockLabel) {
                case 'Location:':
                    teamInfoObj.location = block.siblings().eq(0).text();
                    break;
                case 'Region:':
                    teamInfoObj.region = block.siblings().eq(0).text();
                    break;
                case 'Manager:':
                    teamInfoObj.manager = block.siblings().eq(0).text();
                    break;
                case 'Team Captain:':
                    teamInfoObj.captain = block.siblings().eq(0).text();
                    break;
                case 'Total Earnings:':
                    teamInfoObj.earnings = block.siblings().eq(0).text();
                    break;
                case 'Pro Circuit Rank:':
                    teamInfoObj.rank = block.siblings().eq(0).text();
                    break;
            }
        }

        // TODO Set this to only grab ACTIVE roster
        const rosterTableRows = $('.table-responsive.table-striped.roster-card').eq(0).find('tr');
        const ROSTER_TABLE_OFFSET = 2;
        const roster: ITeamMember[] = [];

        if (rosterTableRows.eq(0).text().indexOf('Active Squad') !== -1) {
            for (let i = ROSTER_TABLE_OFFSET, len = rosterTableRows.length; i < len; i++) {
                const playerRow = rosterTableRows.eq(i);
                const playerObject: ITeamMember = {
                    handle: playerRow.find('.ID').eq(0).find('b a').eq(1).attr('title'),
                    isCaptain: !!(playerRow.find('.ID > a').eq(0).html()),
                    joinDate: this._trimDate(playerRow.find('.Date .Date').eq(0).text()),
                    name: this._trimName(playerRow.find('.Name').eq(0).text()),
                    position: playerRow.find('.PositionWoTeam2').eq(0).text(),
                    region: playerRow.find('.ID').eq(0).find('b a').eq(0).attr('title'),
                };
                roster.push(playerObject);
            }
        }

        return {
            name,
            roster,
            teamLogo,
            ...teamInfoObj,
        };
    }

    private _trimDate(dateStr: string): string {
        return dateStr.substr(0, 10);
    }

    private _trimName(name: string): string {
        return /\((.+)\)/.exec(name)[1];
    }
}
