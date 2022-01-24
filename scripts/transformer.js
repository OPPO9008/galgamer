const jsx = require("jsx-transform");

/** steam_widget
 * Steam 组件
 * 用法：{% steam_widget <地址里的数字id> %}
 */
hexo.extend.tag.register(
  "steam_widget",
  ([id]) =>
    `<iframe src="https://store.steampowered.com/widget/${id}/" loading=lazy frameborder=0 width="100%" height="200px"></iframe>`,
);

/** itch_widget
 * Itch 商店组件
 * 用法：{% itch_widget <地址里的数字id> %}
 */
hexo.extend.tag.register(
  "itch_widget",
  ([id]) =>
    `<iframe src="https://itch.io/embed/${id}/" loading=lazy frameborder=0 width="100%" height="177px"></iframe>`,
);

/** telegram_channel
 * 电报消息引用
 * 用法：{% telegram_channel <地址里的数字id> %}
 */
hexo.extend.tag.register(
  "telegram_channel",
  ([id]) =>
    `<a href="tg://resolve?domain=KiritouKureha&post=${id}">🔗️前往 Telegram 頻道</a>`,
);

/** twitter
 * 推特引用
 * 用法：{% twitter <推特id> %}
 */
hexo.extend.tag.register(
  "twitter",
  ([id]) => `<a href="https://twitter.com/${id}">Twitter @${id}</a>`,
);

/** pixiv
 * Pixiv引用(用户)
 * 用法：{% pixiv <pixiv 用户数字> <pixiv 用户名> %}
 */
hexo.extend.tag.register(
  "pixiv",
  ([id, name]) =>
    `<a href="https://www.pixiv.net/users/${id}">Pixiv ID: ${name}</a>`,
);

/** ruby
 * 东亚文字注音或者字符注释
 * 用法：{% ruby <普通文本> <浮在上面的文字> %}
 */
hexo.extend.tag.register(
  "ruby",
  ([text, ruby]) => `<ruby>${text}<rp>(</rp><rt>${ruby}</rt><rp>)</rp></ruby>`,
);


/** steam_player
 * Steam 视频播放器
 * 用法：{% steam_player <地址里的数字 id> <cdn 可留空> %}
 */
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

/** gallery
 * 便捷轮播图
 * 用法：{% gallery %}
 * 一行一个图片地址
 * {% endgallery %}
 */
hexo.extend.tag.register("gallery", ([id = "carousel"], content) => {
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

/** script_defer
 * 延迟执行js，类似外部引用defer的效果
 * 用法：{% script_defer %}
 * 脚本内容
 * {% endscript_defer %}
 */
hexo.extend.tag.register("script_defer", (_args, content) =>
  content
    .replace(/<script>/gi, "<script>docReady(() => {")
    .replace(/<\/script>/gi, "});</script>"), { ends: true });

/** template
 * 自定义元素模板
 * 用法：{% template <自定义元素名，必须包含一个减号> <参数列表，空格分割，其中html特别指代元素的innerHTML内容> %}
 * 里面类似jsx语法，返回元素将会替代当前自定义元素，由于一些神秘限制 `{{` 和 `}}` 需要用 `%{` 和 `}%` 来代替
 * {% endtemplate %}
 * 示例：
 * 正文写<x-custom-element attr="123">456</x-custom-element>
 * {% template x-custom-element attr html %}
 * <div class="custom">
 *   <span>{attr}</span>
 *   <span>{html}</span>
 * </div>
 * {% endtemplate %}
 * 最终页面就会渲染成
 * <div class="custom">
 *  <span>123</span>
 *  <span>456</span>
 * </div>
 */
hexo.extend.tag.register("template", ([name, ...args], content) => {
  const raw = content.replace(/%{/g, "{{").replace(/}%/g, "}}");
  const fn = jsx.fromString(`({ ${args.join(", ")} }) => ${raw}`, {
    factory: "ce",
  });
  return `<script>docReady(() => {
  defineCustomElement(${JSON.stringify(name)}, ${fn});
})</script>`;
}, { ends: true });
