/* 
    Some function can run without DOM
*/

function main(){
    //redirectHttps();
    //redirectNoWWW();
    docReady(function() {
        // DOM is loaded and ready for manipulation here
        if (checkPathRoot()){
            friendLink();
        }else{
            chinaCDN();
            let maps = document.querySelectorAll('.route-map');
            maps.forEach(function(map){
                mlog('Loading Route Map');
                new RouteMap(map);
            })
        }
        createShareBtn();
        //createNewBadge();//before 2022
        showCDN();
        videoWatchDog();
        // 頁面排版: 中英之間增加空格
        pangu.spacingElementByTagName('p');
        pangu.spacingElementByTagName('h1');
        pangu.spacingElementByTagName('h2');
        pangu.spacingElementByTagName('h3');
        pangu.spacingElementByTagName('table');
        pangu.spacingElementByTagName('li');
    });
}

function standwith(){
  let html = 
`
<style>
:root {
    --notice-bg-color: #66bab7;
}
[data-user-color-scheme='dark'] {
    --notice-bg-color: #505050;
  }
#ukraine {
  /*min-height: 100px;*/
  background-color: var(--notice-bg-color);
  box-shadow: 0px -8px 19px 5px rgb(0 0 0 / 35%);
  transition: height 0.3s ease-out;
}
.notice-warp {
    font-size: 3em;
    line-height: normal;
    background: linear-gradient(to bottom, blue 55%, yellow 55%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
}
.close-notice {
    position: absolute;
    right: 3px;
    top: 30%;
    font-size: 150%;
}
</style>
`
    let style = document.createElement('div');
    style.innerHTML = html;
    document.body.appendChild(style);
    let ukraine = 
`
<div id="ukraine" class="fixed-bottom col-lg-5 col-md-11 col-sm-10 mx-auto py-1 my-3 rounded-lg">
<div class="row align-items-center my-1 mx-2">
<div class="notice-warp">
    ❤️ <span class=" font-weight-bold font-italic">PEACE!</span>
</div> 
</div>
</div>
`
    insertToast('dark', ukraine, 4000);
}

function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}    

function redirectHttps() {
    if(window.location.protocol == 'http:'){
        if(window.location.port){
            mlog("當前網址有端口，可能處於調試模式，跳過 HTTPS 重定向。")
            return;
        }
        mlog("You are visiting from insecure HTTP, redirecting")
        let newLocation = 'https://' + window.location.host + window.location.pathname;
        window.location = newLocation;
    }
}

function redirectNoWWW() {
    if(window.location.host == 'www.galgamer.xyz'){
        mlog('帶 www 的網址無法載入留言區，需要重定向。');
        let newLocation = 'https://galgamer.xyz' + window.location.pathname;
        window.location = newLocation;
        return;
    }
    if(window.location.host != 'galgamer.xyz'){
        mlog('This URL host seems not belong to the official website.');
    }
}

