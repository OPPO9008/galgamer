function patch_generator(name) {
  const orig = hexo.extend.generator.get(name);
  hexo.extend.generator.register(name, function (locals) {
    const modified = Object.create(locals);
    Object.defineProperty(modified, "posts", {
      get() {
        return locals.posts.filter(({ hidden }) => !hidden);
      },
    });
    return orig.call(this, modified);
  });
}

patch_generator("index");
