chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.mytab) {
        sendResponse({tab: sender?.tab?.id});
     }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request)
    if (request.to && request.siteRequest)
    chrome.tabs.sendMessage(request.to, {siteRequest: true, to: request.to, from: request.from}, function(response) {
        sendResponse(response);
    });
    if (request.siteAnswer)
    chrome.tabs.sendMessage(request.to, {siteAnswer: true, ...request}, function(response) {
        sendResponse(response);
    });
});