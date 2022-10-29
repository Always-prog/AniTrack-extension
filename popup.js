// TODO: Refactor that all

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;
document.getElementById("watch_date").value = today;



const baseUrl = 'https://localhost:8000'
const endpoints = {
    title: {
        get: baseUrl + '/title/?',
        all: baseUrl + '/titles/',
        create: baseUrl + '/title/create/',
        delete: baseUrl + '/title/'
    },
    search: {
        season: baseUrl + '/like/season/?',
        title_by_season: baseUrl + '/like/title/season?',
        title: baseUrl + '/like/title/?',
        intitle: baseUrl + '/like/title/season/?'
    },
    recentEpisode: baseUrl + '/recent/episode/',
    season: {
        watchedEpisodes: baseUrl + '/season/watched/episodes/?',
        create: baseUrl + '/season/create/',
        bysite: baseUrl + '/season/bysite/?',
        get: baseUrl + '/season/?',
        delete: baseUrl + '/season/'
    },
    episodes: {
        bysite: baseUrl + '/episodes/bysite/?',
        create: baseUrl + '/episode/create/',
        delete: baseUrl + '/episode/'
    },
    content: {
        bysite: baseUrl + '/content/bysite/?',
    }
}


const createEpisodeEvent = () => {
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

const createSeasonEvent =() => {
    var season = {
        season_name: document.getElementById('reg_season_name').value,
        title_name: document.getElementById('reg_title_name').value,
        episodes_count: document.getElementById('reg_episodes_count').value,
        watch_motivation: document.getElementById('reg_watch_motivation_season').value,
        site: document.getElementById('site').value
    }
    fetch(endpoints.season.create, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(season)
    }).then(response => {
        if (response.status === 200){
            document.getElementById('create_season_button').innerHTML = 'Зарегистрирован!'
        } else {
            document.getElementById('create_season_button').innerHTML = 'Что-то пошло не так. Подробности в консоли'
            console.dir(response)
        }
    })
}

const createTitleEvent =() => {
    var title = {
        title_name: document.getElementById('reg_new_title_name').value,
        watch_motivation: document.getElementById('reg_watch_motivation_title').value
    }
    fetch(endpoints.title.create, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(title)
    }).then(response => {
        if (response.status === 200){
            document.getElementById('create_title_button').innerHTML = 'Зарегистрирован!'
        } else {
            document.getElementById('create_title_button').innerHTML = 'Что-то пошло не так. Подробности в консоли'
            console.dir(response)
        }
    })
}



const setPlayerData = info => {
    console.log(info)
    document.getElementById('episode_time').value = Math.round(info?.episodeDuration / 60);
    document.getElementById('watched_time').value = Math.round(info?.episodeCurrentTime / 60);
}


