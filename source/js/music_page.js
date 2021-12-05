/*
    Simple music page for Galgamer
    by GUREHA
*/
let mPlayer = document.getElementById('mPlayer');
let mDetails = document.getElementById('details');
let neteaseGo = document.getElementById('neteaseGo');
let qqGo = document.getElementById('qqGo');
let kugouGo = document.getElementById('kugouGo');
let mPlaylist = document.getElementById('playlist');

let allMusic = [];
let nowPlaying = 0;
let playerEl;

let doNotNavigate = false;

async function main(){
    showBetaAlert();
    allMusic = await getAllMusic();
    initPlayer();
    buildPlaylist();
    setupGoBtn();
    
    if(getIdByUrl()){
        doNotNavigate = true;
        switchTo(reverseL(getIdByUrl()), true);
    }else{
        addState(nowPlaying);
    }
}

function reverseL(index){
    return allMusic.length - 1 - index;
}

function showBetaAlert(){
    makeAlert(
        'success',
        '<h4 class="alert-heading">Beta 版</h4>' + 
        '<p class="mb-0">收錄了已有的 Galgame 樂曲</p>',
        false
    );
}

async function getAllMusic(){
    // reverse the order, lastest first.
    let result = await fetch('/music/music.json?1204')
                        .then(resp => resp.json())
                        .then(data => data)
    plog('Playlist items: ' + result.length);
    return result.reverse();
}

function getIdByUrl(){
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function addState(new_id){
    let stateObj = { id: new_id };
    window.history.pushState(stateObj, "id:" + new_id,
                                window.location.origin + window.location.pathname + 
                                '?id=' + reverseL(new_id));
}

window.onpopstate = function(e){
    if(e.state){
        moveTo = e.state.id;
        doNotNavigate = true;
        //document.title = e.state.pageTitle;
        switchTo(moveTo);
    }
};

function initPlayer(){
    playerEl = new cplayer({
        element: mPlayer,
        playlist: allMusic,
        big: true,
        width: '100%',
        volume: 0.5
    })
    playerEl.on('openaudio', function(ev){
        updatePage(this.nowplaypoint, true);
    });
}

function setupGoBtn(){
    neteaseGo.addEventListener('click', function(ev){
        let neteaseid = allMusic[nowPlaying].netease;
        if(neteaseid){
            window.location = "orpheus://song/" + neteaseid;
        }else{
            alert('網疑雲沒有這首歌');
        }
    })
    //qqmusic://qq.com/media/playSonglist?p=
    //{"song":[{"type":"0","songmid":"001BOsky3gtuas"}],"action":"play"}
    qqGo.addEventListener('click', function(ev){
        let qqid = allMusic[nowPlaying].qq;
        if(qqid){
            let obj = {
                "song":[
                    {
                        "type": "0",
                        "songmid": qqid
                    }
                ],
                "action": "play"
            }
            let params = JSON.stringify(obj);
            window.location = "qqmusic://qq.com/media/playSonglist?p=" + encodeURIComponent(params);
        }else{
            alert('QQ 音樂沒有這首歌');
        }
    })
    kugouGo.addEventListener('click', function(ev){
        alert('無法調用酷狗音樂。');
    })
}

function makePlaylistItem(index){
    /*
              <li class="media my-2">
            <img src="..." width=100px class="align-self-center mr-3" alt="...">
            <div class="media-body" >
              <a><h5 class="mt-1 mb-2">歌曲名稱</h5></a>
              <p class="my-1 align-self-center">一些信一些信息</p>
            </div>
          </li>
    */
    let mh5 = document.createElement('h5');
    mh5.setAttribute('class', 'mt-1 mb-2 font-weight-bold');
    mh5.innerText = allMusic[index].name + ' ▶️️';
    let ah5 = document.createElement('a');
    ah5.setAttribute('href', 'javascript:;');
    ah5.addEventListener('click',() => switchTo(index));
    ah5.appendChild(mh5);
    
    let dp = document.createElement('p');
    dp.setAttribute('class', 'my-1 align-self-center');
    dp.innerHTML = allMusic[index].details;
    
    let mediaBody = document.createElement('div');
    mediaBody.setAttribute('class', 'media-body');
    mediaBody.appendChild(ah5);
    mediaBody.appendChild(dp);
    
    let coverImg = document.createElement('img');
    coverImg.setAttribute('class', 'align-self-center mr-3 rounded-lg');
    coverImg.setAttribute('width', '100px');
    coverImg.setAttribute('alt', allMusic[index].name);
    coverImg.setAttribute('src', allMusic[index].poster);
    let aimg = document.createElement('a');
    aimg.setAttribute('href', 'javascript:;');
    aimg.addEventListener('click',() => switchTo(index));
    aimg.appendChild(coverImg);
    
    let mediaEl = document.createElement('li');
    mediaEl.setAttribute('class', 'media my-3 mx-1 col-lg-auto col-md-12');
    mediaEl.appendChild(aimg);
    mediaEl.appendChild(mediaBody);
    
    return mediaEl;
}

function removeFadeOut( el, speed ) {
    var seconds = speed/1000;
    el.style.transition = "opacity "+seconds+"s ease";

    el.style.opacity = 0;
    setTimeout(function() {
        el.parentNode.removeChild(el);
    }, speed);
}

function insertToast(type, data, last){
    //<div id="mytoast" class="fixed-bottom bg-success text-light col-lg-4 col-md-10 col-sm-9 w-75 mx-auto py-2 my-2 rounded-lg">testtesttest</div>
    let old = document.getElementById('mytoast');
    let deley = 0;
    if(old){
        removeFadeOut(old, 500);
        deley = 500;
    }
    setTimeout(function() {
        let toast = document.createElement('div')
        toast.setAttribute('id', 'mytoast');
        toast.setAttribute('class', 'border border-light fixed-bottom text-light col-lg-4 col-md-10 col-sm-9 w-75 mx-auto py-2 my-2 rounded-lg' + ' bg-' + type);
        toast.innerHTML = data;
        // 進入
        toast.style.transition = "opacity 0.5s ease";
        toast.style.opacity = 0;
        document.body.appendChild(toast);
        toast.style.opacity = 100;
        // 消失
        setTimeout(function() {
            removeFadeOut(toast, 500);
        }, last);
    }, deley);
}

function buildPlaylist(){
    for (let i = 0; i < allMusic.length; i++){
        let listItem = makePlaylistItem(i);
        mPlaylist.appendChild(listItem);
    }
}

function setDetailsCard(){
    mDetails.innerHTML = allMusic[nowPlaying].details;
}

function switchTo(index, notPlay){
    if (nowPlaying === index)return;
    playerEl.to(index);
    if(!notPlay)playerEl.play();
}

function updatePage(index){
    nowPlaying = index;
    setDetailsCard();
    let title = document.querySelectorAll('meta[property="og:title"]')[0];
    title.content = allMusic[index].name + ' - ' + allMusic[index].artist;
    document.title = allMusic[index].name + ' - ' + allMusic[index].artist;
    insertToast('dark', 'Now Playing: <strong>' + allMusic[index].name + '</strong>', 1750);
    if(doNotNavigate){
        doNotNavigate = false;
    }else{
        addState(index);
    }
}

function plog(text) {
    let currentdate = new Date(); 
    let datetime = "[" +  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds() + "] ";
    console.log('[Player]' + datetime + text);
}

main();