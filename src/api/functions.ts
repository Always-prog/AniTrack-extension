import { RawTitleName } from "../parsers/types";
import { getAnimeDetails, searchByTitleName } from "./timeEater/requests";
import { EpisodeOrder, MALNode, MALNodes } from "./timeEater/types";
import { prepareTitleName, selectMostLikeTitleName } from "./utils";



export function sortBySiteData(nodes: MALNodes, start_date?: Date){
    function sortByDate(node1: MALNode, node2: MALNode){
        const dateFromNodeString = (date: string): Date => {
            const pieces = date.split('-')
            return new Date(Number(pieces[0]), Number(pieces[1]), Number(pieces[2]))
        }
        if (!node1.node.start_date) return 1;  // if there is annons of anime, it can have no start date for now
        let date1 = dateFromNodeString(node1.node.start_date)
        let date2 = dateFromNodeString(node2.node.start_date)
        // @ts-ignore The right-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.
        if (Math.abs(start_date - date1) < Math.abs(start_date - date2)) return -1;
        // @ts-ignore The right-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.
        if (Math.abs(start_date - date1) > Math.abs(start_date - date2)) return 1;
        return 0;
    }
    if (start_date) return nodes.sort(sortByDate)

}




export async function consultWithMal(titleName: RawTitleName, episodeOrder?: EpisodeOrder, start_date?: Date): Promise<{title: MALNode, episodeOrder: EpisodeOrder}>{
    return searchByTitleName(prepareTitleName(titleName)).then(nodes => {
        let title: MALNode = nodes[0];
        if (start_date) sortBySiteData(nodes, start_date); title = nodes[0];
        if (episodeOrder && title.node.num_episodes && title.node.num_episodes < episodeOrder){
                /* 
                Num eps is lower than current watching 
                It means that user watching some next part, but on site it record as one.
                */

            let eps = title.node.num_episodes;
            const searchTitleDeeper: any = async () => {
                const data = await getAnimeDetails(title.node.id);
                let nodes = data.related_anime;
                for (var i = 0; i < nodes.length; i += 1) {
                    if (nodes[i].node.id === title.node.id)
                        continue;
                    
                    if (nodes[i].relation_type === 'sequel'){
                        const sequelNode = await getAnimeDetails(nodes[i].node.id);
                        title = {node: sequelNode}
                        
                        eps += title.node.num_episodes;
                        if (eps >= episodeOrder) break
                    }
                }

                if (eps >= episodeOrder){
                    return {
                        title: title,
                        episodeOrder: (episodeOrder + title.node.num_episodes) - eps
                    };
                } else return searchTitleDeeper();
                
            }

            return searchTitleDeeper()

        } else return Promise.resolve({
            title: title,
            episodeOrder: episodeOrder || 1
        })
    })
}