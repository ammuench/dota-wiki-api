import * as cheerio from 'cheerio';
import fetch, { RequestInit } from 'node-fetch';

import { CacheFetch } from './cachefetch';

export interface IRankKey {
    rank?: string;
    team?: string;
}

export interface IRank {
    hasError?: boolean;
    isClinched: boolean;
    isIneligible: boolean;
    rank: string;
    score: string;
    team: string;
}

export class DPCRankings {
    private cacheFetch = new CacheFetch();
    private userAgentKey: string;

    constructor(userAgentKey: string) {
        this.userAgentKey = userAgentKey;
    }

    public getRankByStanding(rank: string): Promise<IRank> {
        return new Promise((resolve, reject) => {
            const fullRankings = this.getRankings();
            fullRankings.then((rankmap) => {
                for (const key of rankmap.keys()) {
                    if (key.rank === rank) {
                        resolve(rankmap.get(key));
                    }
                }
                reject({
                    hasError: true,
                    isClinched: false,
                    isIneligible: false,
                    rank: 'No team exists at that rank',
                    score: null,
                    team: null,
                });
            });
        });
    }

    public getRankByTeam(team: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const fullRankings = this.getRankings();
            fullRankings.then((rankmap) => {
                for (const key of rankmap.keys()) {
                    if (key.team.toLowerCase() === team.toLowerCase()) {
                        resolve(rankmap.get(key));
                    }
                }
                reject({
                    hasError: true,
                    isClinched: false,
                    isIneligible: false,
                    rank: null,
                    score: null,
                    team: 'No team with that name exists',
                });
            });
        });
    }

    public getRankings(): Promise<Map<IRankKey, IRank>> {
        return new Promise((resolve, reject) => {
            const requestInfo: RequestInit = {
                headers: {
                    'Accept-Encoding': 'gzip',
                    'User-Agent': this.userAgentKey,
                },
                method: 'GET',
            };
            this.cacheFetch.cacheFetch('http://liquipedia.net/dota2/api.php?action=parse&format=json&page=Dota_Pro_Circuit/Rankings/Teams', requestInfo)
                .then((json: any) => {
                    resolve(this._parseRanks(json.parse.text['*'])); // REAL CODE PUT BACK
                    // resolve(this._parseRanks(json));
                })
                .catch((err: any) => {
                    reject(`err: ${err}`);
                });
        });
    }

    private _parseRanks(tableHtml: string): Map<IRankKey, IRank> {
        const $ = cheerio.load(tableHtml);
        const rankTableRows = $('.wikitable').eq(0).find('tr');
        const RANK_TABLE_OFFSET = 2; // Index offset to handle the fact that the first two rows are for header elements
        const CLINCHED_COLOR_INDICATOR = 'background-color:rgb(204,255,204)';
        const INELIGIBLE_COLOR_INDICATOR = 'background-color:rgb(255,204,204)';
        const ranks = new Map<IRankKey, IRank>();
        for (let i = RANK_TABLE_OFFSET, len = rankTableRows.length; i < len; i++) {
            const thisRow = rankTableRows.eq(i);
            if (!thisRow.hasClass('expand-child')) {
                const isClinched = thisRow.attr('style') === CLINCHED_COLOR_INDICATOR;
                const isIneligible = thisRow.attr('style') === INELIGIBLE_COLOR_INDICATOR;
                const rank = thisRow.find('td').eq(0).find('b').eq(0).text();
                const team = thisRow.find('td').eq(1).find('.team-template-text a').eq(0).text();
                const score = thisRow.find('td').eq(2).find('b').eq(0).text();
                ranks.set({ rank, team }, { rank, team, score, isClinched, isIneligible });
            }
        }

        return ranks;
    }
}
