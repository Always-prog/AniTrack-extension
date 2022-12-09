import { consultWithMal } from "./api/functions"
import { searchByTitleName } from "./api/timeEater/requests"
import { SiteProvider } from "./parsers/types"
import { setToStorage } from "./utils"



export function updateStorage(siteProvider: SiteProvider){
   
    const update = () => {
        let episodeOrder = siteProvider.getCurrentEpisode();
        consultWithMal(siteProvider.getTitleName(), episodeOrder, siteProvider.getStartDate()).then(data => {
            setToStorage({
                titleName: data.title.node.title,
                titleId: data.title.node.id.toString(),
                titleImage: data.title.node.main_picture.medium,
                episodeOrder: data.episodeOrder
            })
        })
    }
    if (!siteProvider.getCurrentEpisode())
        siteProvider.onPlayerLoad(() => {
            update()
        })
    else update()

    setToStorage({
        translateType: siteProvider.getTranslateType(),
        site: siteProvider.getCurrentPageURL()
    })

}

export async function getFromStorageSiteData(){
    return await chrome.storage.local.get(['episodeOrder', 'translateType', 'site', 'titleName', 'titleId', 'titleImage'])
}