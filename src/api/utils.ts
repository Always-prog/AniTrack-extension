import { RawTitleName } from "../parsers/types";
import { searchByTitleName } from "./timeEater/requests";
import { MALNode, MALNodes, TitleName } from "./timeEater/types";
import { AuthToken } from "./types";

export const searchMaxLen = 64;
export const authTokenKey = 'timeEaterAuthToken';


export function saveAuthToken(token: AuthToken){
    chrome.storage.local.set({[authTokenKey]: token }, function(){
    });
}
export async function getAuthToken(){
    return await chrome.storage.local.get([authTokenKey]).then(data => data.timeEaterAuthToken)
}
export function deleteAuthToken(){
    chrome.storage.local.remove(authTokenKey)

}
export function prepareTitleName(titleName: TitleName){
    /* The limit of searching in the MAL API is 64 symbols */
    /* So, we need to prepare that name to 64 symbols with saving season name  */
    if (titleName.length <= searchMaxLen) return titleName;
    return titleName.slice(0, 32) + titleName.slice(titleName.length-32, titleName.length);
}

export function selectMostLikeTitleName(titleName: RawTitleName, nodes: MALNodes): MALNode {
    var mostPercent = 0;
    var mostNode = nodes[0];
    nodes.forEach(node => {
        let percent = similarity(titleName, node.node.title)
        if (percent > mostPercent){
            mostNode = node
            mostPercent = percent
        }
            
    })
    return mostNode;

}

function similarity(s1: string, s2: string) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength.toString());
  }

function editDistance(s1: string, s2: string) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
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
