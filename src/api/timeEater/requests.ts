import { endpoints } from "./endpoints";
import { MALTitle, Record, Me, Username, UserPassword } from "./types";
import { camelCaseKeysToUnderscore, getAuthToken, searchMaxLen } from "../utils";


export async function me(): Promise<Response>{
    const authToken = getAuthToken();
    return await fetch(endpoints.me, {method: 'GET', headers:{
        'Authorization': `Bearer ${authToken}`
    }})
}

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

export async function login(username: Username, password: UserPassword): Promise<Response>{
    const loginData = new URLSearchParams();
    loginData.append('username', username)
    loginData.append('password', password)
    return await fetch(endpoints.token, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: loginData
    })
}