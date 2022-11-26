// TODO: Refactor that all

var now = new Date();
var utcString = now.toISOString().substring(0,19);
var year = now.getFullYear();
var month = now.getMonth() + 1;
var day = now.getDate();
var hour = now.getHours();
var minute = now.getMinutes();
var second = now.getSeconds();
var localDatetime = year + "-" +
                    (month < 10 ? "0" + month.toString() : month) + "-" +
                    (day < 10 ? "0" + day.toString() : day) + "T" +
                    (hour < 10 ? "0" + hour.toString() : hour) + ":" +
                    (minute < 10 ? "0" + minute.toString() : minute) +
                    utcString.substring(16,19);

document.getElementById("watch_datetime").value = localDatetime;



const baseUrl = 'https://localhost:8000'
const endpoints = {
    title: {
        get: baseUrl + '/title/?',
        all: baseUrl + '/titles/',
        create: baseUrl + '/title/create/',
        delete: baseUrl + '/title/',
        update: baseUrl + '/title/'
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
        delete: baseUrl + '/season/',
        update: baseUrl + '/season/'
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
        season_id: localStorage.getItem('currentSeasonId'),
        watch_datetime: document.getElementById('watch_datetime').value,
        episode_order: Number(document.getElementById('episode_order').value),
        duration: Number(document.getElementById('duration').value),
        watched_time: Number(document.getElementById('watched_time').value),
        translate_type: document.getElementById('translate_type').value,
        comment: document.getElementById('comment').value,
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

const recordSeasonSummary = () => {
    var updateFields = {
        id: document.getElementById('summary_season').value,
        updated_fields: {
            summary: document.getElementById('summary_about_season').value
        }
    }
    fetch(endpoints.season.update, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify(updateFields)
    }).then(response => {
        if (response.status === 200){
            document.getElementById('summary_season_record_button').innerHTML = 'Записано.'
        } else {
            document.getElementById('summary_season_record_button').innerHTML = 'Что-то пошло не так. Подробности в консоли'
            console.dir(response)
        }
    })
}
const recordTitleSummary = () => {
    var updateFields = {
        title_name: document.getElementById('summary_title_name').value,
        updated_fields: {
            summary: document.getElementById('summary_about_title').value
        }
    }
    fetch(endpoints.title.update, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify(updateFields)
    }).then(response => {
        if (response.status === 200){
            document.getElementById('summary_title_record_button').innerHTML = 'Записано.'
        } else {
            document.getElementById('summary_title_record_button').innerHTML = 'Что-то пошло не так. Подробности в консоли'
            console.dir(response)
        }
    })
}

const deleteEpisode = async (id) => {
    return await fetch(endpoints.episodes.delete, {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id
        })
    });
}
const deleteSeason = async (id) => {
    return await fetch(endpoints.season.delete, {
        method: 'delete',                
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id
        })
    })
}

const deleteTitle = async (name) => {
    return fetch(endpoints.title.delete, {
        method: 'delete',                
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title_name: name
        })
    })
}

const setPlayerData = info => {
    document.getElementById('duration').value = Math.round((info?.episodeDuration / 60) * 100) / 100;
    document.getElementById('watched_time').value = Math.round((info?.episodeCurrentTime / 60) * 100) / 100;
}

