
const getDuration = () => {
    var video = document.getElementsByTagName('video')[0];
    return video.duration;
}
const getEpisodeCurrentTime = () => {
    var video = document.getElementsByTagName('video')[0];
    return video.currentTime;
}

chrome.runtime.onMessage.addListener((msg, _, response) => {
    if ((msg.subject === 'playerData')) {
      response({
        episodeDuration: getDuration(),
        episodeCurrentTime: getEpisodeCurrentTime(),
    });
    }
});