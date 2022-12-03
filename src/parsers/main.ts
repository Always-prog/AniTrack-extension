import { default as animejoySite } from './animejoy';


const animeSites = {
    [animejoySite.site]: animejoySite 
}

export const videoHosts = [
    'video.sibnet.ru'
]


export function getAnimeSite(){
    return animeSites[window.location.host];
}

export function isAnimeSite(){
    return getAnimeSite() && !videoHosts.includes(window.location.host);
}

export function getVideoPlayer(){

}