import { source, sourceType, sourceId } from "../types";

export type WatchedFrom = number;
export type WatchedTime = number;
export type WatchedDatetime = string;
export type EpisodeOrder = number; 
export type TranslateType = string; // 'Субтитры' | 'Subtitles' | 'AniDub' ...
export type Site = string; 

export type TitleName = string;

export interface Record {
    source: source,
    sourceType: sourceType,
    sourceId: sourceId,
    watchedFrom: WatchedFrom,
    watchedTime: WatchedTime,
    watchDatetime: WatchedDatetime,
    episodeOrder: EpisodeOrder,
    translateType: TranslateType,
    site: Site
}

export interface RelationAnime {
    relation_type: string;
    relation_type_formatted: string;
}


export interface MALTitleRelation extends MALNode, RelationAnime {};

export interface MALTitle {
    id: sourceId,
    title: TitleName,
    main_picture: {
        large: string,
        medium: string,
    },
    num_episodes: number;
    start_date: string;
    related_anime: Array<MALTitleRelation>;
}
export interface MALNode {
    node: MALTitle
} 
export type MALNodes = Array<MALNode>;

export type UserId = number;
export type Username = string;
export type UserEmail = string;
export type UserPassword = string;

export interface Me {
    id: UserId,
    username: Username
    email: UserEmail
}