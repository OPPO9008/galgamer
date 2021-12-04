/* 
 * By 桐遠暮羽 for Galgamer
 * Add some custom features
 * Repo: https://github.com/OPPO9008/galgamer
 */

function main() {

    createShareBtn();
    
    if(checkIE()){
        makeAlert(
            'warning',
            '<h4 class="alert-heading">檢測到 IE 瀏覽器！</h4>' + 
            '<p>該網頁無法在 IE 瀏覽器上正常顯示。<p>' + 
            '<p class="mb-0">如果你在用 Windows，我可以幫你用 Edge 打開。</p><hr>' + 
            '<a class="btn btn-info" role="button" href="microsoft-edge:' +
            window.location + '">使用 Edge</a>',
            true
        );
    }
    // 允許 video 切換畫質
    $(document).ready(function(){
       $('.qualitypick').change(function(){ 

          //Have several videos in file, so have to navigate directly
          let video = $(this).parent().find("video");

          //Need access to DOM element for some functionality
          let videoDOM = video.get(0);

          let curtime = videoDOM.currentTime;  //Get Current Time of Video
          let playing = !videoDOM.paused;
          //log('query= ' + "source[label=" + this.value + "]");
          log('The video is going to switch to ' + this.value);
          let source = video.find("source[label=" + this.value + "]"); //Copy Source

          source.remove();                 //Remove the source from select
          video.prepend(source);           //Prepend source on top of options
          videoDOM.load();                    //Reload Video
          videoDOM.currentTime = curtime;  //Continue from video's stop
          if(playing) videoDOM.play();                 //Resume video
       })
    })
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

function checkIE(){
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    return false;
}

// Share to Telegram button
function createShareBtn() {
    // 創建這個按鈕
    let btn = document.createElement('a');
    btn.setAttribute('class', 'btn btn-info btn-sm mr-auto');
    btn.setAttribute('role', 'button');
    btn.setAttribute('id', 'shareBtn');
    
    let logo = document.createElement('img');
    logo.setAttribute('width', '20px');
    logo.setAttribute('src', '/image/TGLogo.svg');
    
    let mText = document.createElement('span');
    mText.setAttribute('style', 'margin: 4px;');
    mText.innerHTML = '分享';
    
    btn.appendChild(logo);
    btn.appendChild(mText);
    // 按鈕插入頁面
    let insertTo = document.getElementById('navbar-toggler-btn');
    insertTo.parentNode.insertBefore(btn, insertTo);
    // 按鈕點擊事件
    btn.addEventListener('click', function (e){
        // url and text for TG share
        
        let title = document.querySelectorAll('meta[property="og:title"]')[0].content;
        let tags = document.querySelectorAll('meta[property="article:tag"]');
        let tagStr = '';
        if(tags.length) {
            //tags.forEach(function (tag){
            //    tagStr += '#' + tag.content + ' ';
            //});
            for(let i = 0; i < tags.length; i++){
                tagStr += '#' + tags[i].content + ' ';
            }
        }
        let url = title;
        let desc = tagStr + '\n' + window.location;
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

main();