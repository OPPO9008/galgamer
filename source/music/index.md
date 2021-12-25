---
title: Galgame 金曲
date: 2021-09-30 21:37:54
tags:
  - Galgame乐曲收录
excerpt: '这里收录了文章中出现过的 Galgame 乐曲'
banner_img: '/music/banner.jpg'
---

<img src='banner.jpg' width=0px alt="placeholder"/>

{% raw %}

<div class="container">
    <div class="row">
        <div class="col-xs-12 col-sm-5 mt-2 col" style="max-width:450px">
            <div id="mPlayer"></div>
        </div>
        <div id="detailsCard" class="col-xs-12 card col-sm-7 col-md-6 mt-2 mx-3 text-white bg-secondary border-white">
          <div class="card-header">
            <strong>Details</strong>
          </div>
          <div class="card-body">
            <p class="card-text" id="details">Loading...</p>
          </div>
        </div>
    </div>
    <div class="row">
        <div class="dropdown col-sm md-auto align-self-start my-3">
          <button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true">
            收藏到...
          </button>
          <div class="dropdown-menu">
            <a class="dropdown-item" id="neteaseGo">網疑雲</a>
            <a class="dropdown-item" id="qqGo">QQ 音樂</a>
            <a class="dropdown-item" id="kugouGo">酷狗</a>
          </div>
        </div>
    </div>
    <div class="my-1">
        <ul class="row list-unstyled" id="playlist">
        

          
        </ul>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/cplayer/dist/cplayer.min.js"></script>
<script defer src="/js/music_page.js?1205"></script>

{% endraw %}