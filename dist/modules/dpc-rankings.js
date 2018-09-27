"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = require("cheerio");
const base_1 = require("../utils/base");
class DPCRankings extends base_1.Base {
    constructor(config) {
        super(config);
    }
    getRankByStanding(rank) {
        return new Promise((resolve, reject) => {
            const fullRankings = this.getRankings();
            fullRankings
                .then((rankmap) => {
                for (const key of rankmap.keys()) {
                    if (key.rank === rank) {
                        resolve(rankmap.get(key));
                    }
                }
                reject({
                    errorMsg: 'No team at the given rank',
                    hasError: true,
                    isClinched: false,
                    isIneligible: false,
                    rank: null,
                    score: null,
                    team: null,
                });
            })
                .catch((err) => {
                reject({
                    error: `Error attempting to fetch rank data\n${err}`,
                    hasError: true,
                    isClinched: false,
                    isIneligible: false,
                    rank: null,
                    score: null,
                    team: null,
                });
            });
        });
    }
    getRankByTeam(team) {
        return new Promise((resolve, reject) => {
            const fullRankings = this.getRankings();
            fullRankings
                .then((rankmap) => {
                for (const key of rankmap.keys()) {
                    if (key.team.toLowerCase() === team.toLowerCase()) {
                        resolve(rankmap.get(key));
                    }
                }
                reject({
                    error: 'No team with that name exists',
                    hasError: true,
                    isClinched: false,
                    isIneligible: false,
                    rank: null,
                    score: null,
                    team: null,
                });
            })
                .catch((err) => {
                reject({
                    error: `Error attempting to fetch rank data\n${err}`,
                    hasError: true,
                    isClinched: false,
                    isIneligible: false,
                    rank: null,
                    score: null,
                    team: null,
                });
            });
        });
    }
    getRankings() {
        return new Promise((resolve, reject) => {
            const requestInfo = {
                headers: {
                    'Accept-Encoding': 'gzip',
                    'User-Agent': this.userAgentValue,
                },
                method: 'GET',
            };
            this.cacheFetch.cacheFetch(`${this.cacheFetch.urlStub}?action=parse&format=json&page=Dota_Pro_Circuit/Rankings/Teams`, requestInfo)
                .then((json) => {
                resolve(this._parseRanks(json.parse.text['*']));
            })
                .catch((err) => {
                reject(`Error fetching team list: ${err}`);
            });
        });
    }
    _parseRanks(tableHtml) {
        const $ = cheerio.load(tableHtml);
        const rankTableRows = $('.wikitable').eq(0).find('tr');
        const RANK_TABLE_OFFSET = 2;
        const CLINCHED_COLOR_INDICATOR = 'background-color:rgb(204,255,204)';
        const INELIGIBLE_COLOR_INDICATOR = 'background-color:rgb(255,204,204)';
        const ranks = new Map();
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
exports.DPCRankings = DPCRankings;
