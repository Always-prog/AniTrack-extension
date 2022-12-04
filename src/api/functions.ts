import { RawTitleName } from "../parsers/types";
import { searchByTitleName } from "./timeEater/requests";
import { selectMostLikeTitleName } from "./utils";



export async function getMostLikeTitleInMal(titleName: RawTitleName){
    return searchByTitleName(titleName).then(nodes => {
        return selectMostLikeTitleName(titleName, nodes)
    })
}