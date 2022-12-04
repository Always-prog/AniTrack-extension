import { getMostLikeTitleInMal } from "./api/functions";
import { createRecord, searchByTitleName } from "./api/timeEater/requests";
import { prepareTitleName } from "./api/utils";
import { getFromStorageSiteData, updateStorage } from "./helpers";
import { getAnimeSite, isVideoHost, videoHosts } from "./parsers/main";
import { RawEpisodeOrder } from "./parsers/types";
import { TitleContent } from "./types";
import { getCurrentDatetime, setToStorage } from "./utils";



var siteTitleName = null;
var animeSiteProvider = getAnimeSite();
if (animeSiteProvider && animeSiteProvider.isOnWatchingPage()){  
    siteTitleName = animeSiteProvider.getTitleName(); // TOOD: program tries to parse main page also. Fix that.
    if (!siteTitleName){
        window.prompt('timeEater: site is supported, but we can\'t load the title name. Please input the name of title you watching', '');
        
    } else {
        siteTitleName = prepareTitleName(siteTitleName);
        updateStorage(animeSiteProvider);
        getMostLikeTitleInMal(siteTitleName).then(node => {
            localStorage.setItem('titleName', node.node.title)
            localStorage.setItem('titleImage', node.node.main_picture.medium)
            localStorage.setItem('titleId', node.node.id.toString())
        })

        animeSiteProvider.onPlayerLoad(() => {
            animeSiteProvider.onEpisodeChanged(() => updateStorage(animeSiteProvider))
        })
    }

    chrome.runtime.onMessage.addListener((msg, _, response) => {
        if ((msg.from === 'popup') && (msg.subject === 'content') && animeSiteProvider && animeSiteProvider.isOnWatchingPage()) {
            const titleContent = {
            titleName: localStorage.getItem('titleName'),
            titleImage: localStorage.getItem('titleImage'),
            episodeOrder: Number(animeSiteProvider.getCurrentEpisode())
            } as TitleContent;
            response(titleContent);
        }
    });
    

}
    






if (isVideoHost(window.location.host)){
    let video = document.getElementsByTagName('video')[0] as HTMLVideoElement;

    
    function presaveRecord(){
        getFromStorageSiteData().then(
            data => {
                let record = {
                    source: 'mal',
                    sourceType: 'season',
                    sourceId: Number(data.titleId),
                    watchedFrom: timeFrom,
                    watchedTime: timePlayed,
                    watchDatetime: getCurrentDatetime(),
                    episodeOrder: Number(data.episodeOrder),
                    translateType: data.translateType,
                    site: data.site
                }
                
                console.log('timePlayed: ', timePlayed)
                console.log('timeFrom: ', timeFrom)
                console.log('sending...')
                console.log(record)
                createRecord(record)
                timePlayed = 0;
                timeFrom = 0;
            }
        )

    }


    let counter: ReturnType<typeof setTimeout>;
    var isPlaying = false;
    var timeFrom = 0;
    var timePlayed = 0;

    function videoStartedPlaying() {
        isPlaying = true;
        clearInterval(counter);

        timeFrom = Math.round(video.currentTime);
        timePlayed = 0;
        counter = setInterval(function(){
            if (isPlaying){
                timePlayed = timePlayed + 1;
            }
        }, 1000);
    }

    function videoStoppedPlaying(event: Event) {
        isPlaying = false;
        if (timePlayed > 5) presaveRecord()
    }

    function onFullScreenChanged(event: Event){
        if (timePlayed > 5){
            presaveRecord();
        }
    }
    video.addEventListener("play", videoStartedPlaying);
    video.addEventListener("playing", videoStartedPlaying);
    video.addEventListener("ended", videoStoppedPlaying);
    video.addEventListener("pause", videoStoppedPlaying);
    document.addEventListener('fullscreenchange', onFullScreenChanged);
    
}
