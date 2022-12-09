import { SiteProvider } from "./parsers/types";



export function setToStorage(data: object){
    chrome.storage.local.set(data, function(){
    });
}

export async function getFromStorage(keys: Array<string>){
    return await chrome.storage.local.get([keys])
}

export function getCurrentDatetime(): string {
    var currentdate = new Date(); 
    var datetime =  currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/" 
    + currentdate.getFullYear() + " "  
    + currentdate.getHours() + ":"  
    + currentdate.getMinutes() + ":" 
    + currentdate.getSeconds();
    return datetime;
}
