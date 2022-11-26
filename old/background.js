/* 

Some background logic

*/
// TODO: Refactor that all

chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if ((msg.from === 'player') && (msg.subject === 'setNextEpisodeEvent')) {
        chrome.tabs.sendMessage(
            sender.tab.id,
            {from: 'background', subject: 'setNextEpisodeEvent'},
            () => {});
    }
});