
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
        
        let needCDN = document.querySelectorAll('[src-cn]');
        
        needCDN.forEach(function(tag){
            log('China CDN for');
            log(tag);
            
            fetch(tag.getAttribute('src-cn') ,{ method: "HEAD" })
            .then(function(resp){
                if(resp.ok){
                    let size = resp.headers.get('content-length');
                    log('China CDN for ' + tag.getAttribute('src') + 'seems ok, size: ' + size);
                    // do some replace src stuff
                    tag.setAttribute('src-origin', tag.getAttribute('src'))
                    tag.setAttribute('src', tag.getAttribute('src-cn'));
                    // done!
                }else{
                    //something goes wrone, skip this tag
                    log('China CDN for ' + tag.getAttribute('src') + 'error, resp not ok.');
                }
            })
            .catch(function(error){
                log('China CDN for ' + tag.getAttribute('src') + ' error.');
                log(error);
            })
            
        })
    }
}

chinaCDN();