import { TitleContent } from "./types"
import { dropToken, login, me, register } from './api/timeEater/requests';
import { deleteAuthToken, saveAuthToken } from "./api/utils";
import { MALNode } from "./api/timeEater/types";
import { generateTextAboutSupport } from "./utils";


const byId = (id: string) => document.getElementById(id)

function setTitleContent(content: TitleContent) {
    byId('titile-img')?.setAttribute('src', content.titleImage);
    var titleSpan = byId('title-name');
    if (titleSpan) titleSpan.innerHTML = content.titleName;

    var episodeSpan = byId('episode-order');
    if (episodeSpan) episodeSpan.innerHTML = content.episodeOrder?.toString();
}

document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.siteAnswer && request.from === 'popup') {
            const title = request.watchingData.title as MALNode;
            setTitleContent({
                titleImage: title.node.main_picture.medium, titleName: title.node.title,
                episodeOrder: request.watchingData.episodeOrder
            })

        } else if (request.playerRequest && request.from === 'popup') {
            let playerSupportInfo = byId('player-support-text');
            if (playerSupportInfo) {
                playerSupportInfo.innerHTML = request.playerData?.isPlayerSupported ? 'Player is supported✅' : 'Player is not found or supported❌';
            }

        } else if (request.supportSiteRequest && request.from === 'popup'){
            let siteSupportInfo = byId('site-support-text');
            let isWatchingPage = byId('is-watching-page-text');
            if (siteSupportInfo?.innerHTML) siteSupportInfo.innerHTML = request.isSiteSupported ? 'Site is supported ✅' : 'Site is not supported❌';
            if (isWatchingPage?.innerHTML) isWatchingPage.innerHTML = request.isWatchingPage ? 'Page contains anime✅' : 'Page not contains anime❌'
        }
    });

    const requestContentData = () => {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, tabs => {
            if (tabs[0].id) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    { from: 'popup', to: tabs[0].id, siteRequest: true },
                    () => { }
                )
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    { from: 'popup', to: tabs[0].id, playerRequest: true },
                    () => { }
                ),
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    { from: 'popup', to: tabs[0].id, supportSiteRequest: true },
                    () => { }
                )
            }
        })
    }

    me().then(response => {
        if (response.status === 401) {
            byId('login-form')?.style.removeProperty('display')
        } else if (response.status === 200) {
            byId('watching-info')?.style.removeProperty('display')
            requestContentData();
        } // TODO: Show register form 
    })

    byId('login-button')?.addEventListener('click', function (_) {
        let username = (byId('login-username') as HTMLInputElement)?.value as string;
        let password = (byId('login-password') as HTMLInputElement)?.value as string;

        login(username, password).then(
            response => {
                if (response.status !== 200) {
                    let loginMessage = byId('login-message');
                    response.json().then(data => {
                        if (!loginMessage) return;
                        loginMessage.innerHTML = data.detail;
                    })
                    loginMessage?.style.removeProperty('display'); // TODO: Show message from backend 
                } else {
                    byId('login-form')?.style.setProperty('display', 'none')
                    byId('watching-info')?.style.removeProperty('display')
                    

                }
                return response.json()
            }
        ).then(data => {
            if (data.access_token) {
                saveAuthToken(data.access_token)
                requestContentData();
            }
        })
    })

    byId('register-button')?.addEventListener('click', function (_) {
        let username = (byId('register-username') as HTMLInputElement).value;
        let email = (byId('register-email') as HTMLInputElement).value;
        let password = (byId('register-password') as HTMLInputElement).value;

        register(username, email, password).then(
            response => {
                if (response.status === 200) {
                    byId('login-form')?.style.removeProperty('display')
                    byId('register-form')?.style.setProperty('display', 'none')
                    byId('register-message')?.style.setProperty('display', 'none')
                } else if (response.status === 409) {
                    response.json().then(data => {
                        let registerMessage = byId('register-message')
                        if (!registerMessage) return;
                        registerMessage?.style.removeProperty('display')
                        registerMessage.innerHTML = data.detail;
                    })
                }
            }
        )

    })

    byId('not-have-account-yet')?.addEventListener('click', function (_) {
        byId('login-form')?.style.setProperty('display', 'none');
        byId('register-form')?.style.removeProperty('display');
    })

    byId('logout-button')?.addEventListener('click', function (_) {
        dropToken();
        deleteAuthToken();
        byId('watching-info')?.style.setProperty('display', 'none');
        byId('login-form')?.style.removeProperty('display');
    })
    byId('get-list-of-supported')?.addEventListener('click', function (_) {
        byId('watching-info')?.style.setProperty('display', 'none');
        byId('support-list')?.style.removeProperty('display');
    });
    byId('back-to-watching-from-support')?.addEventListener('click', function (_) {
        byId('support-list')?.style.setProperty('display', 'none');
        byId('watching-info')?.style.removeProperty('display');
    })

    let supportListContent = byId('support-list-content');
    if (supportListContent) {
        supportListContent.innerHTML = generateTextAboutSupport()
    }
})