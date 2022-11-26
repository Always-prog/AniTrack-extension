import { source, sourceType, sourceId } from "../types";

export type watchedFrom = number;
export type watchedTime = number;
export type watchedDatetime = string;
export type episodeOrder = number; 
export type translateType = string; // 'Субтитры' | 'Subtitles' | 'AniDub' ...
export type site = string; 

export type titleName = string;

export interface Record {
    source: source,
    sourceType: sourceType,
    sourceId: sourceId,
    watchedFrom: watchedFrom,
    watchedTime: watchedTime,
    watchedDatetime: watchedDatetime,
    episodeOrder: episodeOrder,
    translateType: translateType,
    site: site
}

export interface MALTitle {
    id: sourceId,
    title: titleName,
    main_picture: {
        large: string,
        medium: string,
    }
}