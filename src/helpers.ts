import { getMostLikeTitleInMal } from "./api/functions"
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
    getMostLikeTitleInMal(siteProvider.getTitleName()).then(node => {
        setToStorage({
            titleName: node.node.title,
            titleId: node.node.id.toString()
        })
    })
}

export async function getFromStorageSiteData(){
    return await chrome.storage.local.get(['episodeOrder', 'translateType', 'site', 'titleName', 'titleId'])
}