function mlog(text) {
    let currentdate = new Date(); 
    let datetime = "[" +  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds() + "] ";
    console.log('[mylib]' + datetime + text);
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
    mlog('The screen size is ' + test);
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
function makeAlert2(type, html, forceTop){
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
    
    father.prepend(bsAlert);
    if(forceTop){
        setTimeout(function(){window.scrollTo(0, 0);}, 300);
    }
}

function removeFadeOut( el, speed ) {
    var seconds = speed/1000;
    el.style.transition = "opacity "+seconds+"s ease";

    el.style.opacity = 0;
    setTimeout(function() {
      if(el && el.parentNode){
        el.parentNode.removeChild(el);
      }else{
        mlog('找不到要刪除的 toast，牠真的還在 DOM 裏面❓️');
      }
    }, speed);
}

async function insertToast(type, data, last){
    //<div id="mytoast" class="fixed-bottom bg-success text-light col-lg-4 col-md-10 col-sm-9 w-75 mx-auto py-2 my-2 rounded-lg">testtesttest</div>
    let old = document.getElementById('mytoast');

    if(old){
        removeFadeOut(old, 500);
        deley = 500;
        // 等舊的消失
        await new Promise(r => setTimeout(r, 500));
    }

    let toast = document.createElement('div');
    toast.setAttribute('id', 'mytoast');
    //toast.setAttribute('class', 'border border-light fixed-bottom text-light col-lg-4 col-md-10 col-sm-9 w-75 mx-auto py-2 my-2 rounded-lg' + ' bg-' + type);
    toast.setAttribute('class', 'alert border border-primary fixed-bottom col-lg-4 col-md-10 col-sm-9 w-75 mx-auto py-2 mb-5 my-2 rounded-lg' + ' alert-' + type);
    toast.innerHTML = data;
    // 漸變進入
    toast.style.transition = "opacity 0.5s ease";
    toast.style.opacity = 0;
    document.body.appendChild(toast);
    await new Promise(r => setTimeout(r, 0));
    toast.style.opacity = 100;
    // 消失
    setTimeout(function() {
        removeFadeOut(toast, 500);
    }, last);
    return toast;
}

class RouteMap {
    /*
        Galgame Route Map Displaying Utility
    */
    routeMapDOM; // The most out div of route map
    buttonsDOM = []; // length：4，上下左右
    imageDOM;
    
    rows; // Y
    cols; // X
    matrix = []; 
    activeX = 0;
    activeY = 0;

    constructor (routeMapDOM) {
        this.routeMapDOM = routeMapDOM;
        this.readData();
        this.makeLayout();
        this.updateMap();
    }
    
    // build matrix
    readData(){
        let rowDOMs = this.routeMapDOM.querySelectorAll('x-row');
        // iterate each row
        for(let y = 0; y < rowDOMs.length; y++){
            let cols = [];
            // if the row has specified start index
            let thisRowStartFrom = rowDOMs[y].getAttribute('start-from');
            if(!parseInt(thisRowStartFrom))thisRowStartFrom = 0;
            else thisRowStartFrom = parseInt(thisRowStartFrom);
            
            // find each col
            let colDOMs = rowDOMs[y].querySelectorAll('x-col');
            for(let x = 0; x < colDOMs.length + thisRowStartFrom; x++){
                if(x < thisRowStartFrom){
                    cols[x] = null;
                    continue;
                }
                let coldom = colDOMs[x - thisRowStartFrom];
                // get img src and if default
                let thisSRC = coldom.getAttribute('src');
                let isDefault = coldom.getAttribute('default') === '';
                if(isDefault){
                    this.activeX = x;
                    this.activeY = y;
                }
                cols[x] = {
                    'src': thisSRC
                };
            }
            this.matrix[y] = cols;
        }
        // we have the matrix here,
        // but we should make each row []elem the same length
        // find max row length first.
        let maxLen = 0;
        this.matrix.forEach(function(aRow){
            if (aRow.length > maxLen)maxLen = aRow.length;
        })
        // then fill up the holes
        this.matrix.forEach(function(aRow){
            if (aRow.length < maxLen){
                for(let x = aRow.length; x < maxLen; x++){
                    aRow[x] = null;
                }
            }
        })
        // we should be all done here
        this.rows = this.matrix.length;
        this.cols = maxLen;
    }
    
    // del the data parts in div and fill layouts in, but not setting the src
    makeLayout(){
        // remove all the x-row col stuff first.
        while (this.routeMapDOM.firstChild) {
            this.routeMapDOM.removeChild(this.routeMapDOM.firstChild);
        }
        // set up button
        let btnTypes = ['btn-up', 'btn-down', 'btn-left', 'btn-right'];
        let btnText = ['　▲　', '　▼　', '　◄　', '　►　'];
        let btnRow = document.createElement('div');
        btnRow.setAttribute('class', 'row');
        this.routeMapDOM.appendChild(btnRow);
        
        for(let i = 0; i < 4; i++){
            let btn = document.createElement('button');
            btn.setAttribute('class', 'mx-1 my-2 ' + btnTypes[i]);
            btn.innerText = btnText[i];
            // the context will be used later as RouteMap obj reference
            let mContext = this;
            btn.addEventListener('click', function(ev){
                 let target = ev.target || ev.srcElement;
                 //console.log(mContext);
                 // get the direction
                 let direction;
                 if(target.classList.contains(btnTypes[0])){
                     direction = 'up';
                 }else if(target.classList.contains(btnTypes[1])){
                     direction = 'down';
                 }else if(target.classList.contains(btnTypes[2])){
                     direction = 'left';
                 }else {
                     direction = 'right';
                 }

                 mContext.onMove(direction);
            });
            if(i == 1)btn.classList.add('mr-4');
            
            btnRow.appendChild(btn);
            this.buttonsDOM[i] = btn;
        }
        // set up img
        let imgRow = document.createElement('div');
        imgRow.setAttribute('class', 'row');
        this.routeMapDOM.appendChild(imgRow);
        
        let imgDiv = document.createElement('div');
        imgDiv.setAttribute('class', 'col-lg-10 col-md-11 mx-1 my-1 px-2 py-2 rounded border border-light');
        imgRow.appendChild(imgDiv);
        
        let mImg = document.createElement('img');
        mImg.setAttribute('class', 'image-fluid img-lazy');
        mImg.setAttribute('onclick', 'return false');
        imgDiv.appendChild(mImg);
        this.imageDOM = mImg;
    }
    
    // check movability in every direction, return coord for ok, else false
    checkMovable(){
        // check up
        let resultUP;
        if(this.activeY === 0){ // on the top row
            resultUP = false;
        }else if(!this.matrix[this.activeY - 1][this.activeX]){
            resultUP = false;
        }else{
            resultUP = {
                'x': this.activeX,
                'y': this.activeY - 1
            }
        }
        
        // check down
        let resultDown;
        if(this.activeY === this.rows - 1){ // on the bottom row
            resultDown = false;
        }else if(!this.matrix[this.activeY + 1][this.activeX]){
            resultDown = false;
        }else{
            resultDown = {
                'x': this.activeX,
                'y': this.activeY + 1
            }
        }
        
        // check right
        let resultRight;
        if(this.activeX === this.cols - 1){ // on the right most col
            resultRight = false;
        }else if(!this.matrix[this.activeY][this.activeX + 1]){
            resultRight = false;
        }else{
            resultRight = {
                'x': this.activeX + 1,
                'y': this.activeY
            }
        }
        
        // check left
        let resultLeft;
        if(this.activeX === 0){ // on the left most col
            resultLeft = false;
        }else if(this.matrix[this.activeY][this.activeX - 1]){ // if the item in the left exists
            resultLeft = {
                'x': this.activeX - 1,
                'y': this.activeY
            }
        }else{ // find vertically nearest item in the column to the left
            // find in the up direction
            let diff1 = 99999;
            for(let y = this.activeY; y >= 0; y--){
                if(this.matrix[y][this.activeX - 1]){
                    diff1 = this.activeY - y;
                    break;
                }
            }
            let diff2 = 99999;
            // find in the down direction
            for(let y = this.activeY; y < this.rows; y++){
                if(this.matrix[y][this.activeX - 1]){
                    diff2 = y - this.activeY;
                    break;
                }
            }
            if(diff1 < diff2)diff2 = -diff1;
            resultLeft = {
                'x': this.activeX - 1,
                'y': this.activeY + diff2
            }
        }
        
        return {
            'up': resultUP,
            'down': resultDown,
            'left': resultLeft,
            'right': resultRight
        }
    }
    
    // on button clicked
    onMove(direction){
        let movable = this.checkMovable();
        if (!movable[direction])return;
        
        this.activeX = movable[direction]['x'];
        this.activeY = movable[direction]['y'];
        this.updateMap();
    }
    
    // update 
    updateMap(){
        let newSrc = this.matrix[this.activeY][this.activeX]['src'];
        this.imageDOM.setAttribute('src', newSrc);
        // todo change button
        let token = ['up', 'down', 'left', 'right'];
        let movable = this.checkMovable();
        for(let i = 0; i < 4; i++){
            if (movable[token[i]]){
                this.buttonsDOM[i].removeAttribute('disabled');
            }else{
                this.buttonsDOM[i].setAttribute('disabled', 'true');
            }
        }
    }
}

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
    mText.innerHTML = '分享<span class="d-none d-md-inline d-lg-none">到 TG</span><span class="d-none d-lg-inline">到 Telegram</span>';
    
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
        let desc = tagStr + '\n🔗️' + window.location;
        //nielog(url);
        //nielog(desc);
        url = encodeURIComponent(url);
        desc = encodeURIComponent(desc);
        // TG call
        window.location = 'tg://msg_url?url=' + url + '&text=' + desc;
    });
}

