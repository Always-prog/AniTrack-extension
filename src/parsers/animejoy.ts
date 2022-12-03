import { RawTitleName, SiteProvider } from "./types";

const site = 'animejoy.ru'

function getTitleName(): RawTitleName {
    let element = document.getElementsByClassName('romanji')[0];
    if (element.textContent) return element.textContent;

    throw 'Seems like site content page is changed, I can\'t parse title name';
}

export default {
    site: site,
    getTitleName: getTitleName,
} as SiteProvider