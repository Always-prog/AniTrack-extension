/* 

Reading and working with page content.
For example getting site url, current selected episode e.t.c.
Sending that data to popup .

*/
// TODO: Refactor that all


const getEpisodeOrder = () => {
  var currentVideo = document.getElementsByClassName('playlists-videos')[0].getElementsByClassName('visible active')[0];
  return parseInt(currentVideo.textContent);
}

const getSeasonName = () => {
    return document.getElementsByClassName('romanji')[0].textContent.replace(/ *\[[^\]]*]/, '');
}

const getTranslateType = () => {
    if (window.location.host.includes('animejoy')){
        return 'Субтитры'
    }
    
}
const getSite = () => {
    return window.location.href;
}

const getTitleSuggesions = () => {
    
}
const getSeasonSuggesions = () => {
    
}

// TODO: Background sending a message when iframe is not loaded yet. So, it not works.
const addEpisodesSwitchListener = () => {
  document.getElementsByClassName('playlists-videos')[0].addEventListener('click', function(e) {
    alert('switching')
  })
}


chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if ((msg.from === 'popup') && (msg.subject === 'content')) {
      console.dir(chrome)
      response({
        seasonName: getSeasonName(),
        translateType: getTranslateType(),
        site: getSite(),
        titleSuggesions: getTitleSuggesions(),
        seasonSuggesions: getSeasonSuggesions(),
        episodeOrder: getEpisodeOrder()
        
      });
    }
    if ((msg.from === 'background') && (msg.subject === 'addSwitchingEpisodesListener')){
      addEpisodesSwitchListener();
    }
});