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
const base_1 = require("../utils/base");
class DotaTeams extends base_1.Base {
    constructor(config) {
        super(config);
    }
    getTeamInfo(teamName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const requestInfo = {
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
                    .then((json) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const teamJson = yield this.cacheFetch.checkRedirect(json, requestInfo);
                        resolve(this._parseTeam(teamJson.parse.text['*'], teamJson.parse.displaytitle));
                    }
                    catch (e) {
                        reject(e);
                    }
                }))
                    .catch((err) => {
                    reject(`Error fetching team list: ${err}`);
                });
            });
        });
    }
    _parseTeam(teamHtml, displayTitle) {
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
        const teamInfoObj = {};
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
        const rosterTableRows = $('.table-responsive.table-striped.roster-card').eq(0).find('tr');
        const ROSTER_TABLE_OFFSET = 2;
        const roster = [];
        if (rosterTableRows.eq(0).text().indexOf('Active Squad') !== -1) {
            for (let i = ROSTER_TABLE_OFFSET, len = rosterTableRows.length; i < len; i++) {
                const playerRow = rosterTableRows.eq(i);
                const playerObject = {
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
        return Object.assign({ name,
            roster,
            teamLogo }, teamInfoObj);
    }
    _trimDate(dateStr) {
        return dateStr.substr(0, 10);
    }
    _trimName(name) {
        return /\((.+)\)/.exec(name)[1];
    }
}
exports.DotaTeams = DotaTeams;
