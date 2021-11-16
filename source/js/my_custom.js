function main() {
    //redirectHttps();
    redirectNoWWW();
}

function redirectHttps() {
    if(window.location.protocol == 'http:'){
        if(window.location.port){
            log("當前網址有端口，可能處於調試模式，跳過 HTTPS 重定向。")
            return;
        }
        console.log("You are visiting from insecure HTTP, redirecting")
        let newLocation = 'https://' + window.location.host + window.location.pathname;
        window.location = newLocation;
    }
}

function redirectNoWWW() {
    if(window.location.host == 'www.galgamer.xyz'){
        log('帶 www 的網址無法載入留言區，需要重定向。');
        let newLocation = 'https://galgamer.xyz' + window.location.pathname;
        window.location = newLocation;
        return;
    }
    if(window.location.host != 'galgamer.xyz'){
        log('This URL host seems not belong to the official website.');
    }
}

function log(text) {
    let currentdate = new Date(); 
    let datetime = "[" +  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds() + "] ";
    console.log('[RedirectJS]' + datetime + text);
}

main();