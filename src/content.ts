import { consultWithMal } from "./api/functions";
import { createRecord, searchByTitleName } from "./api/timeEater/requests";
import { prepareTitleName } from "./api/utils";
import { getFromStorageSiteData, updateStorage } from "./helpers";
import { getAnimeSite, isVideoHost, videoHosts } from "./parsers/main";
import { RawEpisodeOrder, RawTitleName } from "./parsers/types";
import { TitleContent } from "./types";
import { getCurrentDatetime, getFromStorage, setToStorage } from "./utils";



var siteTitleName: RawTitleName | null = null;
var animeSiteProvider = getAnimeSite();
if (animeSiteProvider && animeSiteProvider.isOnWatchingPage()){  
    siteTitleName = animeSiteProvider.getTitleName(); // TOOD: program tries to parse main page also. Fix that.
    if (!siteTitleName){
        window.prompt('timeEater: site is supported, but we can\'t load the title name. Please input the name of title you watching', '');
        
    } else {
        
        const updateInLocal = () => {
            if (siteTitleName){
                const episodeOrder = animeSiteProvider.getCurrentEpisode();
                consultWithMal(siteTitleName, episodeOrder, animeSiteProvider.getStartDate()).then(data => {
                    localStorage.setItem('titleName', data.title.node.title)
                    localStorage.setItem('titleImage', data.title.node.main_picture.medium)
                    localStorage.setItem('titleId', data.title.node.id.toString())
                    localStorage.setItem('site', window.location.href)
                    localStorage.setItem('episodeOrder', data.episodeOrder.toString())
                })
            }
        }
        updateInLocal();
        updateStorage(animeSiteProvider);
        

        animeSiteProvider.onPlayerLoad(() => {
            animeSiteProvider.onEpisodeChanged(() => {
                updateInLocal()
                updateStorage(animeSiteProvider)
            })
        })
        
    }

    chrome.runtime.onMessage.addListener((msg, _, response) => {
        if ((msg.from === 'popup') && (msg.subject === 'content') && animeSiteProvider && animeSiteProvider.isOnWatchingPage()) {
            const titleContent = {
                titleName: localStorage.getItem('titleName'),
                titleImage: localStorage.getItem('titleImage'),
                episodeOrder: Number(localStorage.getItem('episodeOrder'))
                } as TitleContent;
                response(titleContent);
        }
    });
    

}
    






if (isVideoHost(window.location.host)){
    let video = document.getElementsByTagName('video')[0] as HTMLVideoElement;
    let counter: ReturnType<typeof setTimeout>;
    var isPlaying = false;
    var timeFrom = 0;
    var timePlayed = 0;
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

    function videoStartedPlaying() {
        if (timePlayed > 5) presaveRecord() // playing event also trigger changing in timeline

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

    function videoUnpause(){
        isPlaying = true;
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
    video.addEventListener("playing", videoUnpause);
    video.addEventListener("ended", videoStoppedPlaying);
    video.addEventListener("pause", videoStoppedPlaying);
    document.addEventListener('fullscreenchange', onFullScreenChanged);
    
}
