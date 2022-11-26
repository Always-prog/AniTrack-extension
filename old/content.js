/* 

Reading and working with page content.
For example getting site url, current selected episode e.t.c.
Sending that data to popup .

*/
// TODO: Refactor that all

const getSeasonEpisodesCount = () => {
  if (window.location.host.includes('animejoy')){
    return document.getElementsByClassName('playlists-videos')[0].getElementsByClassName('visible').length
  }
  return 'unsupported site'
}

const getEpisodeOrder = () => {
  if (window.location.host.includes('animejoy')){
    var currentVideo = document.getElementsByClassName('playlists-videos')[0].getElementsByClassName('visible active')[0];
    return parseInt(currentVideo.textContent);
  }
  return 'unsupported site'
}

const getSeasonName = () => {
    if (window.location.host.includes('animejoy')){
      return document.getElementsByClassName('romanji')[0].textContent.replace(/ *\[[^\]]*]/, '');
    }
    return 'unsupported site'
    
}

const getTranslateType = () => {
    if (window.location.host.includes('animejoy')){
        return 'Субтитры'
    }
    return 'unsupported site'
    
}
const getSite = () => {
    return window.location.origin + window.location.pathname;
}

const getTitleSuggesions = () => {
    
}
const getSeasonSuggesions = () => {
    
}

// TODO: Background sending a message when iframe is not loaded yet. So, it not works.
const addEpisodesSwitchListener = () => {
  var notificationInnerHTML = `
  <span class="msg">Запиши просмотренное :D</span>
  <div class="close-btn">
    <span class="fas">X</span>
  </div>
  `
  if (window.location.host.includes('animejoy')){
    document.addEventListener('fullscreenchange', (_) => { 
      if (!document.getElementsByClassName('eater-alert')[0]){
        var notificationContainer = document.createElement('div')
        notificationContainer.setAttribute('class', 'eater-alert showAlert show hide-alert')
        notificationContainer.innerHTML = notificationInnerHTML;
        document.body.appendChild(notificationContainer)
    
        document.getElementsByClassName('close-btn')[0].addEventListener('click', function(){
          var alert = document.getElementsByClassName('eater-alert')[0]
          alert.classList.add("hide-alert");
        });
      }
    
      
      var alert = document.getElementsByClassName('eater-alert')[0]
      alert.classList.remove("hide-alert")
      setTimeout(() => {
        alert.classList.add('hide-alert')
      }, 5000)
    });
}


}


chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if ((msg.from === 'popup') && (msg.subject === 'content')) {
      response({
        seasonName: getSeasonName(),
        translateType: getTranslateType(),
        site: getSite(),
        titleSuggesions: getTitleSuggesions(),
        seasonSuggesions: getSeasonSuggesions(),
        episodeOrder: getEpisodeOrder(),
        episodesCount: getSeasonEpisodesCount()
        
      });
    }
  if ((msg.from === 'background') && (msg.subject === 'setNextEpisodeEvent')){
    addEpisodesSwitchListener()
  }
});