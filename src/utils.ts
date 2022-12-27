import { animeSites, videoHosts } from "./parsers/main";


export function getCurrentDatetime(): string {
    var currentdate = new Date();
    var datetime = (currentdate.getMonth() + 1) + "/"
        + currentdate.getDate() + "/"
        + currentdate.getFullYear() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    return datetime;
}


export function generateTextAboutSupport(): string {
    return `
<b>сайты</b>
<ul>
${Object.keys(animeSites).map((site) => '<li>'+site+'</li>').join('')}
</ul>

<b>плееры</b>
<ul>
${Object.keys(videoHosts).map(player => '<li>'+player+'</li>').join('')}
</ul><br/>
Нет нужного вам сайта? Запросите поддержку в <a href="https://discord.gg/w3uGQXYJ2g" target="_blank">дискорд сервере приложения</a>`
}