
function main(){
    if (checkPathRoot()){
        friendLink();
    }else{
        chinaCDN();
    }
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
    .catch(error => log(error))
    
    if(country === 'CN'){
        //log('China!');
        return true;
    }else{
        //log('Not China!');
        return false;
    }
}

async function chinaCDN(){
    // 中國 CDN 加速...
    if(await checkChina()){
        log('It is China...');
        let needCDN = document.querySelectorAll('[src-cn]');
        
        needCDN.forEach(function(tag){

            fetch('https://api.esutg.workers.dev/check', {
                method: 'POST',
                body: tag.getAttribute('src-cn')
            })
            .then(resp => resp.json())
            .then(function(data){
                   if(data["status"] === 200 && data["length"] > 1024){

                    log('China CDN for ' + tag.getAttribute('src') + ' seems ok, size: ' + data["length"]);
                    // do some replace src stuff
                    tag.setAttribute('src-origin', tag.getAttribute('src'))
                    tag.setAttribute('src', tag.getAttribute('src-cn'));
                    // done!
                   }else{
                    //something goes wrone, skip this tag
                    log('China CDN for ' + tag.getAttribute('src') + ' error, resp not ok.');
                    console.log(data);
                   }
            })
            .catch(function(error){
                log('China CDN for ' + tag.getAttribute('src') + ' error.');
                console.log(error.stack);
            })
            .finally(() => {
                let needLoad = document.querySelectorAll('video');
                needLoad.forEach(vid => vid.load())
            });
            
        })
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

function checkPathRoot(){
    let result = window.location.pathname === '/' || window.location.pathname ==='/index.html';
    return result;
}

main();
