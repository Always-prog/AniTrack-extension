import { searchByTitleName } from "./api/timeEater/requests"
import { SiteProvider } from "./parsers/types"
import { setToStorage } from "./utils"



export function updateStorage(siteProvider: SiteProvider){
    siteProvider.onPlayerLoad(() => {
        setToStorage({episodeOrder: siteProvider.getCurrentEpisode().toString()})
    })
    setToStorage({
        translateType: siteProvider.getTranslateType(),
        site: siteProvider.getCurrentPageURL()
    })
    searchByTitleName(siteProvider.getTitleName()).then(title => {
        setToStorage({
            titleName: title.title,
            titleId: title.id.toString()
        })
    })
}

export async function getFromStorageSiteData(){
    return await chrome.storage.local.get(['episodeOrder', 'translateType', 'site', 'titleName', 'titleId'])
}