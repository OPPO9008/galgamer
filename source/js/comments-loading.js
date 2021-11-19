let loadingMsg = document.getElementById('loadingMsg');

let failedCounts = 0;
let myInterval;

myInterval = setInterval(function() {
    
    if (document.querySelectorAll('iframe[id*=comments-app]')[0]) {
        console.log('comments widget found');
        clearInterval(myInterval); 
        
        let widget = document.querySelectorAll('iframe[id*=comments-app]')[0];
        widget.onload = function() {
            console.log('comments widget loaded.')
            loadingMsg.style.display = 'none';
        };
    } else {
        return;
    }
}, 50);