const setSiteData = info => {
    fetch(endpoints.season.bysite + new URLSearchParams({
        site: info.site
    })
    ).then(response => response.json()
    ).then(season => {
        console.log(season)
        
        if (season.seasonName){
            var seasonName = season.seasonName;
            var titleName = season.title.titleName;
            var episodeOrder = info.episodeOrder;

            if (season.episodeCount <= season.episodes.length){
                document.getElementById('watched_successfully').style.removeProperty('display');   
            }
            if (season.episodes.filter(e => e.episodeOrder === info.episodeOrder).length !== 0){
                document.getElementById('episode_already_exists').style.removeProperty('display');  
            }
            var wacthedEpisodesMap = season.episodes.reduce((obj, ep) => Object.assign(obj, { [ep.episodeOrder]: ep }), {});
            document.getElementById('watched_episodes_list').innerHTML = [...Array(season.episodeCount).keys()].map(epOrder => {
                epOrder = epOrder +1 
                ep = wacthedEpisodesMap[epOrder]
                if (wacthedEpisodesMap[epOrder]){
                    return `
                    <span style="background: green;" 
                    title="Серия: ${ep.episodeOrder}&#10;Дата просмотра: ${ep.watchDate}&#10;Минут просмотрено: ${ep.watchedTime}"
                    >
                    ${epOrder}
                    </span>`
                } else {
                    return `<span>${epOrder}</span>`
                }
            }).join('|')
            document.getElementById('seems_season_already_exists').style.removeProperty('display');  
        } else {
            var titleName = info.titleName;
            var seasonName = info.seasonName;
            var episodeOrder = info.episodeOrder;
            document.getElementById('must_be_registered').style.removeProperty('display');   
        }
        var translateType = info.translateType;
        var site = info.site;    

        showSiteInformation(seasonName, titleName, episodeOrder, translateType, site)
    })
    fetch(endpoints.title.all
    ).then(response => response.json()
    ).then(titles => {
        var registrationTitles = document.getElementById('reg_title_name')
        var deletingTitles = document.getElementById('delete_title_name')
        titles.forEach(title => {
            let titleNameOption = document.createElement('option')
            titleNameOption.value = title.titleName;
            titleNameOption.innerHTML = title.titleName;

            let titleNameOption2 = document.createElement('option')
            titleNameOption2.value = title.titleName;
            titleNameOption2.innerHTML = title.titleName;

            registrationTitles.appendChild(titleNameOption)
            deletingTitles.appendChild(titleNameOption2)
        })
    }
    )
    var deleteTitleSection = document.getElementById('delete_title_name')
    var deleteSeasonSection = document.getElementById('delete_season_name')
    var deleteEpisodeSection = document.getElementById('delete_episode_order')
    var deleteButton = document.getElementById('delete_button');
    deleteTitleSection.addEventListener('change', (e) => {
        fetch(endpoints.title.get + new URLSearchParams({
            title_name: deleteTitleSection.value
        })
        ).then(response => response.json()
        ).then(title => {
            title.seasons.forEach(season => {
                let seasonNameOption = document.createElement('option')
                seasonNameOption.value = season.seasonName;
                seasonNameOption.innerHTML = season.seasonName;
                deleteSeasonSection.appendChild(seasonNameOption)
            })
            deleteSeasonSection.removeAttribute('disabled');
        })
    })
    deleteSeasonSection.addEventListener('change', (e) => {
        fetch(endpoints.season.get + new URLSearchParams({
            season_name: deleteSeasonSection.value
        })
        ).then(response => response.json()
        ).then(season => {
            season.episodes.forEach(episode => {
                let episodeOrderOption = document.createElement('option')
                episodeOrderOption.value = episode.episodeName;
                episodeOrderOption.innerHTML = `${episode.episodeName} (${episode.episodeOrder})`;
                deleteEpisodeSection.appendChild(episodeOrderOption)
            })
        })
        deleteEpisodeSection.removeAttribute('disabled');
    })
    deleteButton.addEventListener('click', (_) => {
        const titleName = deleteTitleSection.value;
        const seasonName = deleteSeasonSection.value;
        const episodeName = deleteEpisodeSection.value;
        if (episodeName && seasonName && titleName){
            fetch(endpoints.episodes.delete, {
                method: 'delete',                
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    episode_name: episodeName
                })
            }).then(response => {
                if (response.status === 200){
                    deleteButton.innerHTML = 'Удалено!'
                } else {
                    deleteButton.innerHTML = 'Что-то пошло не так. Подробности в консоли.'
                    console.dir(response)
                }
            })
        } else if (seasonName && titleName){
            fetch(endpoints.season.delete, {
                method: 'delete',                
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    season_name: seasonName
                })
            }).then(response => {
                if (response.status === 200){
                    deleteButton.innerHTML = 'Удалено!'
                } else {
                    deleteButton.innerHTML = 'Что-то пошло не так. Подробности в консоли.'
                    console.dir(response)
                }
            })
        } else if (titleName){
            fetch(endpoints.title.delete, {
                method: 'delete',                
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title_name: titleName
                })
            }).then(response => {
                if (response.status === 200){
                    deleteButton.innerHTML = 'Удалено!'
                } else {
                    deleteButton.innerHTML = 'Что-то пошло не так. Подробности в консоли.'
                    console.dir(response)
                }
            })
        }
    })
    document.getElementById('before_watch').value = localStorage.getItem('before_watch_no_saved_content');
    document.getElementById('after_watch').value = localStorage.getItem('after_watch_no_saved_content');
    document.getElementById('reg_season_name').value = info.seasonName;
    document.getElementById('reg_episodes_count').value = info.episodesCount;
};

const showSiteInformation = (seasonName, titleName, episodeOrder, translateType, site) => {
    document.getElementById('season_name').value = seasonName;
    document.getElementById('title_name').value = titleName;
    document.getElementById('episode_order').value = episodeOrder;
    document.getElementById('translate_type').value = translateType;
    document.getElementById('site').value = site;    
}




document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      chrome.tabs.sendMessage(
          tabs[0].id,
          {from: 'popup', subject: 'content'},
          setSiteData);
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


document.getElementById('push_button').addEventListener('click', function(e){
    localStorage.setItem('before_watch_no_saved_content', '')
    localStorage.setItem('after_watch_no_saved_content', '')
    createEpisodeEvent()
})

document.getElementById('create_season_button').addEventListener('click', function(e){
    createSeasonEvent()
})
document.getElementById('create_title_button').addEventListener('click', function(e){
    createTitleEvent()
})

document.getElementById('before_watch').addEventListener('change', function(e) {
    localStorage.setItem('before_watch_no_saved_content', e.target.value)
    
})
document.getElementById('after_watch').addEventListener('change', function(e) {
    localStorage.setItem('after_watch_no_saved_content', e.target.value)
    
})