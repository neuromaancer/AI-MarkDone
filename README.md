<div align="center">
  <img src="./public/icons/icon128.png" alt="AI-MarkDone" width="88" height="88">
  <h1>AI-MarkDone</h1>
  <p>Read long ChatGPT replies, keep useful passages, and pick up where you left off.</p>
  <p>
    <a href="https://chromewebstore.google.com/detail/ai-markdone/bmdhdihdbhjbkfaaainidcjbgidkbeoh"><img src="https://img.shields.io/chrome-web-store/v/bmdhdihdbhjbkfaaainidcjbgidkbeoh?label=Chrome%20Web%20Store" alt="Chrome Web Store"></a>
    <a href="./LICENSE"><img src="https://img.shields.io/github/license/zhaoliangbin42/AI-MarkDone" alt="MIT License"></a>
    <a href="https://github.com/zhaoliangbin42/AI-MarkDone"><img src="https://img.shields.io/github/stars/zhaoliangbin42/AI-MarkDone?style=social" alt="GitHub stars"></a>
  </p>
</div>

[Website](https://zhaoliangbin42.github.io/ai-markdone/en/) · [User manual](https://zhaoliangbin42.github.io/ai-markdone/en/manual/) · [中文文档](./README.zh.md)

I'm an engineering graduate student, and I use ChatGPT often for reading and writing. I started this extension because a few small tasks kept getting in the way: finding an earlier reply, cleaning up formulas after pasting them into Typora, or returning to the input box to explain which sentence I wanted changed.

I wanted those steps to feel easier. Write a note beside the passage I'm reading. Copy, bookmark or export something worth keeping. Then bring the passage and my comments into the next question. AI-MarkDone grew out of those everyday needs.

It is free, open source, and developed for ChatGPT. Chrome and Firefox builds are available; Safari support has ended.

## Install it and try a few things

| Browser | Install from |
| --- | --- |
| Chrome | [Chrome Web Store](https://chromewebstore.google.com/detail/ai-markdone/bmdhdihdbhjbkfaaainidcjbgidkbeoh) |
| Firefox | [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/ai-markdone/) |

This branch is preparing **6.2.0**. Store updates and GitHub releases may arrive at different times; check the relevant page for the version available to install.

Refresh ChatGPT after installation:

1. Open the toolbar below a reply to copy Markdown, save a message bookmark, open Reader or export messages.
2. Use the directory on the right to find replies in a long conversation. It is on by default for new installations; existing settings are preserved. Previous/next buttons are also available at the lower-right.
3. Select a passage to annotate or highlight it. Click a formula to copy its LaTeX source.
4. Open Library and Settings from the lower-right AI-MarkDone icon or the browser's extension icon. Feature overview explains the other tools and where to find them.

If controls are missing after an extension update, reload the extension and refresh ChatGPT.

## What you can do with it

### Find earlier messages and read long replies

The message directory lists question summaries and lets you preview replies on hover. As ChatGPT loads more messages, the directory adds them. It cannot recover history the website has not made available.

Reader puts a reply in its own reading view, with headings, tables, code and formulas. Use the heading outline to move around a long answer, or keep a few passages in the Excerpt tray for comparison.

Separate reader opens in another tab from the lower-right toolbar. Keep the original ChatGPT tab open, and refresh the reader manually when the conversation changes.

<p align="center"><img src="imgs/Reader.png" alt="Reader example with a reply, heading outline and message navigation" width="900"></p>

### Take the content you need

Copy an entire reply as Markdown or select just a passage. Headings, lists, tables, code and formulas keep their corresponding structure. Selecting part of a code block copies only that fragment.

The default shortcut for selected Markdown on the ChatGPT page is `Cmd/Ctrl + Shift + C`; inside Reader, use `Cmd/Ctrl + C`. Click an individual formula to copy its source, or use its preview/actions to save formats such as PNG and SVG.

For one or several selected replies:

| Format | Use it for |
| --- | --- |
| Markdown | Continue editing in your notes or text editor. |
| Offline Markdown ZIP | Keep supported chart/card images alongside the Markdown, then extract the bundle to use it. |
| PDF | Open the browser print dialog and choose Save as PDF. |
| PNG | Save or share a long image. Selected replies are combined when possible; content beyond the limit is split into images in a ZIP. |

Some of ChatGPT's newer charts and cards cannot be preserved completely. Supported content becomes static images; unavailable parts keep a text explanation. PDF and PNG also offer text placeholders. Offline files do not retain the original interactive controls.

### Leave a note beside the passage, then ask a follow-up

Select a sentence to write a question, correction or revision note. The annotation window can be dragged, minimized and expanded. Clicking outside keeps it open.

Copy the original passages, annotations and a reusable prompt together, or insert them into the input box. You can review and edit the draft before sending it yourself.

For a passage you simply want to mark, use a highlight. Both annotations and highlights can be searched and organized by conversation in Library, with a way back to the marked text.

### Keep useful replies for later

Message bookmarks save the question and reply as they were when saved. Read or copy them in Library, or return to the original conversation. Page bookmarks keep a conversation link. With Save only bookmark excerpts enabled, long content is saved according to the excerpt rules.

Use folders to organize bookmarks, annotations and highlights. Export a local Library file when moving browsers or keeping a backup, or connect the experimental Google Drive backup. Backup and restore are manual; changes do not sync automatically.

### Reuse prompts and work with formulas

Save prompts you use often, then type a backslash and trigger text in the input box to call them up. You can also mark where the cursor should go after insertion.

With Input enhancement enabled, Enter inserts a new line and `Cmd/Ctrl + Enter` sends. Bold and list helpers are available too. Formula previews follow the text cursor, LaTeX commands offer snippets, and previews let you copy or export the formula directly.

Under Settings → Buttons, hide controls you do not need or pin the ones you use often. Theme, font size and accent color can also be changed.

## What gets saved

These tools have different saving behavior:

| Content | Where it stays |
| --- | --- |
| Bookmarks and highlights | Saved in the current browser, and included in Library backups. |
| Saved annotations | Save new annotations is off by default. While off, new annotations stay on the current page; while on, new annotations survive refreshes. Previously saved annotations are unaffected by the switch. |
| Unfinished annotation drafts | Recoverable in this browser for 30 days after the last save when the conversation and passage can be identified; otherwise kept on the current page. Drafts are separate from saved annotations and are not included in Library backups. |
| Excerpt tray | Temporary content for the current page; refreshing clears it. |

Library backups include saved bookmarks, highlights, annotations and their folders. Prompts, extension settings and drafts are excluded. Preferences can be exported separately as a configuration file. Export important material regularly.

The [user manual](https://zhaoliangbin42.github.io/ai-markdone/en/manual/) and in-extension FAQ explain the details.

## What's changing in 6.2.0

This update improves annotations, copying and exports, and revisits content detection after ChatGPT's recent changes:

- Move, minimize and recover drafts in the annotation window without closing it when clicking outside.
- Keep supported charts/cards in an offline Markdown ZIP; choose images or placeholders for PDF/PNG.
- Fix lost code formatting, bookmark failures when reply numbers change during saving, and annotation/highlight jumps to the wrong passage.
- Fix an identified print conflict causing blank message PDFs, and improve wide tables, long code and formula layout.
- Restore the directory and reply controls after conversation switches, and bring smaller windows into the shared appearance.

Thanks to everyone who sent feedback. See the [release notes](./RELEASE_NOTES.md) for this update and its acknowledgments, or the [full changelog](./CHANGELOG.md) for earlier versions.

<p align="center"><img src="imgs/FeatureOverview.png" alt="The in-extension Feature overview lists tools, entry points and related settings" width="900"></p>

## Manual installation and development

For Chrome, choose an available release package from [GitHub Releases](https://github.com/zhaoliangbin42/AI-MarkDone/releases). Extract it, open `chrome://extensions/`, enable Developer mode and choose Load unpacked. Select the directory containing `manifest.json`, then refresh ChatGPT.

To use a development build of this branch:

```bash
npm install
npm run build
```

Load `dist-chrome/` in Chrome. In Firefox, open `about:debugging#/runtime/this-firefox` and temporarily load `dist-firefox/manifest.json`. [Temporary add-ons are removed when Firefox restarts](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/); use the store build for everyday installation.

Common development checks:

```bash
npm run test:smoke
npm run test:core
npm run build
```

Issues and pull requests are welcome. Start with [AGENTS.md](./AGENTS.md) for development rules and [docs/README.md](./docs/README.md) for architecture, feature contracts and test records.

## Feedback and support

This is a personal project, and many improvements come from everyday use and feedback. Report a problem in [GitHub Issues](https://github.com/zhaoliangbin42/AI-MarkDone/issues) or email [zhaoliangbin42@gmail.com](mailto:zhaoliangbin42@gmail.com). Include your browser, the feature you were using and the steps that led to the problem so I can reproduce it.

If the extension has helped you, a Star, a recommendation to a friend, or a coffee helps support continued development.

<table>
  <tr><th>Buy Me a Coffee</th><th>WeChat</th></tr>
  <tr><td><img src="imgs/bmc_qr.png" alt="Buy Me a Coffee QR code" width="160"></td><td><img src="imgs/wechat_qr.png" alt="WeChat support QR code" width="160"></td></tr>
</table>

Thanks to everyone who shares suggestions, reports bugs or contributes code, and to the open-source projects used here.

Released under the [MIT License](./LICENSE).
