function toDash(name) {
  return name.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`).replace(/^\$/g, "--");
}
function parseName(name) {
  const [s1, r1] = name.split('#')
  if (r1) {
    const ret = document.createElement(s1)
    const [s2, ...r2] = r1.split('.')
    ret.id = s2
    for (let clazz of r2)
      ret.classList.add(clazz)
    return ret
  } else {
    const [s2, ...r2] = s1.split('.')
    const ret = document.createElement(s2)
    for (let clazz of r2)
      ret.classList.add(clazz)
    return ret
  }
}
function ce(name = "div", attr = {}, children = []) {
  const ret = typeof name == "string" ? parseName(name) : name;
  for (const key in attr) {
    const value = attr[key];
    if (typeof value != "string") {
      if (key == "data") Object.assign(ret.dataset, value);
      else if (key == "class") {
        if (Array.isArray(value))
          for (const name of value) ret.classList.add(toDash(name));
        else
          for (const name in value) ret.classList.toggle(toDash(name), !!value[name]);
      } else if (key == "style")
        for (const name in value) ret.style.setProperty(toDash(name), value[name]);
    } else {
      ret.setAttribute(key, "" + attr[key]);
    }
  }
  if (typeof children == "string")
    ret.innerHTML = children;
  else
    for (const child of children) ret.appendChild(typeof child == "string" ? document.createTextNode(child) : child);
  return ret;
}
function attrs(target, base = {}) {
  return new Proxy(base, {
    get(o, key) {
      return key in o ? o[key] : target.getAttribute(key)
    }
  });
}
function defineCustomElement(name, cb) {
  customElements.define(name, class extends HTMLElement { connectedCallback() {
    const html = this.innerHTML.trim();
    this.innerHTML = "";
    const ret = cb.call(this, attrs(this, { html, self: this }));
    if (ret) this.replaceWith(ret);
  } });
}
defineCustomElement("x-gallery", ({ xid, html }) => {
  const ref = "#" + xid;
  const arr = html.split("\n").map(x => x.trim());
  return ce("div.carousel.slide", { id: xid, data: { ride: "carousel" } }, [
    ce("ol.carousel-indicators", {}, arr.map((_, i) =>
      ce("li", { data: { target: ref, slideTo: i }, class: { active: i == 0 } })
    )),
    ce("div.carousel-inner", {}, arr.map((src, i) =>
      ce("div", { class: { carouselItem: true, active: i == 0 } }, [ce("img", { class: "d-block w-100", src })])
    )),
    ce("a.carousel-control-prev", { href: ref, role: "botton", data: { slide: "prev" } }, [
      ce("span.carousel-control-prev-icon")
    ]),
    ce("a.carousel-control-next", { href: ref, role: "botton", data: { slide: "next" } }, [
      ce("span.carousel-control-next-icon")
    ]),
  ]);
});
defineCustomElement("steam-player", function({ steamid, cdn }) {
  const base = `https://${cdn}/steam/apps/${steamid}/movie`;
  const poster = `${base}.293x165.jpg`;
  return ce("div.vidcontainer", {}, [
    ce("select.qualitypick", { autocomplete: "off" }, [
      ce("option", { selected: "selected" }, ["低畫質"]),
      ce("option", {}, ["高畫質"])
    ]),
    ce("video", { controls: "controls", preload: "metadata", width: '100%', poster }, [
      ce("source", { label: "低畫質", src: `${base}480_vp9.webm`, type: "video/webm" }),
      ce("source", { label: "低畫質", src: `${base}480.webm`, type: "video/webm" }),
      ce("source", { label: "低畫質", src: `${base}480.mp4`, type: "video/mp4" }),
      ce("source", { label: "高畫質", src: `${base}_max_vp9.webm`, type: "video/webm" }),
      ce("source", { label: "高畫質", src: `${base}_max.webm`, type: "video/webm" }),
      ce("source", { label: "高畫質", src: `${base}_max.mp4`, type: "video/mp4" }),
    ])
  ]);
});
defineCustomElement("x-ruby", ({ title, html }) => ce("ruby", { title }, [
  ce("span", {}, html),
  ce("rp", {}, ["("]),
  ce("rt", {}, [title]),
  ce("rp", {}, [")"]),
]));
defineCustomElement("steam-widget", ({ id }) => ce("iframe", {
  src: `https://store.steampowered.com/widget/${id}/`,
  loading: "lazy",
  frameborder: "0",
  style: { width: "100%", height: "200px" }
}));
defineCustomElement("itch-widget", ({ id }) => ce("iframe", {
  src: `https://itch.io/embed/${id}/`,
  loading: "lazy",
  frameborder: "0",
  style: { width: "100%", height: "177px" }
}));
defineCustomElement("telegram-channel", ({ post, domain = "KiritouKureha", html }) => ce("a", {
  href: `tg://resolve?domain=${domain}&post=${post}`
}, [html]));
