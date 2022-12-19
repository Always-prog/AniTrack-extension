import { default as animejoySite } from './animejoy';
import { default as animegoSite } from './animego';


export const animeSites = {
    [animejoySite.site]: animejoySite,
    [animegoSite.site]: animegoSite,
}

export const videoHosts = {
    'Sibnet': 'video.sibnet.ru',
    'AllVideo': 'secvideo1.online',
    'uStore': '*.uboost.one',
    'Kodik': 'kodik.info',
    'KodikStorage': '*.*.kodik-storage.com',
    'AniBook': 'aniboom.one',
}
export const videoHostsUrls = Object.values(videoHosts);

export function isVideoHost(host: string): boolean{
    if (videoHostsUrls.includes(host)) return true;
    let pies = host.split('.')

    let hosts = videoHostsUrls.filter(domain => domain.split('.')[0] === '*' || domain.split('.')[0] === pies[0])
    for (var i = 0; i < 4; i +=1 ){
        hosts = hosts.filter(domain => domain.split('.')[i] === '*' || domain.split('.')[i] === pies[i])
    }
    if (hosts.length !== 0) return true;
    return false;
}


export function getAnimeSite(){
    return animeSites[window.location.host];
}

export function isAnimeSite(){
    return getAnimeSite() && !videoHostsUrls.includes(window.location.host);
}

export function getVideoPlayer(){

}