const generateMiniEpisodes = (season) => {
    var wacthedEpisodesMap = season.episodes.reduce((obj, ep) => Object.assign(obj, { [ep.episodeOrder]: ep }), {});
    return [...Array(season.episodeCount).keys()].map(epOrder => {
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
}


const setSiteData = info => {
    fetch(endpoints.season.bysite + new URLSearchParams({
        site: info.site
    })
    ).then(response => response.json()
    ).then(season => {
        if (season?.id){
            localStorage.setItem('currentSeasonId', season.id);
            var seasonName = season.seasonName;
            var titleName = season.title.titleName;
            var currentEpisode = season.episodes.filter(e => e.episodeOrder === info.episodeOrder)[0]

            if (season.episodeCount <= season.episodes.length){
                document.getElementById('watched_successfully').style.removeProperty('display');   
            }
            if (currentEpisode){
                document.getElementById('episode_already_exists').style.removeProperty('display');  
                document.getElementById('comment').value = currentEpisode.comment;
            }

            document.getElementById('watched_episodes_list').innerHTML = generateMiniEpisodes(season);
            document.getElementById('seems_season_already_exists').style.removeProperty('display');  
        } else {
            var titleName = info.titleName;
            var seasonName = info.seasonName;
            document.getElementById('must_be_registered').style.removeProperty('display');   
        }

        showSiteInformation(seasonName, titleName, info.episodeOrder, info.translateType, info.site)
    })


    const createTagWithArgs = (tag, args) => {
        element = document.createElement(tag)
        Object.keys(args).forEach(arg => {
            element[arg] = args[arg];
        })
        return element;
    }
    fetch(endpoints.title.all
    ).then(response => response.json()
    ).then(titles => {
        var registrationTitles = document.getElementById('reg_title_name')
        var deletingTitles = document.getElementById('delete_title_name')
        var summaryTitles = document.getElementById('summary_title_name')
        titles.forEach(title => {
            const titleNameOptionRegister = createTagWithArgs('option', {value: title.titleName, innerHTML: title.titleName})
            const titleNameOptionDelete = createTagWithArgs('option', {value: title.titleName, innerHTML: title.titleName})
            const titleNameOptionSummary = createTagWithArgs('option', {value: title.titleName, innerHTML: title.titleName})

            registrationTitles.appendChild(titleNameOptionRegister)
            deletingTitles.appendChild(titleNameOptionDelete)
            summaryTitles.appendChild(titleNameOptionSummary)
        })
    }
    )

    var deleteTitleSection = document.getElementById('delete_title_name')
    var deleteSeasonSection = document.getElementById('delete_season_name')
    var deleteEpisodeSection = document.getElementById('delete_episode_order')

    var summaryTitleSection = document.getElementById('summary_title_name')
    var summarySeasonSection = document.getElementById('summary_season')
    var deleteButton = document.getElementById('delete_button');
    deleteTitleSection.addEventListener('change', (_) => {
        fetch(endpoints.title.get + new URLSearchParams({
            title_name: deleteTitleSection.value
        })
        ).then(response => response.json()
        ).then(title => {
            title.seasons.forEach(season => {
                const seasonNameOption = createTagWithArgs('option', {value: season.id, innerHTML: season.seasonName})
                deleteSeasonSection.appendChild(seasonNameOption)
            })
            deleteSeasonSection.removeAttribute('disabled');
        })
    })
    deleteSeasonSection.addEventListener('change', (e) => {
        fetch(endpoints.season.get + new URLSearchParams({
            id: deleteSeasonSection.value
        })
        ).then(response => response.json()
        ).then(season => {
            season.episodes.forEach(episode => {
                const episodeOrderOption = createTagWithArgs('option', {
                    value: episode.id, innerHTML: `${episode.episodeName} (${episode.episodeOrder})`
                })
                deleteEpisodeSection.appendChild(episodeOrderOption)
            })
        })
        deleteEpisodeSection.removeAttribute('disabled');
    })
    deleteButton.addEventListener('click', (_) => {
        const titleName = deleteTitleSection.value;
        const seasonId = deleteSeasonSection.value;
        const episodeId = deleteEpisodeSection.value;

        if (episodeId && seasonId && titleName){
            var [deleteFunction, objectId] = [deleteEpisode, episodeId]
        } else if (seasonId && titleName){
            var [deleteFunction, objectId] = [deleteSeason, seasonId]
        } else if (titleName){
            var [deleteFunction, objectId] = [deleteTitle, titleName]
        }
        deleteFunction(objectId).then(response => {
            if (response.status === 200){
                deleteButton.innerHTML = 'Удалено!'
            } else {
                deleteButton.innerHTML = 'Что-то пошло не так. Подробности в консоли.'
                console.dir(response)
            }
        })
    })
    summaryTitleSection.addEventListener('change', (e) => {
        fetch(endpoints.title.get + new URLSearchParams({
            title_name: summaryTitleSection.value
        })
        ).then(response => response.json()
        ).then(title => {
            title.seasons.forEach(season => {
                const seasonNameOption = createTagWithArgs('option', {value: season.id, innerHTML: season.seasonName})
                summarySeasonSection.appendChild(seasonNameOption)
            })
            document.getElementById('summary_about_title').value = title.summary;
            summarySeasonSection.removeAttribute('disabled');
        })
    })
    summarySeasonSection.addEventListener('change', (e) => {
        fetch(endpoints.season.get + new URLSearchParams({
            id: summarySeasonSection.value
        })
        ).then(response => response.json()
        ).then(season => {
            document.getElementById('summary_about_season').value = season.summary || '';
        })
    })
    document.getElementById('comment').value = localStorage.getItem('comment_no_saved_content');
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
    localStorage.setItem('comment_no_saved_content', '')
    createEpisodeEvent()
})

document.getElementById('create_season_button').addEventListener('click', function(e){
    createSeasonEvent()
})
document.getElementById('create_title_button').addEventListener('click', function(e){
    createTitleEvent()
})

document.getElementById('comment').addEventListener('change', function(e) {
    localStorage.setItem('comment_no_saved_content', e.target.value)
    
})
document.getElementById('summary_title_record_button').addEventListener('click', function(e){
    recordTitleSummary()
})
document.getElementById('summary_season_record_button').addEventListener('click', function(e){
    recordSeasonSummary()
})