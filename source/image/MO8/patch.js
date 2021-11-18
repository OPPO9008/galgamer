console.log('MO8 custom script loaded.');
let mydiv = document.getElementById('hot_patch');

async function main() {
    let content = await fetch('/image/MO8/custom.txt')
    .then(function(resp){
        let result = resp.text();
        return result;
    })
    .catch(function(err){
        console.log(err);
    })
    if(content){
        // mydiv.innerHTML = content;
    }
}

main();