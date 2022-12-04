import { endpoints } from "./endpoints";
import { MALTitle, Record, Me, Username, UserPassword, UserEmail, MALNodes } from "./types";
import { camelCaseKeysToUnderscore, getAuthToken, prepareTitleName } from "../utils";


export async function me(): Promise<Response>{
    return await getAuthToken().then(authToken => {
        return fetch(endpoints.me, {method: 'GET', headers:{
            'Authorization': `Bearer ${authToken}`
        }})
    })

}

export async function createRecord(record: Record){
    return await getAuthToken().then(authToken => {
        return fetch(endpoints.record.create, {
            method: 'POST',
            headers:{
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },    
            body: JSON.stringify(camelCaseKeysToUnderscore(record))
        });
    })
}

export async function searchByTitleName(titleName: string, limit: number = 10): Promise<MALNodes>{
    return await fetch(endpoints.mal + `?endpoint=/v2/anime?q=${prepareTitleName(titleName)}&limit=${limit}`, {
        method: 'GET',
    }
    ).then(response => response.json()
    ).then(json => json['data'])
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

export async function register(username: Username, email: UserEmail, password: UserPassword): Promise<Response>{
    return await fetch(endpoints.register, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
        })
    })
}

export async function dropToken(){
    return await getAuthToken().then(authToken => {
        return fetch(endpoints.dropToken, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
        })
    })

}