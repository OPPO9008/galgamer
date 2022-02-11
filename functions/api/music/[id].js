export async function onRequest(context) {
  // Contents of context object
  const {
    request, // same as existing Worker API
    env, // same as existing Worker API
    params, // if filename includes [id] or [[path]]
    waitUntil, // same as ctx.waitUntil in existing Worker API
    next, // used for middleware or to fetch assets
    data, // arbitrary space for passing data between middlewares
  } = context;

  let pathArray = request.url.split('/');
  let protocol = pathArray[0];
  let host = pathArray[2];
  let origin = protocol + '//' + host;

  let id = parseInt(params.id);
  if (id >= 0) {
    // 歌曲清單
    let list = await fetch(origin + '/music/music.json').then(resp => resp.json());

    // 確認 ID 是否合法
    if (id >= list.length)
      return new Response('<p>ID 超出</p>', {
        status: 404,
        headers: {
          "content-type": "text/html;charset=UTF-8",
          "cache-control": "public; max-age=43200",
          "x-robots-tag": "noindex"
        }
      });

    // 開始進行所需的元素替換
    //let page = await fetch(murl);
    //let parser = new DOMParser();
    //let doc = parser.parseFromString(page, 'text/html');

    // 所需的信息
    let songTitle = list[id]['name'];
    let songArtist = list[id]['artist'];
    let songDetails = list[id]['details'];
    let songPoster = list[id]['poster'];

    let redirectTo = origin + '/music/?id=' + id;

    let html = `
      <!DOCTYPE html>
      <head>
        <title>Galgame 金曲</title>
        <meta property="og:site_name" content="Galgame 金曲"/>
        <meta property="og:type" content="music.song"/>
        <meta property="og:url" content="` + redirectTo + `">
        <meta property="og:title" content="` + songTitle + ` - ` + songArtist + `"/>
        <meta property="og:description" content="` + songDetails.replace(/<\/?a([^>])*>?/gm, '') + `"/>
        <meta property="og:image" content="` + songPoster + `"/>
        <meta property="og:image:alt" content="Album Cover">

        <meta name="twitter:url" content="` + redirectTo + `">
        <meta name="twitter:title" content="` + songTitle + ` - ` + songArtist + `">
        <meta name="twitter:description" content="` + songDetails.replace(/<\/?a([^>])*>?/gm, '') + `">
        <meta name="twitter:image" content="` + songPoster + `">
      </head>
      <body>
        <h1>` + songTitle + ` - ` + songArtist + `</h1>
        <h2>Loading...</h2>
        <script>
          window.location = '` + redirectTo + `';
        </script> 
      </body>
    `
      return new Response(html, {
        headers: {
          "content-type": "text/html;charset=UTF-8",
          "cache-control": "public; max-age=43200",
          "x-robots-tag": "noindex"
        }
      });
  } else {
    return new Response('<p>ID 過於惡俗</p>', {
      status: 404,
      headers: {
        "content-type": "text/html;charset=UTF-8",
        "cache-control": "public; max-age=43200",
        "x-robots-tag": "noindex"
      }
    });
  }

}
