import { TitleContent } from "./types"
import { dropToken, login, me, register } from './api/timeEater/requests';
import { deleteAuthToken, saveAuthToken } from "./api/utils";
import { MALNode } from "./api/timeEater/types";

function setTitleContent(content: TitleContent) {
    document.getElementById('titile-img')?.setAttribute('src', content.titleImage);
    var titleSpan = document.getElementById('title-name');
    if (titleSpan) titleSpan.innerHTML = content.titleName;

    var episodeSpan = document.getElementById('episode-order');
    if (episodeSpan) episodeSpan.innerHTML = content.episodeOrder?.toString();
}

document.addEventListener('DOMContentLoaded', () => {
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
        }
    })
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.siteAnswer && request.from === 'popup') {
            const title = request.watchingData.title as MALNode;
            setTitleContent({
                titleImage: title.node.main_picture.medium, titleName: title.node.title,
                episodeOrder: request.watchingData.episodeOrder
            })
        }
    });

    me().then(response => {
        if (response.status === 401) {
            document.getElementById('login-form')?.style.removeProperty('display')
        } else if (response.status === 200) {
            document.getElementById('watching-info')?.style.removeProperty('display')
        } // TODO: Show register form 
    })

    document.getElementById('login-button')?.addEventListener('click', function (_) {
        let username = (document.getElementById('login-username') as HTMLInputElement)?.value as string;
        let password = (document.getElementById('login-password') as HTMLInputElement)?.value as string;

        login(username, password).then(
            response => {
                if (response.status !== 200) {
                    let loginMessage = document.getElementById('login-message');
                    response.json().then(data => {
                        if (!loginMessage) return;
                        loginMessage.innerHTML = data.detail;
                    })
                    loginMessage?.style.removeProperty('display'); // TODO: Show message from backend 
                } else {
                    document.getElementById('login-form')?.style.setProperty('display', 'none')
                    document.getElementById('watching-info')?.style.removeProperty('display')

                }
                return response.json()
            }
        ).then(data => {
            if (data.access_token) {
                saveAuthToken(data.access_token)
            }
        })
    })

    document.getElementById('register-button')?.addEventListener('click', function (_) {
        let username = (document.getElementById('register-username') as HTMLInputElement).value;
        let email = (document.getElementById('register-email') as HTMLInputElement).value;
        let password = (document.getElementById('register-password') as HTMLInputElement).value;

        register(username, email, password).then(
            response => {
                if (response.status === 200) {
                    document.getElementById('login-form')?.style.removeProperty('display')
                    document.getElementById('register-form')?.style.setProperty('display', 'none')
                    document.getElementById('register-message')?.style.setProperty('display', 'none')
                } else if (response.status === 409) {
                    response.json().then(data => {
                        let registerMessage = document.getElementById('register-message')
                        if (!registerMessage) return;
                        registerMessage?.style.removeProperty('display')
                        registerMessage.innerHTML = data.detail;
                    })
                }
            }
        )

    })

    document.getElementById('not-have-account-yet')?.addEventListener('click', function (_) {
        document.getElementById('login-form')?.style.setProperty('display', 'none');
        document.getElementById('register-form')?.style.removeProperty('display');
    })

    document.getElementById('logout-button')?.addEventListener('click', function (_) {
        dropToken();
        deleteAuthToken();
        document.getElementById('watching-info')?.style.setProperty('display', 'none');
        document.getElementById('login-form')?.style.removeProperty('display');
    })
})