// 友情链接加入首页
function friendLink(){
    fetch('/links/index.html')
    .then(function(resp){
        if(!resp.ok){
            throw 'friend link not ok!';
        }else{
            return resp.text();
        }
    })
    .then(function(data){
        let parser = new DOMParser();
        let doc = parser.parseFromString(data, 'text/html');
        let card = doc.querySelectorAll('#board')[0];
        
        //card.classList.add("mt-5");
        //card.setAttribute('id', 'friendLinkCard');
        let insertText = card.querySelectorAll('.container')[0];
        insertText.classList.add("mt-5");
        let mText = document.createElement('h5');
        
        mText.classList.add("ml-4");
        mText.innerText = "友情链接";
        insertText.prepend(mText);
        
        //let father = document.querySelectorAll('.container.nopadding-x-md')[0];
        
        //let br = document.createElement('br');
        //father.appendChild(br);
        //father.appendChild(card);
        let father = document.querySelectorAll('#board')[0];
        
        //let br = document.createElement('br');
        //father.appendChild(br);
        father.appendChild(insertText);
    })
    .catch(e => console.log(e))
}

// 這些函數拿出來免得全軍覆沒
async function checkChina () {
    let country = await fetch("/cdn-cgi/trace")
    .then(resp => resp.text())
    .then(resp => resp.match('loc=(.*)\n')[1])
    .catch(error => nielog(error))
    
    if(country === 'CN'){
        //nielog('China!');
        return true;
    }else{
        //nielog('Not China!');
        return false;
    }
}

