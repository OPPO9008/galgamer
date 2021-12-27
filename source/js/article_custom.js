let loadingMsg = document.getElementById('loadingMsg');
let insertDiv = document.getElementById('commentsiframe');
let failedCounts = 0;
let myInterval;

myInterval = setInterval(function() {
    
    if (document.querySelectorAll('iframe[id*=comments-app]')[0]) {
        alog('comments widget found');
        clearInterval(myInterval); 
        
        let widget = document.querySelectorAll('iframe[id*=comments-app]')[0];
        widget.onload = function() {
            alog('comments widget loaded.')
            loadingMsg.style.display = 'none';
        };
    } else {
        return;
    }
}, 50);

//insert script here
let comment_script = document.createElement('script');
comment_script.setAttribute('src','https://comments.app/js/widget.js?3');
comment_script.setAttribute('data-comments-app-website', 's85yRa-y');
comment_script.setAttribute('data-limit', '20');
comment_script.setAttribute('data-color', 'E22F38');
comment_script.setAttribute('data-dislikes', '1');
comment_script.setAttribute('data-colorful', '1');

let mhtml = document.querySelectorAll('[data-user-color-scheme]')[0];
let result = mhtml.getAttribute('data-user-color-scheme');

if(result === 'dark'){
    comment_script.setAttribute('data-dark', '1');
}
insertDiv.appendChild(comment_script);

function alog(text) {
    let currentdate = new Date(); 
    let datetime = "[" +  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds() + "] ";
    console.log('[article]' + datetime + text);
}
/* 
<script async src="https://comments.app/js/widget.js?3" data-comments-app-website="s85yRa-y" data-limit="20" data-color="E22F38" data-dislikes="1" data-colorful="1">
</script>
*/