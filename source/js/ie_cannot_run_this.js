
// 這些函數拿出來免得全軍覆沒
async function checkChina () {
    let country = await fetch("/cdn-cgi/trace")
    .then(resp => resp.text())
    .then(resp => resp.match('loc=(.*)\n')[1])
    .catch(error => log(error))
    
    if(country === 'CN'){
        log('China!');
        return true;
    }else{
        log('Not China!');
        return false;
    }
}

function chinaCDN(){
    // 中國 CDN 加速...
}