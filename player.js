/* 

Here's is logic for getting data from watching video.
It selecting data from iframe's D: (all_frames options)

*/
// TODO: Refactor that all

const getDuration = () => {
    var video = document.getElementsByTagName('video')[0];
    return video.duration;
}
const getEpisodeCurrentTime = () => {
    var video = document.getElementsByTagName('video')[0];
    return video.currentTime;
}

chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if ((msg.from === 'popup') && (msg.subject === 'player')) {
      response({
        episodeDuration: getDuration(),
        episodeCurrentTime: getEpisodeCurrentTime(),
        iam: 'player listener'
    });
    }
});