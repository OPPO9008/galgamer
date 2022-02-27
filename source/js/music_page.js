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
let shareInfo = document.getElementById('shareInfo');

let allMusic = [];
let nowPlaying = 0;
let playerEl;

let doNotNavigate = false;

const beforeUnloadListener = (e) => {
    if (playerEl.played) {
        e.preventDefault();
        e.returnValue = '正在播放中，確認退出嗎？';
    }
};

async function main(){
    //showBetaAlert();
    allMusic = await getAllMusic();
    initPlayer();
    buildPlaylist();
    setupBtn();
    
    // Find ID from URL
    let id = parseInt(getIdByUrl());
    if(id >= 0 && id < allMusic.length){
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

    // 增加 正在播放中的關閉頁面確認
    window.addEventListener('beforeunload', beforeUnloadListener);
}

function setupBtn(){
    neteaseGo.addEventListener('click', function(ev){
        let neteaseid = allMusic[nowPlaying].netease;
        if(neteaseid){
            insertToast('success', '正在調用網易雲', 3000);
            // 暫停退出確認
            window.removeEventListener('beforeunload', beforeUnloadListener);
            window.location = "orpheus://song/" + neteaseid;
            window.addEventListener('beforeunload', beforeUnloadListener);
        }else{
            insertToast('danger', '網疑雲沒有這首歌', 3000);
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
            insertToast('success', '正在調用 QQ 音樂', 3000);
            // 暫停退出確認
            window.removeEventListener('beforeunload', beforeUnloadListener);
            window.location = "qqmusic://qq.com/media/playSonglist?p=" + encodeURIComponent(params);
            window.addEventListener('beforeunload', beforeUnloadListener);
        }else{
            insertToast('danger', 'QQ 音樂沒有這首歌', 3000);
        }
    })
    kugouGo.addEventListener('click', function(ev){
        insertToast('danger', '無法打開酷狗音樂', 3000);
    })
    shareInfo.addEventListener('click', function(ev){
        insertToast('success', '正在調用 Telegram', 3000);
        let link = window.location.origin + '/api/music/' + reverseL(nowPlaying);
        
        let title = document.querySelectorAll('meta[property="og:title"]')[0].content;
        let url = title;
        let desc = '🔗️' + link;
        //nielog(url);
        //nielog(desc);
        url = encodeURIComponent(url);
        desc = encodeURIComponent(desc);
        
        // 暫停退出確認
        window.removeEventListener('beforeunload', beforeUnloadListener);
        
        // TG call
        window.location = 'tg://msg_url?url=' + url + '&text=' + desc;
        
        window.addEventListener('beforeunload', beforeUnloadListener);
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
    if (nowPlaying === index){
        playerEl.play();
        return;
    };
    playerEl.to(index);
    if(!notPlay)playerEl.play();
}

function updatePage(index){
    nowPlaying = index;
    setDetailsCard();
    let title = document.querySelectorAll('meta[property="og:title"]')[0];
    title.content = allMusic[index].name + ' - ' + allMusic[index].artist;
    document.title = allMusic[index].name + ' - ' + allMusic[index].artist;
    insertToast('info', 'Now Playing: <strong>' + allMusic[index].name + '</strong>', 2000);
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