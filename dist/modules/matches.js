"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = require("cheerio");
const parse = require("date-fns/parse");
const base_1 = require("../utils/base");
class DotaMatches extends base_1.Base {
    constructor(config) {
        super(config);
    }
    getMatchList() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const requestInfo = {
                    headers: {
                        'Accept-Encoding': 'gzip',
                        'User-Agent': this.userAgentValue,
                    },
                    method: 'GET',
                };
                const matchesURL = `${this.cacheFetch.urlStub}?action=parse&origin=*&format=json&page=Liquipedia:Upcoming_and_ongoing_matches`;
                this.cacheFetch.cacheFetch(matchesURL, requestInfo)
                    .then((json) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        resolve(this._parseMatchList(json.parse.text['*']));
                    }
                    catch (e) {
                        reject(e);
                    }
                }))
                    .catch((err) => {
                    reject(`Error fetching match list: ${err}`);
                });
            });
        });
    }
    _parseMatchList(matchesHtml) {
        const $ = cheerio.load(matchesHtml);
        const matchBoxHeaders = $('h2');
        const matchList = {
            liveGames: [],
            upcomingGames: [],
        };
        for (let i = 0, len = matchBoxHeaders.length; i < len; i++) {
            if (matchBoxHeaders.eq(i).text().indexOf('Ongoing') !== -1) {
                const matchBox = matchBoxHeaders.eq(i).siblings('div').eq(i);
                matchList.liveGames = this._parseMatch(matchBox, true);
            }
            else {
                const matchBox = matchBoxHeaders.eq(i).siblings('div').eq(i);
                matchList.upcomingGames = this._parseMatch(matchBox);
            }
        }
        return matchList;
    }
    _parseMatch(matchSet, isLive = false) {
        const matches = matchSet.find('.infobox_matches_content');
        const matchArray = [];
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
    _parseScore(scoreString, returnTeam2 = false) {
        const scoreSplit = scoreString.split(':');
        const scoreIndex = returnTeam2 ? 1 : 0;
        return parseInt(scoreSplit[scoreIndex], 10);
    }
    _parseTeamUrl(teamUrl) {
        if (teamUrl && teamUrl.indexOf('redlink=1') === -1) {
            return `https://liquipedia.net/dota2${teamUrl}`;
        }
        return null;
    }
    _parseTime(date) {
        const monthToNumberMap = {
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
        const normalizeSingles = (datePropValue) => {
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
        return parsedate.toUTCString();
    }
    _trimTeam(teamName) {
        return teamName.split('(page does not exist)')[0].trim();
    }
}
exports.DotaMatches = DotaMatches;
