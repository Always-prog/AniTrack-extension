import { default as animejoySite } from './animejoy';
import { default as animegoSite } from './animego';


const animeSites = {
    [animejoySite.site]: animejoySite,
    [animegoSite.site]: animegoSite,
}

export const videoHosts = [
    'video.sibnet.ru',
    '*.online',
    'secvideo1.online',
    '*.uboost.one',
    'kodik.info',
    '*.*.kodik-storage.com'
]

export function isVideoHost(host: string): boolean{
    if (videoHosts.includes(host)) return true;
    let pies = host.split('.')

    let hosts = videoHosts.filter(domain => domain.split('.')[0] === '*' || domain.split('.')[0] === pies[0])
    for (var i = 0; i < pies.length -1; i +=1 ){
        hosts = hosts.filter(domain => domain.split('.')[i] === '*' || domain.split('.')[i] === pies[i])
    }
    if (hosts.length !== 0) return true;
    return false;
}


export function getAnimeSite(){
    return animeSites[window.location.host];
}

export function isAnimeSite(){
    return getAnimeSite() && !videoHosts.includes(window.location.host);
}

export function getVideoPlayer(){

}