const jsx = require("jsx-transform");

hexo.extend.tag.register("steam_widget", (args) => {
  const id = +args[0];
  return `<iframe src="https://store.steampowered.com/widget/${id}/" loading=lazy frameborder=0 width="100%" height="200px"></iframe>`;
});
hexo.extend.tag.register("itch_widget", (args) => {
  const id = +args[0];
  return `<iframe src="https://itch.io/embed/${id}/" loading=lazy frameborder=0 width="100%" height="177px"></iframe>`;
});
hexo.extend.tag.register("telegram_channel", (args) => {
  const id = +args[0];
  return `<a href="tg://resolve?domain=KiritouKureha&post=${id}">🔗️前往 Telegram 頻道</a>`;
});
hexo.extend.tag.register(
  "twitter",
  ([id]) => `<a href="https://twitter.com/${id}">Twitter @${id}</a>`,
);
hexo.extend.tag.register(
  "pixiv",
  ([id, name]) => `<a href="https://www.pixiv.net/users/${id}">Pixiv ID: ${name}</a>`,
);
hexo.extend.tag.register(
  "ruby",
  ([text, ruby]) => `<ruby>${text}<rp>(</rp><rt>${ruby}</rt><rp>)</rp></ruby>`,
);

hexo.extend.tag.register(
  "steam_player",
  ([id, cdn = "media.st.dl.pinyuncloud.com"]) =>
    `<div class='vidcontainer'>
  <select class='qualitypick' autocomplete='off'>
    <option selected>低畫質</option>
    <option>高畫質</option>
  </select>
  <video controls preload=metadata width=100% poster="https://${cdn}/steam/apps/${id}/movie.293x165.jpg" >
    <source label="低畫質" src="https://${cdn}/steam/apps/${id}/movie480_vp9.webm" type="video/webm">
    <source label="低畫質" src="https://${cdn}/steam/apps/${id}/movie480.webm" type="video/webm">
    <source label="低畫質" src="https://${cdn}/steam/apps/${id}/movie480.mp4" type="video/mp4">
    <source label="高畫質" src="https://${cdn}/steam/apps/${id}/movie_max_vp9.webm" type="video/webm">
    <source label="高畫質" src="https://${cdn}/steam/apps/${id}/movie_max.webm" type="video/webm">
    <source label="高畫質"   src="https://${cdn}/steam/apps/${id}/movie_max.mp4" type="video/mp4" >
  <p> To view this video please enable JavaScript</p>
  </video>
</div>`,
);

hexo.extend.tag.register("gallery", (args, content) => {
  const id = args[0] ?? "carousel";
  const arr = content.split("\n").map((x) => x);
  let indicators = "";
  let inner = "";
  let active = " active";
  for (const item of arr) {
    indicators +=
      `<li data-target="#${id}" data-slide-to="0" class="${active}"></li>`;
    inner +=
      `<div class="carousel-item${active}"><img class="d-block w-100" src="${item}"></div>`;
    active = "";
  }
  return `<div id="${id}" class="carousel slide" data-ride="carousel">
    <ol class="carousel-indicators">${indicators}</ol>
    <div class="carousel-inner">${inner}</div>
    <a class="carousel-control-prev" href="#${id}" role="button" data-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="carousel-control-next" href="#${id}" role="button" data-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
  </div>`;
}, { ends: true });

hexo.extend.tag.register("script_defer", (_args, content) =>
  content
    .replace(/<script>/gi, "<script>docReady(() => {")
    .replace(/<\/script>/gi, "});</script>"), { ends: true });

hexo.extend.tag.register("custom_element", ([name, ...args], content) => {
  const raw = content.replace(/%{/g, "{{").replace(/}%/g, "}}");
  const fn = jsx.fromString(`({ ${args.join(", ")} }) => ${raw}`, {
    factory: "ce",
  });
  return `<script>docReady(() => {
  defineCustomElement(${JSON.stringify(name)}, ${fn});
})</script>`;
}, { ends: true });
