
export type RawTitleName = string;

export interface SiteProvider {
    site: string;
    getTitleName: () => RawTitleName;
}