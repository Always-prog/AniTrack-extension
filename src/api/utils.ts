import { TitleName } from "./timeEater/types";
import { AuthToken } from "./types";

export const searchMaxLen = 64;

export function saveAuthToken(token: AuthToken){
    chrome.storage.local.set({ "timeEaterAuthToken": token }, function(){
    });
}
export function getAuthToken(){
    var authToken='';
    chrome.storage.local.get(["timeEaterAuthToken"], function(items){
        authToken=items.authToken
    });
    return authToken;
}

export function prepareTitleName(titleName: TitleName){
    /* The limit of searching in the MAL API is 64 symbols */
    /* So, we need to prepare that name to 64 symbols with saving season name  */
    return titleName.slice(0, 32) + titleName.slice(titleName.length-32, titleName.length);
}


export function camelCaseKeysToUnderscore(obj: any){
    if (typeof(obj) != "object") return obj;

    for(var oldName in obj){

        // Camel to underscore
        let newName = oldName.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});

        // Only process if names are different
        if (newName != oldName) {
            // Check for the old property name to avoid a ReferenceError in strict mode.
            if (obj.hasOwnProperty(oldName)) {
                obj[newName] = obj[oldName];
                delete obj[oldName];
            }
        }

        // Recursion
        if (typeof(obj[newName]) == "object") {
            obj[newName] = camelCaseKeysToUnderscore(obj[newName]);
        }

    }
    return obj;
}