async function chinaCDN(){
    // 中國 CDN 加速...
    if(await checkChina()){
        nielog('It is China...');
        let needCDN = document.querySelectorAll('[src-cn]');
        
        needCDN.forEach(function(tag){

            fetch('https://api.esutg.workers.dev/check', {
                method: 'POST',
                body: tag.getAttribute('src-cn')
            })
            .then(resp => resp.json())
            .then(function(data){
                   if(data["status"] === 200 && data["length"] > 1024000){

                    nielog('China CDN for ' + tag.getAttribute('src') + ' seems ok, size: ' + data["length"]);
                    // do some replace src stuff
                    tag.setAttribute('src-origin', tag.getAttribute('src'))
                    tag.setAttribute('src', tag.getAttribute('src-cn'));
                    // done!
                   }else{
                    //something goes wrone, skip this tag
                    nielog('China CDN for ' + tag.getAttribute('src') + ' error, resp not ok.');
                    console.log(data);
                   }
            })
            .catch(function(error){
                nielog('China CDN for ' + tag.getAttribute('src') + ' error.');
                console.log(error.stack);
            })
            .finally(() => {
                let needLoad = document.querySelectorAll('video');
                needLoad.forEach(vid => vid.load())
            });
            
        })
    }
}

function nielog(text) {
    let currentdate = new Date(); 
    let datetime = "[" +  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds() + "] ";
    console.log('[mylib]' + datetime + text);
}

function checkPathRoot(){
    let result = window.location.pathname === '/' || window.location.pathname ==='/index.html';
    return result;
}

function createNewBadge(){
    let date = new Date();
    if(date.getFullYear() < 2022){
        // <span class="badge badge-danger ml-auto d-lg-none">New</span>
        let badge = document.createElement('span');
        badge.setAttribute('class', 'badge badge-danger');
        badge.innerText = 'New';
        let navLink = document.querySelectorAll('a[href="/music/"].nav-link')[0];
        navLink.prepend(badge);
        
        let badge2 = document.createElement('span');
        badge2.setAttribute('class', 'badge badge-danger ml-auto d-lg-none');
        badge2.innerText = 'New';
        let navBtn = document.getElementById('navbar-toggler-btn');
        navBtn.parentNode.insertBefore(badge2, navBtn);
    }
}

async function showCDN(){
    let cdns = {
    "AMS": "Cloudflare 阿姆斯特丹",
    "HKG": "Cloudflare 香港",
    "MFM": "Cloudflare 澳门",
    "BKK": "Cloudflare 曼谷",
    "TPE": "Cloudflare 台北",
    "NRT": "Cloudflare 东京",
    "KIX": "Cloudflare 大阪",
    "ICN": "Cloudflare 仁川",
    "LHR": "Cloudflare 伦敦",
    "SIN": "Cloudflare 新加坡",
    "CDG": "Cloudflare 巴黎",
    "FRA": "Cloudflare 法兰克福",
    "KUL": "Cloudflare 马来西亚",
    "LAX": "Cloudflare 洛杉矶",
    "SJC": "Cloudflare 圣何塞",
    "KBP": "Cloudflare 乌克兰",
    "PRG": "Cloudflare 布拉格",
    "DME": "Cloudflare 莫斯科",
    "TSN": "百度云 天津滨海",
    "WUH": "百度云 武汉天河",
    "NGB": "百度云 宁波栎社",
    "SZV": "百度云 苏州光福",
    "XIY": "百度云 西安咸阳"
    }
    let trace = await fetch("/cdn-cgi/trace")
    .then(function(resp){
        if (resp.ok)return resp.text();
    })
    .catch(error=>nielog(error))

    let mycdn = document.getElementById('mycdn');
    if (trace) {
        let sip = trace.match('ip=(.*)\n')[1];
        let colo = trace.match('colo=(.*)\n')[1];
        let proto = trace.match('http=(.*)\n')[1];
        let sni = trace.match('sni=(.*)\n')[1];

        if(colo in cdns){
            colo = cdns[colo];
        }
        
        mycdn.innerHTML = 'CDN Location: ' + colo + '<br>' + 'Current IP: ' + sip;
        if (sip.includes(':')){
            mycdn.innerHTML += '<br>IPv6: Yes';
        } else {
            mycdn.innerHTML += '<br>IPv6: No';
        }
        if (proto === 'http/3'){
            mycdn.innerHTML += '<br>QUIC: Yes';
        } else {
            mycdn.innerHTML += '<br>QUIC: No';
        }
        if (sni === 'plaintext'){
            mycdn.innerHTML += '<br>SNI Encryption: No';
        } else {
            mycdn.innerHTML += '<br>SNI Encryption: Yes';
        }
    } else {
       mycdn.innerHTML = 'Unavailable'; 
    }
}

