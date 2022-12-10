import { consultWithMal } from "./api/functions";
import { createRecord } from "./api/timeEater/requests";
import { getAnimeSite, isVideoHost } from "./parsers/main";
import { RawTitleName } from "./parsers/types";
import { TitleContent } from "./types";
import { getCurrentDatetime } from "./utils";



var siteTitleName: RawTitleName | null = null;
var animeSiteProvider = getAnimeSite();
if (animeSiteProvider && animeSiteProvider.isOnWatchingPage()) {
    chrome.runtime.onMessage.addListener((msg, _, response) => {
        if ((msg.from === 'popup') && (msg.subject === 'content') && animeSiteProvider && animeSiteProvider.isOnWatchingPage()) {
            const episodeOrder = animeSiteProvider.getCurrentEpisode();
            console.log('i see request from popup')
            consultWithMal(animeSiteProvider.getTitleName(), episodeOrder, animeSiteProvider.getStartDate()).then(data => {
                const titleContent = {
                    titleName: data.title.node.title,
                    titleImage: data.title.node.main_picture.medium,
                    episodeOrder: episodeOrder
                } as TitleContent;
                console.log('i sending response')
                console.log(titleContent)
                response(titleContent);
            })

        }
    });


    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.siteRequest) {
            const episodeOrder = animeSiteProvider.getCurrentEpisode();
            consultWithMal(animeSiteProvider.getTitleName(), episodeOrder, animeSiteProvider.getStartDate()).then(data => {
                let watchingData = {
                    source: 'mal',
                    sourceType: 'season',
                    sourceId: Number(data.title.node.id),
                    episodeOrder: Number(data.episodeOrder),
                    translateType: animeSiteProvider.getTranslateType(),
                    site: animeSiteProvider.getCurrentPageURL(),
                    title: data.title
                }
                chrome.runtime.sendMessage({ siteAnswer: true, to: request.to, from: request.from, watchingData: watchingData })
            })
        }

    });
}







if (isVideoHost(window.location.host)) {
    let video = document.getElementsByTagName('video')[0] as HTMLVideoElement;
    let counter: ReturnType<typeof setTimeout>;
    var isPlaying = false;
    var timeFrom = 0;
    var timePlayed = 0;

    const triggerSaveRecord = () => {
        chrome.runtime.sendMessage({ mytab: true }, tabId => {
            chrome.runtime.sendMessage({ to: tabId.tab, siteRequest: true, from: 'video' }, function (response) {
                console.log('Triggering')
            });
        });
    }

    function videoStartedPlaying() {
        isPlaying = true;
        clearInterval(counter);

        timeFrom = Math.round(video.currentTime);
        timePlayed = 0;
        counter = setInterval(function () {
            if (isPlaying) {
                timePlayed += 1;
            }
        }, 1000);
    }

    function videoUnpause() {
        isPlaying = true;
    }

    function videoStoppedPlaying(event: Event) {
        isPlaying = false;
        if (timePlayed > 5) triggerSaveRecord()
    }

    function onFullScreenChanged(event: Event) {
        if (timePlayed > 5) {
            triggerSaveRecord();
        }
    }
    video.addEventListener("play", videoStartedPlaying);
    video.addEventListener("playing", videoUnpause);
    video.addEventListener("ended", videoStoppedPlaying);
    video.addEventListener("pause", videoStoppedPlaying);
    document.addEventListener('fullscreenchange', onFullScreenChanged);


    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.siteAnswer && request.from === 'video') {
            console.log('Saving video with data...')
            let record = {
                source: request.watchingData.source,
                sourceType: request.watchingData.sourceType,
                site: request.watchingData.site,
                sourceId: request.watchingData.sourceId,
                episodeOrder: request.watchingData.episodeOrder,
                translateType: request.watchingData.translateType,
                watchedFrom: timeFrom,
                watchedTime: timePlayed,
                watchDatetime: getCurrentDatetime().toString()
            }
            createRecord(record)
            timePlayed = 0;
            timeFrom = 0;
        }
    });

}
