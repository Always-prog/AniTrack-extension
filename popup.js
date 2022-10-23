var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;
document.getElementById("watch_date").value = today;



const baseUrl = 'https://localhost:8000'
const endpoints = {
    search: {
        season: baseUrl + '/like/season/?',
        title_by_season: baseUrl + '/like/title/season?',
        title: baseUrl + '/like/title/?',
        intitle: baseUrl + '/like/title/season/?'
    },
    recentEpisode: baseUrl + '/recent/episode/',
    season: {
        watchedEpisodes: baseUrl + '/season/watched/episodes/?'
    },
    episodes: {
        bysite: baseUrl + '/episodes/bysite/?',
        create: baseUrl + '/episode/create/'
    }
}


const recordWatchedEpisode = () => {
    var episode = {
        season_name: document.getElementById('season_name').value,
        watch_date: document.getElementById('watch_date').value,
        episode_order: Number(document.getElementById('episode_order').value),
        episode_time: Number(document.getElementById('episode_time').value),
        watched_time: Number(document.getElementById('watched_time').value),
        translate_type: document.getElementById('translate_type').value,
        before_watch: document.getElementById('before_watch').value,
        after_watch: document.getElementById('after_watch').value,
        site: document.getElementById('site').value,
    }
    fetch(endpoints.episodes.create,
    {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(episode)
    }
    ).then(response => {
        if (response.status === 200){
            document.getElementById('push_button').innerHTML = 'Записано!'
        } else {
            document.getElementById('push_button').innerHTML = 'Что-то пошло не так. Подробности в консоли'
            console.dir(response)
        }
    })
}


document.getElementById('push_button').addEventListener('click', function(e){
    recordWatchedEpisode()
})

const setPlayerData = info => {
    document.getElementById('episode_time').value = Math.round(info.episodeDuration / 60);
    document.getElementById('watched_time').value = Math.round(info.episodeCurrentTime / 60);
}

const applyEpisodeInformation = (seasonName, titleName, episodeOrder, translateType, site) => {
    document.getElementById('season_name').value = seasonName;
    document.getElementById('title_name').value = titleName;
    document.getElementById('episode_order').value = episodeOrder;
    document.getElementById('translate_type').value = translateType;
    document.getElementById('site').value = site;    
}

const updateWithCurrentSite = info => {
    fetch(endpoints.episodes.bysite + new URLSearchParams({
        site: info.site
    })
    ).then(response => response.json()
    ).then(episodes => {
        if (episodes.length !== 0){
            var ep = episodes[0]
            var seasonName = ep.season.seasonName;
            var titleName = ep.season.title.titleName;
            var episodeOrder = info.episodeOrder;
            document.getElementById('last_viewed_episode').innerHTML = episodes.length
            

            if (ep.season.episodeCount <= episodes.length ){
                document.getElementById('watched_successfully').style.removeProperty('display');   
            }
            if (episodes.filter(e => e.episodeOrder === info.episodeOrder).length !== 0){
                document.getElementById('episode_already_exists').style.removeProperty('display');  
            }
        } else {
            var titleName = info.titleName;
            var seasonName = info.seasonName;
            var episodeOrder = info.episodeOrder;   
            document.getElementById('must_be_registered').style.removeProperty('display');   
        }
        var translateType = info.translateType;
        var site = info.site;    

        applyEpisodeInformation(seasonName, titleName, episodeOrder, translateType, site)

 
    })


};


document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      chrome.tabs.sendMessage(
          tabs[0].id,
          {from: 'popup', subject: 'content'},
          updateWithCurrentSite);
    });

    chrome.tabs.query({
        active: true,
        currentWindow: true
      }, tabs => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {from: 'popup', subject: 'player'},
            setPlayerData);
      });


});

