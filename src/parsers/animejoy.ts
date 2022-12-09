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
    if (!playlist) return 1;
    var active = playlist.getElementsByClassName('visible active')[0];
    if (!active) return 1;
    
    // TODO: Attention that we can't find episode number!!!
    if (!active?.textContent) return 1;
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
    var playlistLists = document.getElementsByClassName('playlists-lists')[0];
    playlistLists.addEventListener('click', () => {
        setTimeout(func, 1)
    })
    playlist.addEventListener('click', (e) => {
        if ((e?.target as HTMLElement)?.tagName === 'LI') { // trigger only when episode is selected.
            setTimeout(func, 1)
        }
    })
}

function isOnWatchingPage(){
    return window.location.pathname.includes('.html') // every episode on that site hosted as html
}

function getStartDate(){
    let desc = document.getElementsByClassName('blkdesc')[0];
    let dates = Array.from(desc.getElementsByTagName('p')).filter(p => p.innerHTML.includes('Дата выпуска'));
    let start_date = {
        1: 1999,
        2: 10,
        3: 10,
    }
    if (dates[0]?.textContent){
        // @ts-ignore: Object is possibly 'null'.
        start_date = dates[0].textContent.match(/(\d{4}([.\-/ ])\d{2}\2\d{2}|\d{2}([.\-/ ])\d{2}\3\d{4})/)[0].match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
            
    }
    
    return new Date(start_date[3], start_date[2], start_date[1])
}

export default {
    site: site,
    getTitleName: getTitleName,
    getCurrentEpisode: getCurrentEpisode,
    onPlayerLoad: onPlayerLoad,
    getTranslateType: getTranslateType,
    getStartDate: getStartDate,
    getCurrentPageURL: getCurrentPageURL,
    onEpisodeChanged: onEpisodeChanged,
    isOnWatchingPage: isOnWatchingPage
} as SiteProvider