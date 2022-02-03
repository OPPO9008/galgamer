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
function processChildren(target, children = []) {
  for (const child of children) {
    if (child == null || typeof child == "boolean") continue;
    if (Array.isArray(child)) processChildren(target, child);
    else if (child instanceof HTMLElement) target.appendChild(child);
    else target.appendChild(document.createTextNode("" + child));
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
    } else if (key == "html") {
      ret.innerHTML = attr[key];
    } else {
      ret.setAttribute(key, "" + attr[key]);
    }
  }
  if (typeof children == "string")
    ret.innerHTML = children;
  else
    processChildren(ret, children)
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
