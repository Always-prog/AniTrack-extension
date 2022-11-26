import { TitleContent } from "./types"

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
})
