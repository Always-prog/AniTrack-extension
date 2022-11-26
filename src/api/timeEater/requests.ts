import { endpoints } from "./endpoints";
import { MALTitle, Record } from "./types";
import { camelCaseKeysToUnderscore, searchMaxLen } from "../utils";



export async function createRecord(record: Record){
    const response = await fetch(endpoints.record.create, {
        method: 'POST',
        body: JSON.stringify(camelCaseKeysToUnderscore(record))
    });
    return response;
}

export async function searchByTitleName(titleName: string): Promise<MALTitle>{
    return await fetch(endpoints.mal + `?endpoint=/v2/anime?q=${titleName.slice(0, searchMaxLen)}`, {
        method: 'GET',
    }
    ).then(response => response.json()
    ).then(data => data['data'][0]['node'])
}