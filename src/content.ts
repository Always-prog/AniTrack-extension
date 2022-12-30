import { consultWithMal } from "./api/functions";
import { createRecord } from "./api/timeEater/requests";
import { getAnimeSite, isVideoHost } from "./parsers/main";
import { RawTitleName } from "./parsers/types";
import { TitleContent } from "./types";
import { getCurrentDatetime } from "./utils";



var animeSiteProvider = getAnimeSite();
if (animeSiteProvider) {
    if (animeSiteProvider.isOnWatchingPage()){
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if (request.siteRequest) {
                const episodeOrder = animeSiteProvider.getCurrentEpisode();
                consultWithMal(animeSiteProvider.getTitleName(), episodeOrder, animeSiteProvider?.getStartDate()).then(data => {
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

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.supportSiteRequest) {
            chrome.runtime.sendMessage({ supportSiteRequest: true, to: request.to, from: request.from, isSiteSupported: true, isWatchingPage: animeSiteProvider.isOnWatchingPage() })
        }
    });

}




if (isVideoHost(window.location.host)) {
    let video = document.getElementsByTagName('video')[0] as HTMLVideoElement;
    let counter: ReturnType<typeof setTimeout>;
    var isPlaying = false;
    var timeFrom = 0;
    var timePlayed = 0;


    const successLoadVideo = () => {
        console.log('success load video!')
        function videoStartedPlaying() {
            isPlaying = true;
            clearInterval(counter);
            counter = setInterval(function () {
                if (isPlaying) {
                    timePlayed += 1;
                }
            }, 1000);
        }

        function videoUnpause() {
            isPlaying = true;
            triggerSaveRecord();
        }

        function videoStoppedPlaying(event: Event) {
            isPlaying = false;
            triggerSaveRecord();
        }

        function onFullScreenChanged(event: Event) {
            triggerSaveRecord();

        }
        video.addEventListener("play", videoStartedPlaying);
        video.addEventListener("playing", videoUnpause);
        video.addEventListener("ended", videoStoppedPlaying);
        video.addEventListener("pause", videoStoppedPlaying);
        document.addEventListener('fullscreenchange', onFullScreenChanged);

    }
    let waitingVideoInterval: ReturnType<typeof setInterval> | null = null;
    if (!video) {
        if (waitingVideoInterval) clearInterval(waitingVideoInterval);

        waitingVideoInterval = setInterval(() => {
            video = document.getElementsByTagName('video')[0] as HTMLVideoElement;
            if (video) {
                successLoadVideo()
                if (waitingVideoInterval) clearInterval(waitingVideoInterval)
            }
        }, 1000)
    } else successLoadVideo()



    const triggerSaveRecord = () => {
        chrome.runtime.sendMessage({ mytab: true }, tabId => {
            chrome.runtime.sendMessage({ to: tabId.tab, siteRequest: true, from: 'video' }, function (response) {
                console.log('Triggering')
            });
        });
    }


    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.siteAnswer && request.from === 'video') {
            console.log('Saving video with data...')
            if (timePlayed > 5) {
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
                timeFrom = Math.round(video.currentTime);
            } else console.log('timePlayed is too small for saving. Skip.')
        }
    });
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.playerRequest) {
            let playerData = {
                isPlayerSupported: true
            }
            chrome.runtime.sendMessage({ playerRequest: true, to: request.to, from: request.from, playerData: playerData })
        }
    });
}
