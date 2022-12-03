import { TitleContent } from "./types"
import { login, me } from './api/timeEater/requests';
import { response } from "express";
import { saveAuthToken } from "./api/utils";

function setTitleContent(content: TitleContent){
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
        if (tabs[0].id){
            chrome.tabs.sendMessage(
                tabs[0].id,
                {from: 'popup', subject: 'content'},
                setTitleContent
            )
        }        
    })
    me().then(response => {
        if (response.status === 401){
            document.getElementById('login-form')?.style.removeProperty('display')
        } else if (response.status === 200){
            document.getElementById('watching-info')?.style.removeProperty('display')
        } // TODO: Show register form 
    })

    document.getElementById('login-button')?.addEventListener('click', function(_) {
        let username = (document.getElementById('login-username') as HTMLInputElement)?.value as string;
        let password = (document.getElementById('login-password') as HTMLInputElement)?.value as string;
    
        login(username, password).then(
            response => {
                if (response.status !== 200){
                    let loginMessage = document.getElementById('login-message');
                    loginMessage?.style.removeProperty('display'); // TODO: Show message from backend 
                } else {
                    document.getElementById('login-form')?.style.setProperty('display', 'none')
                    document.getElementById('watching-info')?.style.removeProperty('display')
                    
                }
                return response.json()
            }
        ).then(data => {
            if (data.access_token){
                saveAuthToken(data.access_token)
            }
        })
    })
    
})