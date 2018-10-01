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
export declare class DotaMatches extends Base {
    constructor(config: IDotaWikiConfig);
    getMatchList(): Promise<any>;
    private _parseMatchList(matchesHtml);
    private _parseMatch(matchSet, isLive?);
    private _parseScore(scoreString, returnTeam2?);
    private _parseTeamUrl(teamUrl);
    private _parseTime(date);
    private _trimTeam(teamName);
}
