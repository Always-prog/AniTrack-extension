/* 

Some background logic

*/

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.active) {
        console.dir(chrome)
        chrome.tabs.sendMessage(tabId, {
            from: 'background',
            subject: 'addSwitchingEpisodesListener'
        })
    }
  })