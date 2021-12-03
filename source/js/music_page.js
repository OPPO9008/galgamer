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

async function main(){
    showBetaAlert();
    allMusic = await getAllMusic();
    initPlayer();
    setDetailsCard();
    buildPlaylist();
    setupGoBtn();
}

function showBetaAlert(){
    
}

async function getAllMusic(){
    // reverse the order, lastest first.
}

function getIdByUrl(){
    
}

function setUrlId(new_id){
    
}

function initPlayer(){
    
}

function setupGoBtn(){
    
}

function makePlaylistItem(){
    
}

function buildPlaylist(){
    
}

function setDetailsCard(){
    
}

function getDark(){
    let mhtml = document.querySelectorAll('[data-user-color-scheme]')[0];
    let result = mhtml.getAttribute('data-user-color-scheme');
    return result === 'dark';
}

main();