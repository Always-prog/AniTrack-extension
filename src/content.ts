import { searchByTitleName } from "./api/timeEater/requests";
import { prepareTitleName } from "./api/utils";
import { getAnimeSite, videoHosts } from "./parsers/main";
import { TitleContent } from "./types";




var siteTitleName = null;
var animeSiteProvider = getAnimeSite();
if (animeSiteProvider){  
    siteTitleName = animeSiteProvider.getTitleName(); // TOOD: program tries to parse main page also. Fix that.
    if (!siteTitleName){
        window.prompt('timeEater: site is supported, but we can\'t load the title name. Please input the name of title you watching', '');
        
    } else {
        siteTitleName = prepareTitleName(siteTitleName);
        searchByTitleName(siteTitleName).then(title => {
            localStorage.setItem('titleName', title.title)
            localStorage.setItem('titleImage', title.main_picture.medium)
            localStorage.setItem('titleId', title.id.toString())
        })
    }

}



if (videoHosts.includes(window.location.host)){
    let video = document.getElementsByTagName('video')[0] as HTMLVideoElement;
    function presaveRecord(){
        console.log('timePlayed: ', timePlayed)
        console.log('timeFrom: ', timeFrom)
        console.log('sending...')
        timePlayed = 0;
        timeFrom = 0;
    }


    let counter: ReturnType<typeof setTimeout>;
    var isPlaying = false;
    var timeFrom = 0;
    var timePlayed = 0;
    var fullscreenCount = 0;

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
        presaveRecord();
    }

    function onFullScreenChanged(event: Event){
        fullscreenCount += 1;
        if (fullscreenCount % 2 === 0){
            presaveRecord();
        }
    }

    video.addEventListener("play", videoStartedPlaying);
    video.addEventListener("playing", videoStartedPlaying);
    video.addEventListener("ended", videoStoppedPlaying);
    video.addEventListener("pause", videoStoppedPlaying);
    document.addEventListener('fullscreenchange', onFullScreenChanged);
    
}


chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if ((msg.from === 'popup') && (msg.subject === 'content') && animeSiteProvider) {
      const titleContent = {
        titleName: localStorage.getItem('titleName'),
        titleImage: localStorage.getItem('titleImage')
      } as TitleContent;
      response(titleContent);
    }
});