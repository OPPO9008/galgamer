/* 
 * Naive code by 桐遠暮羽 for Galgamer
 * Add some custom feature
 * Repo: https://github.com/OPPO9008/galgamer
 */

function main() {
    //redirectHttps();
    redirectNoWWW();
    createShareBtn();
}

// Share to Telegram button
function createShareBtn() {
    // 創建這個按鈕
    let btn = document.createElement('a');
    btn.setAttribute('class', 'btn btn-info btn-sm mr-5');
    btn.setAttribute('role', 'button');
    btn.setAttribute('id', 'shareBtn');
    
    let logo = document.createElement('img');
    logo.setAttribute('width', '28px');
    logo.setAttribute('src', '/image/TGLogo.png');
    
    let mText = document.createElement('span');
    mText.innerHTML = '分享';
    
    btn.appendChild(logo);
    btn.appendChild(mText);
    // 按鈕插入頁面
    let insertTo = document.getElementById('navbar-toggler-btn');
    insertTo.parentNode.insertBefore(btn, insertTo);
    // 按鈕點擊事件
    btn.addEventListener('click', function (e){
        // url and text for TG share
        let url = window.location;
        let title = document.querySelectorAll('meta[property="og:title"]')[0].content;
        let tags = document.querySelectorAll('meta[property="article:tag"]');
        let tagStr = '';
        if(tags.length) {
            tags.forEach(function (tag){
                tagStr += '#' + tag.content + ' ';
            });
        }
        let desc = title + '\n' + tagStr;
        //log(url);
        //log(desc);
        url = encodeURIComponent(url);
        desc = encodeURIComponent(desc);
        // TG call
        window.location = 'tg://msg_url?url=' + url + '&text=' + desc;
    });
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
    console.log('[CustomJS]' + datetime + text);
}

main();