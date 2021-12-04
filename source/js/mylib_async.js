/* 
    Some function can run without DOM
*/

function main(){
    //redirectHttps();
    redirectNoWWW();
}

function redirectHttps() {
    if(window.location.protocol == 'http:'){
        if(window.location.port){
            log("當前網址有端口，可能處於調試模式，跳過 HTTPS 重定向。")
            return;
        }
        log("You are visiting from insecure HTTP, redirecting")
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
    console.log('[Log]' + datetime + text);
}

function getDark(){
    let mhtml = document.querySelectorAll('[data-user-color-scheme]')[0];
    let result = mhtml.getAttribute('data-user-color-scheme');
    return result === 'dark';
}

function checkMinSize(size){
    let width = screen.height;
    let height = screen.width;

    if( height < width) {
        let test = height;
    } else {
        let test = width;
    }
    test = test * window.devicePixelRatio;
    Log('The screen size is ' + test);
    return test > size;
}

function checkSafari(){
    let isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
               navigator.userAgent &&
               navigator.userAgent.indexOf('CriOS') == -1 &&
               navigator.userAgent.indexOf('FxiOS') == -1;
    return isSafari;
}

// type: https://getbootstrap.com/docs/4.6/components/alerts/ primary, dark, etc
//
function makeAlert(type, html, forceTop){
    // insert here
    let father = document.querySelectorAll(".mask.flex-center")[0];
    father.classList.add("flex-column");
    // make alert
    let bsAlert = document.createElement('div');
    let mClass = 'alert alert-' + type + ' alert-dismissible fade show mx-0';
    bsAlert.setAttribute('class', mClass);
    bsAlert.setAttribute('role', 'alert');
    bsAlert.innerHTML = html;
    let closeBtn = document.createElement('button');
    closeBtn.setAttribute('type', 'button');
    closeBtn.setAttribute('class', 'close');
    closeBtn.setAttribute('data-dismiss', 'alert');
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML = '<span aria-hidden="true">&times;</span>';
    bsAlert.appendChild(closeBtn);
    
    $(".mask.flex-center.flex-column").prepend(bsAlert);
    if(forceTop){
        setTimeout(function(){window.scrollTo(0, 0);}, 300);
    }
}

main();