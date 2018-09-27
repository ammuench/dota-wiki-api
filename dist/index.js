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
const dpc_rankings_1 = require("./modules/dpc-rankings");
const players_1 = require("./modules/players");
const teams_1 = require("./modules/teams");
class DotaWikiApi {
    constructor(config) {
        this.dpc = new dpc_rankings_1.DPCRankings(config);
        this.dPlayer = new players_1.DotaPlayers(config);
        this.dTeam = new teams_1.DotaTeams(config);
    }
    getTeamByStanding(rank) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dpc.getRankByStanding(rank.toString());
        });
    }
    getRankByTeamname(teamName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dpc.getRankByTeam(teamName);
        });
    }
    getAllRanks() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dpc.getRankings();
        });
    }
    getTeam(teamName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dTeam.getTeamInfo(teamName);
        });
    }
    getPlayer(playerName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dPlayer.getPlayerInfo(playerName);
        });
    }
}
exports.DotaWikiApi = DotaWikiApi;
