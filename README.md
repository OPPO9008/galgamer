# 重樱小学堂
https://galgamer.eu.org/

 * 游戏评测+精选cg

 * 实况视频

 * 自建网盘下载 + 百度云 + onedrive + 阿里网盘 + 蓝奏云 + 磁力/种子

现在招募志愿者帮助编写游戏评测&录制实况



## 投稿方式

嫌以下步骤麻烦？直接把写好的 word 发给管理员，然后管理员会指导你生成 md，，，



将这个仓库 fork 到你自己的 GitHub 账户，然后再克隆到本地。

打开仓库文件夹，命令行运行 npm install ，电脑上要装有 nodejs。

假设新文章名字叫 new-article，在 source/_post/ 新建 一个 new-article.md，在 source/image 新建一个 new-article 文件夹，里面存放图片。

使用 Markdown 编写，引用图片时使用

```
![图片注解](../image/new-article/图片文件名)
```

注意 ，提交图片到 source/image 目录，建议使用 webp 格式，或者使用 PS 等软件进行压缩，加快图片加载。

遇到困难请直接查看 source/_post/ 文件夹内写好的文章示例。

不会写Markdown？教程：https://segmentfault.com/a/1190000039928775



写完后，在命令行运行 hexo server，按照提示打开本地的网站即可预览效果。

之后提交，push 回到你自己的仓库，回到你自己仓库的页面向主分支发起 PR。



Git 太难用？可以用 SourceTree 软件，鼠标点点就能提交推送。

![SourceTree 截图](https://wac-cdn.atlassian.com/dam/jcr:580c367b-c240-453d-aa18-c7ced44324f9/hero-mac-screenshot.png)

## 写了不知道效果怎么样？

使用 Typora 软件可直接在电脑上打开 md，也可以使用下面的在线编辑器。

https://1024tools.com/markdown

写完后，在命令行运行 hexo server，按照提示打开本地的网站即可预览效果。

## 分类，标签等特殊配置写法
https://hexo.io/zh-cn/docs/front-matter
