
function main(){
    if (checkPathRoot()){
        friendLink();
    }else{
        chinaCDN();
    }
    createShareBtn();
    createNewBadge();//before 2022
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
        
        card.classList.add("mt-5");
        //card.setAttribute('id', 'friendLinkCard');
        let insertText = card.querySelectorAll('.container')[0];
        let mText = document.createElement('h5');
        
        mText.classList.add("ml-4");
        mText.innerText = "友情链接";
        insertText.prepend(mText);
        
        let father = document.querySelectorAll('.container.nopadding-x-md')[0];
        
        let br = document.createElement('br');
        father.appendChild(br);
        father.appendChild(card);
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
    console.log('[nielog]' + datetime + text);
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

main();
