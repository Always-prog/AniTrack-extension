import { TranslateType } from "../api/timeEater/types";
import { RawEpisodeOrder, RawTitleName, SiteProvider } from "./types";

const site = 'animejoy.ru'

function getTitleName(): RawTitleName {
    let element = document.getElementsByClassName('romanji')[0];
    if (element.textContent) return element.textContent;

    throw 'Seems like site content page is changed, I can\'t parse title name';
}

function onPlayerLoad(func: () => void){
    let attempts = 0;
    let maxAttempts = 10;
    const interval = setInterval(
        () => {
            let iframe = document.getElementsByTagName('iframe')
            if (iframe){
                func()
                clearInterval(interval)
            }
            if (attempts >= maxAttempts) clearInterval(interval)
            attempts += 1
        }, 1000
    )

}

function getCurrentEpisode(): RawEpisodeOrder { 
    var playlist = document.getElementsByClassName('playlists-videos')[0];
    if (!playlist) return 0;
    var active = playlist.getElementsByClassName('visible active')[0];
    if (!active) return 0;
    
    // TODO: Attention that we can't find episode number!!!
    if (!active?.textContent) return 0;
    return parseInt(active?.textContent);
}

function getTranslateType(): TranslateType {
    return 'Subtitles'
}

function getCurrentPageURL(): string { 
    return window.location.href
}

function onEpisodeChanged(func: () => void){
    var playlist = document.getElementsByClassName('playlists-videos')[0];
    playlist.addEventListener('click', function(_){
        func()
    })
}

function isOnWachingPage(){
    return window.location.pathname.includes('.html') // every episode on that site hosted as html
}
export default {
    site: site,
    getTitleName: getTitleName,
    getCurrentEpisode: getCurrentEpisode,
    onPlayerLoad: onPlayerLoad,
    getTranslateType: getTranslateType,
    getCurrentPageURL: getCurrentPageURL,
    onEpisodeChanged: onEpisodeChanged,
    isOnWachingPage: isOnWachingPage
} as SiteProvider