<div align="center">
  <img src="./public/icons/icon128.png" alt="AI-MarkDone" width="88" height="88">
  <h1>AI-MarkDone</h1>
  <p>给 ChatGPT 加上目录、阅读器和内容整理工具。</p>
  <p>
    <a href="https://chromewebstore.google.com/detail/ai-markdone/bmdhdihdbhjbkfaaainidcjbgidkbeoh"><img src="https://img.shields.io/chrome-web-store/v/bmdhdihdbhjbkfaaainidcjbgidkbeoh?label=Chrome%20Web%20Store" alt="Chrome Web Store"></a>
    <a href="./LICENSE"><img src="https://img.shields.io/github/license/zhaoliangbin42/AI-MarkDone" alt="MIT License"></a>
    <a href="https://github.com/zhaoliangbin42/AI-MarkDone"><img src="https://img.shields.io/github/stars/zhaoliangbin42/AI-MarkDone?style=social" alt="GitHub stars"></a>
  </p>
</div>

[官网](https://zhaoliangbin42.github.io/ai-markdone/) · [使用手册](https://zhaoliangbin42.github.io/ai-markdone/manual/) · [English](./README.md)

大家好，我是一名工科研究生，平时经常用 ChatGPT 阅读和写作。做这个插件，是因为一些小事每天都在重复：长对话里找不到前面的回复，复制公式到 Typora 后还要整理，读到一句想修改的地方，又得回到输入框重新描述一遍。

我希望这些操作能顺手一点。读到哪里，就能在原文旁边写下注释；想留下的内容，可以直接复制、收藏或导出；继续提问时，再把原文和意见一起带过去。AI-MarkDone 就是从这些需要里慢慢做起来的。

它免费、开源，围绕 ChatGPT 开发。目前提供 Chrome 和 Firefox 版本，Safari 不再适配。

## 安装后，先从这里开始

| 浏览器 | 安装入口 |
| --- | --- |
| Chrome | [Chrome Web Store](https://chromewebstore.google.com/detail/ai-markdone/bmdhdihdbhjbkfaaainidcjbgidkbeoh) |
| Firefox | [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/ai-markdone/) |

当前分支正在准备 **6.2.0**。商店和 GitHub 发布页的更新可能有先后，实际可安装的版本以对应页面为准。

安装后刷新 ChatGPT 页面：

1. 展开回复下方的工具栏，可以复制 Markdown、保存消息书签、打开阅读器或导出消息。
2. 长对话可以用右侧消息目录查找。新安装默认显示目录；已有用户保留原来的设置。右下角也有上一条、下一条按钮。
3. 选中一段文字，可以写注释或标记高亮。想把公式拿走，直接点击公式就能复制 LaTeX。
4. 点击右下角的 AI-MarkDone 图标，或浏览器扩展图标，打开资料库和设置。不知道还有什么功能时，可以先看“功能全览”。

如果刚更新完插件，按钮没有出现，请重新加载扩展，再刷新 ChatGPT 页面。

## 它能帮你做什么

### 在长对话里找消息，把长回复读清楚

消息目录按提问显示条目，悬停可以预览回复。随着网站加载更多消息，目录也会继续补充；它不会凭空补回网站尚未提供的历史。

阅读器把单条回复放到单独的阅读界面里，保留标题、表格、代码和公式。长回复可以通过标题大纲跳转，几段需要反复对照的内容，可以先放到摘录区。

如果希望在另一个标签页阅读，右下角工具栏里还有“独立阅读器”。它需要保留原 ChatGPT 标签页，内容更新后可以手动刷新。

<p align="center"><img src="imgs/Reader.png" alt="阅读器示例：阅读回复、查看标题大纲和切换消息" width="900"></p>

### 复制你需要的内容，或者整理成文件

整条回复可以复制为 Markdown，也可以只取其中一段。标题、列表、表格、代码和公式会保留对应结构；只选中代码的一部分时，就只复制那个片段。

在 ChatGPT 原页面复制选区 Markdown，默认快捷键是 `Cmd/Ctrl + Shift + C`；阅读器内使用 `Cmd/Ctrl + C`。单个公式直接点击复制，也可以在公式预览或操作菜单里保存 PNG、SVG 等格式。

导出时，可以选择一条或多条回复：

| 格式 | 适合做什么 |
| --- | --- |
| Markdown | 放进笔记或编辑器里继续整理。 |
| 离线 Markdown ZIP | 把支持的图表、卡片图片和 Markdown 一起保存，解压后使用。 |
| PDF | 打开浏览器打印窗口，再选择“保存为 PDF”。 |
| PNG | 保存或分享长图；多条回复尽量合成一张，内容超出限制时会拆图并打包。 |

ChatGPT 新的图表和卡片并非都能完整保留。能处理的内容会保存成静态图片；无法保存的部分会留下文字说明。PDF 和 PNG 也可以选择使用文字占位，离线文件不保留原网页的交互操作。

### 对着原文写意见，再接着问

读到某句话想追问、补充或修改，选中它就可以写注释。注释窗口可以拖动、最小化和展开，点击框外也不会关掉。

写完后，可以把原文、注释和提示词一起复制，或放进输入框继续提问。插入后仍可以先检查、修改，再自行发送。

不需要写意见、只想标个重点时，可以用高亮。注释和高亮都能在资料库中按对话查看、搜索和整理，并返回标记的原文。

### 把有用的回复留下来

消息书签保存当时的提问和回复，之后可以在资料库中阅读、复制，或返回原对话；页面书签则用来收藏对话链接。开启“书签只保存内容摘要”后，长内容会按摘要规则保存。

书签、注释和高亮可以用文件夹整理。需要换浏览器或另存一份时，可以导出资料库文件，也可以连接实验性的 Google Drive 备份。备份和恢复都需要手动操作，不是自动同步。

### 写提示词和公式时少折腾一点

常用提示词可以保存起来，在输入框里输入反斜杠和触发词调用，也可以预先指定插入后要填写的位置。

开启输入增强后，Enter 用来换行，`Cmd/Ctrl + Enter` 用来发送，还可以使用加粗和列表辅助。光标进入公式时会出现预览，输入 LaTeX 命令可以调用片段，并直接从预览复制或导出公式。

按钮太多或布局不顺手，可以在“设置 → 按钮”中隐藏或固定常用按钮；主题、字号和主色也可以调整。

## 哪些内容会保存

这里有几种不同的“保存”，最好先分清楚：

| 内容 | 保存方式 |
| --- | --- |
| 书签、高亮 | 保存到当前浏览器，可以通过资料库导出备份。 |
| 正式注释 | “保存新建的注释”默认关闭；关闭时新注释只留在当前页面，开启后新注释可在刷新后继续查看。已有保存的注释不受开关影响。 |
| 没写完的注释草稿 | 自动暂存；能确认对话和原文位置时，最近保存后的 30 天内可在当前浏览器恢复；无法确认时只在当前页面保留。草稿不等于正式注释，也不进入资料库备份。 |
| 摘录区 | 当前页面的临时内容，刷新后清空。 |

资料库备份包含已保存的书签、高亮、注释及其文件夹。提示词、插件设置和草稿不在其中；设置偏好可以单独导出为配置文件。重要内容建议定期导出一份。

更详细的用法和保存规则，见[使用手册](https://zhaoliangbin42.github.io/ai-markdone/manual/)和插件内的常见问题。

## 6.2.0 这次改了什么

这次主要完善注释、复制和导出，也重新检查了 ChatGPT 更新后的内容识别：

- 注释窗口支持拖动、最小化和恢复草稿，点击框外不再关闭。
- 支持的图表和卡片可以随 Markdown 保存为离线 ZIP；PDF／PNG 可选择图片或文字占位。
- 修复代码格式丢失、保存期间序号变化导致书签误报不可用，以及注释、高亮定位到错误段落的问题。
- 修复了一个导致消息 PDF 空白的打印冲突，并改善长代码、宽表格和公式的排版。
- 修复切换会话后目录、回复工具栏不出现的问题，并统一常用窗口的样式。

感谢提供反馈的朋友。具体变化和感谢名单见[本次版本说明](./RELEASE_NOTES.md)，历史记录见[完整更新日志](./CHANGELOG.md)。

<p align="center"><img src="imgs/FeatureOverview.png" alt="插件内的功能全览，可以查看用法、入口和相关设置" width="900"></p>

## 手动安装与开发

Chrome 的手动安装包可以从 [GitHub Releases](https://github.com/zhaoliangbin42/AI-MarkDone/releases) 中选择已发布版本下载。解压后打开 `chrome://extensions/`，开启开发者模式，点击“加载已解压的扩展程序”，选择包含 `manifest.json` 的目录，再刷新 ChatGPT。

如果要使用当前分支的开发版：

```bash
npm install
npm run build
```

Chrome 加载 `dist-chrome/`。Firefox 可以打开 `about:debugging#/runtime/this-firefox`，临时载入 `dist-firefox/manifest.json`；[临时扩展在重启 Firefox 后失效](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/)，日常安装请使用商店版。

开发时常用的检查：

```bash
npm run test:smoke
npm run test:core
npm run build
```

欢迎提交 Issue 或 PR。开发规范从 [AGENTS.md](./AGENTS.md) 开始，架构、功能和测试记录见 [docs/README.md](./docs/README.md)。

## 反馈与支持

这是一个个人项目，很多改进来自大家日常使用时的反馈。如果有问题，可以在 [GitHub Issues](https://github.com/zhaoliangbin42/AI-MarkDone/issues) 留言，或发邮件到 [zhaoliangbin42@gmail.com](mailto:zhaoliangbin42@gmail.com)。告诉我用了哪个浏览器、哪项功能、操作到哪一步，会更方便复现。

如果这个插件帮到了你，欢迎点个 Star、分享给需要的朋友，或者请我喝杯咖啡，支持后续更新。

<table>
  <tr><th>Buy Me a Coffee</th><th>微信赞赏</th></tr>
  <tr><td><img src="imgs/bmc_qr.png" alt="Buy Me a Coffee 二维码" width="160"></td><td><img src="imgs/wechat_qr.png" alt="微信赞赏二维码" width="160"></td></tr>
</table>

感谢所有提供建议、反馈问题和贡献代码的朋友，以及本项目使用的开源工具。

本项目基于 [MIT License](./LICENSE) 开源。
