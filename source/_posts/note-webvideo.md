---
title: 'Blog Note 1：HTML Video 的編碼方式的研究和測試'
date: 2000-12-31 00:30:00
keywords: 'Web Video'
banner_img: ''
index_img: '../image/note-webvideo/index.svg'
tags:
  - 笔记
abbrlink: 35475
author: 桐遠暮羽
excerpt: '我不是視頻創作者。但是在準備嵌入文章的視頻文件，對嵌入式 HTML Video 的編碼方式，參數進行調整的時候有一些發現。'
---

我不是視頻創作者。但是在準備嵌入文章的視頻文件，對嵌入式 HTML Video 的編碼方式，參數進行調整的時候有一些發現。

![](../image/note-webvideo/index.svg)

## 0. 引言

爲了能讓視頻文件在網路上順利地傳送，除了將文件上載到 CDN 等對網路方面進行優化的方法以外，對視頻文件本身進行優化也是必不可少的。

特別是在本 blog 中，視頻文件通常直接上傳到 Git LFS，並且引用外鏈，並不存在非常優異的網路環境，而且要將數據傳送到中國也是一個挑戰，因此視頻編碼就顯得尤爲重要。

此次測試的對象不是高清視頻，高清視頻需要高速的傳輸通道，因此直接上載到 YouTube 是更好的選擇。這次的目的是測試在一般的網路環境下傳送質量一般的視頻，該如何進行優化。

## 1. 編碼格式和參數

寫在前面：這裏測試的所有視頻我覺得看上去都一樣，在小窗上觀看更是如此。在視頻源並不是那麼高清的時候，可以合理地犧牲畫質來換取傳送效率。

測試用的視頻是 Sakura No Mori 2 的 OP 動畫，先放兩個 steam 上的源。

webm, VP8, 1080p, 長度 2:04, 87 MB。

<video  controls width='100%' preload="metadata"  >
<source src="https://cdn.cloudflare.steamstatic.com/steam/apps/256744846/movie_max.webm" type="video/webm"/>
<p> To view this video please enable JavaScript</p></video>

mp4, H264, 1080p, 長度 2:04, 88 MB。

<video  controls width='100%' preload="metadata"  >
<source  src="https://cdn.cloudflare.steamstatic.com/steam/apps/256744846/movie_max.mp4" type="video/mp4"/>
<p> To view this video please enable JavaScript</p></video>

遊戲本身是 720p，因此把 OP 嗯力編碼成 1080p 意義不大，而且這兩個視頻觀感上就像是 720p。

瀏覽器在遇到此類視頻時，先會加載其元數據，拿到元數據後才能夠顯示進度，並且加載視頻本體。

若是元數據不在文件的一開頭，則瀏覽器就必須要到處試探，發出多個請求直到找到元數據的位置，從而導致加載困難或者加載失敗。這就是 HandBrake 中要啟用 mp4 文件的「對 web 優化」選項的必要性。

## 2. 檔案格式

mp4, H264, 720p, 60fps, 長度 1:57, 28 MB, HandBrake 品質 27, 對 web 優化

<video  controls width='100%' preload="metadata"  >
<source  src="https://bitbucket.org/sa-ya/my-static/raw/75d65c961e5366b706c20e50a4ff6be5c65e546e/note-webvideo/op-h264-cpu-27.mp4" type="video/mp4"/>
<p> To view this video please enable JavaScript</p></video>

mp4, H264, 720p, 30fps, 長度 1:57, 57 MB, HandBrake 品質 21, 對 web 優化

<video  controls width='100%' preload="metadata"  >
<source  src="https://bitbucket.org/sa-ya/my-static/raw/75d65c961e5366b706c20e50a4ff6be5c65e546e/note-webvideo/op-h264-cpu-30fps-21.mp4" type="video/mp4"/>
<p> To view this video please enable JavaScript</p></video>

webm, VP9, 720p, 60fps, 長度 1:57, 77 MB, HandBrake 品質 27

<video  controls width='100%' preload="metadata"  >
<source  src="https://bitbucket.org/sa-ya/my-static/raw/75d65c961e5366b706c20e50a4ff6be5c65e546e/note-webvideo/op-vp9-cpu-60fps-27.webm" type="video/mp4"/>
<p> To view this video please enable JavaScript</p></video>

除了上面三個樣本之外，我還做了其他的測試。測試中都表現出 H264 的畫質和體積都優於 VP9。

而且 VP9 的編碼非常緩慢，網上查閱顯示 VP9 的主要用途是 4K 直播，所以不可把 VP9 作爲萬能靈藥。

最後，H264 的編碼器有 Fast medium slow 三種預置，在必要的時候能夠用耐心換來畫質和體積的優化（設爲 Slow）。

## 3. 結論

樣本不足，無法得出結論。

但是俺會傾向使用 H264, MP4, 品質 25-30, 爲 web 優化。