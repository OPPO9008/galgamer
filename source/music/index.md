---
title: music
date: 2021-09-30 21:37:54

---

{% raw %}

<div class="container">
    <div class="row">
        <div  class="col justify-content-center">
            <div id="mPlayer"></div>
        </div>
        <div id="detailsCard" class="card col-lg-7 mt-2 text-white bg-dark border-white">
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
            <a class="dropdown-item" id="qqGo">QQ 音 Le</a>
            <a class="dropdown-item" id="kugouGo">酷狗</a>
          </div>
        </div>
    </div>
    <div class="row my-3">
        <ul class="list-unstyled" id="playlist">
        
          <li class="media my-2">
            <img src="..." class="align-self-center mr-3" alt="...">
            <a class="media-body" >
              <h5 class="mt-0 mb-1">歌曲名稱</h5>
              一些信息一些信息一些信息一些信息一些信息一些信息一些信息一些信息一些信息一些信息一些信息一些信息一些信息一些信息一些信息一些信息一些信息一些信息一些信息一些信息一些信息一些信息一些信息一些信息一些信息一些信息一些信息一些信息一些信息一些信息一些信息一些信息
            </a>
          </li>
          
        </ul>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/cplayer/dist/cplayer.min.js"></script>
<script defer src="/js/music_page.js"></script>
<script>
  let player = new cplayer({
    element: document.getElementById('mPlayer'),
    playlist: [
      {
        src: '歌曲资源链接...',
        poster: '封面链接...',
        name: '歌曲名称...',
        artist: '歌手名称...',
        lyric: '歌词...',
        sublyric: '副歌词，一般为翻译...'
      }
    ],
    big: true
  })
</script>

{% endraw %}