import { SiteProvider } from "./types";

const site = 'animego.org'

function getTitleName(){
    return document.getElementsByClassName('anime-synonyms')[0].getElementsByTagName('li')[0].textContent;
}

function getCurrentEpisode(){
    return Number(
        document.getElementById('video-carousel')
        ?.querySelector('.video-player__active[data-episode]')
        // @ts-ignore: Object is possibly 'null'.
        ?.attributes['data-episode']?.value
    )
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

function getTranslateType(){
    // @ts-ignore: Object is possibly 'null'.
    let translate = document.getElementById('video-dubbing').querySelector('span.video-player__active').textContent.replace(/  /g,'').replace(/(\r\n|\n|\r)/gm, '')
    return translate === 'Субтитры' ? 'Subtitles' : translate;
}

function getStartDate(){
    // @ts-ignore: Object is possibly 'null'.
    let startDateString = Array.from(document.getElementsByClassName('released-episodes-item')).at(-1).querySelectorAll('[content]')[1].attributes['content'].value;
    let startDatePieces = startDateString.split('-');
    return new Date(startDatePieces[3], startDatePieces[2], startDatePieces[1])
}

function getCurrentPageURL(){
    return window.location.href;
}


function isOnWatchingPage(){
    return document.getElementsByClassName('anime-title').length >= 1;
}
export default {
    site: site,
    getTitleName: getTitleName,
    getCurrentEpisode: getCurrentEpisode,
    onPlayerLoad: onPlayerLoad,
    getTranslateType: getTranslateType,
    getStartDate: getStartDate,
    getCurrentPageURL: getCurrentPageURL,
    isOnWatchingPage: isOnWatchingPage
} as SiteProvider