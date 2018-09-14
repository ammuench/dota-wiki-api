import { Base, IDotaWikiConfig } from '../utils/base';
export interface IRankKey {
    rank?: string;
    team?: string;
}
export interface IRank {
    errorMsg?: string;
    hasError?: boolean;
    isClinched: boolean;
    isIneligible: boolean;
    rank: string;
    score: string;
    team: string;
}
export declare class DPCRankings extends Base {
    constructor(config: IDotaWikiConfig);
    getRankByStanding(rank: string): Promise<IRank>;
    getRankByTeam(team: string): Promise<IRank>;
    getRankings(): Promise<Map<IRankKey, IRank>>;
    private _parseRanks(tableHtml);
}
