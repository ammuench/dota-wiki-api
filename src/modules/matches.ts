import * as cheerio from 'cheerio';
import * as parse from 'date-fns/parse';
import { RequestInit } from 'node-fetch';

import { Base, IDotaWikiConfig } from '../utils/base';

export interface IMatchList {
    liveGames: IMatch[];
    upcomingGames: IMatch[];
}

export interface IMatch {
    team1: string;
    team1Score?: number;
    team1URL?: string;
    team2: string;
    team2Score?: number;
    team2URL?: string;
    startTime?: string;
    tournament: string;
    tournamentURL: string;
}

export class DotaMatches extends Base {

    constructor(config: IDotaWikiConfig) {
        super(config);
    }

    public async getMatchList(): Promise<IMatchList> {
        return new Promise<IMatchList>((resolve, reject) => {
            const requestInfo: RequestInit = {
                headers: {
                    'Accept-Encoding': 'gzip',
                    'User-Agent': this.userAgentValue,
                },
                method: 'GET',
            };
            const matchesURL = `${this.cacheFetch.urlStub}?action=parse&origin=*&format=json&page=Liquipedia:Upcoming_and_ongoing_matches`;
            this.cacheFetch.cacheFetch(matchesURL, requestInfo)
                .then(async (json: any) => {
                    try {
                        resolve(this._parseMatchList(json.parse.text['*']));
                    } catch (e) {
                        reject(e);
                    }
                })
                .catch((err: any) => {
                    reject(`Error fetching match list: ${err}`);
                });
        });
    }

    private _parseMatchList(matchesHtml: string): IMatchList {
        const $ = cheerio.load(matchesHtml);
        const matchBoxHeaders = $('h2');
        const matchList: IMatchList = {
            liveGames: [],
            upcomingGames: [],
        };

        for (let i = 0, len = matchBoxHeaders.length; i < len; i++) {
            if (matchBoxHeaders.eq(i).text().indexOf('Ongoing') !== -1) {
                const matchBox = matchBoxHeaders.eq(i).siblings('div').eq(i);
                matchList.liveGames = this._parseMatch(matchBox, true);
            } else {
                const matchBox = matchBoxHeaders.eq(i).siblings('div').eq(i);
                matchList.upcomingGames = this._parseMatch(matchBox);
            }
        }

        return matchList;
    }

    private _parseMatch(matchSet: Cheerio, isLive = false): IMatch[] {
        const matches = matchSet.find('.infobox_matches_content');
        const matchArray: IMatch[] = [];
        for (let i = 0, len = matches.length; i < len; i++) {
            const match = matches.eq(i);
            const matchObj = {
                startTime: isLive ? null : this._parseTime(match.find('.match-filler').find('.match-countdown .timer-object').eq(0).text()),
                team1: this._trimTeam(match.find('.team-left .team-template-text > *').eq(0).attr('title')),
                team1Score: isLive ? this._parseScore(match.find('.versus').eq(0).text()) : null,
                team1URL: this._parseTeamUrl(match.find('.team-left .team-template-text > *').eq(0).attr('href')),
                team2: this._trimTeam(match.find('.team-right .team-template-text > *').eq(0).attr('title')),
                team2Score: isLive ? this._parseScore(match.find('.versus').eq(0).text(), true) : null,
                team2URL: this._parseTeamUrl(match.find('.team-right .team-template-text > *').eq(0).attr('href')),
                tournament: match.find('.match-filler').find('.match-countdown + div > span > a').eq(0).attr('title'),
                tournamentURL: `https://liquipedia.net/dota2${match.find('.match-filler').find('.match-countdown + div > div > a').eq(0).attr('href')}`,
            };
            matchArray.push(matchObj);
        }

        return matchArray;
    }

    private _parseScore(scoreString: string, returnTeam2: boolean = false): number {
        const scoreSplit = scoreString.split(':');
        const scoreIndex = returnTeam2 ? 1 : 0;  // Team 2 value will always be the "right" side number
        return parseInt(scoreSplit[scoreIndex], 10);
    }

    private _parseTeamUrl(teamUrl: string): string {
        if (teamUrl && teamUrl.indexOf('redlink=1') === -1) {
            return `https://liquipedia.net/dota2${teamUrl}`;
        }
        return null;
    }

    private _parseTime(date: string): string {
        // Map month name to a number, disabled TSLint to keep months in chrono order
        /* tslint:disable:object-literal-sort-keys */
        const monthToNumberMap: any = {
            January: '01',
            February: '02',
            March: '03',
            April: '04',
            May: '05',
            June: '06',
            July: '07',
            August: '08',
            September: '09',
            October: '10',
            November: '11',
            December: '12',
        };
        /* tslint:enable:object-literal-sort-keys */

        /**
         *  Normalizes day & hours values to have leading zeros if they are single-digits
         *
         * @param {string} datePropValue Hours and/or day value in numbers
         * @returns {string}
         */
        const normalizeSingles = (datePropValue: string): string => {
            if (datePropValue.length === 1) {
                return `0${datePropValue}`;
            }

            return datePropValue;
        };

        const MONTH_GROUP = 1;
        const DAYS_GROUP = 2;
        const YEAR_GROUP = 3;
        const HOURS_GROUP = 4;
        const MINUTES_GROUP = 5;
        const dateMatch = date.match(/(\w+) (\d{1,2}), (\d{4}) - (\d{1,2}):(\d{2}) UTC/);
        const reassembledDate = `${dateMatch[YEAR_GROUP]}-${monthToNumberMap[dateMatch[MONTH_GROUP]]}-${normalizeSingles(dateMatch[DAYS_GROUP])}T${normalizeSingles(dateMatch[HOURS_GROUP])}:${dateMatch[MINUTES_GROUP]}:00.000Z`;
        const parsedate = parse(reassembledDate);

        return parsedate.toISOString();
    }

    private _trimTeam(teamName: string): string {
        return teamName.split('(page does not exist)')[0].trim();
    }
}