/* HTML 視頻看門狗，用來當視頻爆 error 的時候自動重啓加載。
   對於濫用 GitHub 或者 bitbucket 存儲視頻的五分鐘連結有效期
   有幫助。
*/
function videoWatchDog(){
    /* 如果一個視頻短時間爆了很多錯誤，那可能真的有問題了 */
    /* 應該停止重試。 */
    function shouldRetry(videoEl){
        let errCount = parseInt(videoEl.getAttribute('error-count'));
        if (!errCount){
            // 說明是第一次出錯，應該先新增那個屬性
            videoEl.setAttribute('error-count', '1');
            videoEl.setAttribute('last-error', '' + parseInt(Date.now()/1000));
            return true;
        }
        // 表示不是第一次出錯了，先看看是否是第五次。
        if (errCount === 5){
            return false;
            // 達到了最大上限
        }
        // 如果小於五次，則看看上次出錯是甚麼時候。
        let lastErr = parseInt(videoEl.getAttribute('last-error'));
        // 如果距離已經超過五秒，則表示偶發錯誤，應該清零所有計數器。
        if (parseInt(Date.now()/1000) - lastErr > 5){
            videoEl.setAttribute('error-count', '');
            videoEl.setAttribute('last-error', '');
            return true;
        }
        // 否則，我們應該給計數器 + 1
        let newCount = errCount + 1;
        videoEl.setAttribute('error-count', '' + newCount);
        videoEl.setAttribute('last-error', '' + parseInt(Date.now()/1000));
        return true; // 並且允許重試
    }
    
    // 錯誤處理器函數
    function handleErr(ev){
        let target = ev.target || ev.srcElement || ev;
        mlog('event error!');
        // 如果超過最大嘗試次數，則作罷。
        if(!shouldRetry(target)){
            mlog('Too much error, cannot retry!');
            target.removeEventListener('error', handleErr);
            let tHtml = `
            <h3>⚠️️ERROR!</h3>
            <hr>
            該視頻無法正常播放，可能是因爲視頻服務器或者網路發生了故障。
            `
            insertToast('danger', tHtml, 15000);
            return;
        }
        // 儲存 原本的視頻地址
        if(!target.getAttribute('origin-src')){
            target.setAttribute('origin-src', target.currentSrc);
        }
        // 儲存 播放進度
        let cTime = target.currentTime;
        // 防止緩存，製造一個新地址
        let newSrc = target.getAttribute('origin-src') + "?t=" + Date.now();
        // 消除那些 <source，改用 src，這是不得已做出的犧牲，，，
        let srcTags = target.getElementsByTagName('source');
        for (let oneTag of srcTags) {
            target.removeChild(oneTag);
        }
        // 插入 新地址
        target.setAttribute('src', newSrc);
        target.load();
        target.play();
        target.currentTime = cTime;
        // 彈出一個 提示
        let cSec = parseInt(cTime);
        let minutes = Math.floor(cSec / 60);
        let seconds = cSec % 60;
        let tData = '正在載入視頻，<br class="d-md-none">您已經觀看到 ' + minutes + ' 分 ' +  seconds + ' 秒.';
        let tHtml = `
        <div class="d-flex align-items-center">
            <div class="mr-2 spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            <strong>` + tData + `</strong>
        </div>`
        
        insertToast('primary', tHtml, 99000);
        // 消除提示
        target.addEventListener('playing', function(){
            let toast = document.getElementById('mytoast');
            removeFadeOut(toast, 500);
        }, {once : true});
    }
    
    let videos = document.querySelectorAll('video');
    videos.forEach(function(video){
        // beta 版：如果某些視頻一開始就出錯，我們應該重試一下他。
        if(video.error){
            mlog('該視頻一上來就出錯，應該重試。');
            handleErr(video);
        }
        video.addEventListener('error', handleErr);
    })
}

main();