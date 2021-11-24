
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
    console.log('[CustomJS]' + datetime + text);
}

chinaCDN();