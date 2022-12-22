import { TranslateType } from "../api/timeEater/types";

export type RawTitleName = string;
export type RawEpisodeOrder = number;

export interface SiteProvider {
    site: string;
    getTitleName: () => RawTitleName;
    getCurrentEpisode: () => RawEpisodeOrder;
    getTranslateType: () => TranslateType;
    onPlayerLoad: (func: () => void) => null;
    getCurrentPageURL: () => string;
    isOnWatchingPage: () => boolean
    getStartDate: () => Date | null;
}