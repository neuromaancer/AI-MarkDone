# AI-MarkDone 6.2.0 发布准备快照

准备日期：2026-10-12（Asia/Shanghai）

## 材料与范围

- 版本号：package、lockfile、Chrome/Firefox 静态与构建 manifest 均为 6.2.0。
- 发布文案：`RELEASE_NOTES.md` 双语稿、英文 `CHANGELOG.md`、两个 README，以及管理面板内双语更新日志；FAQ/About 已一并核查。
- 本轮仅修复视觉检查脚本与测试页，不改变已验收的生产界面、内容池、存储或打印实现。用户可感知的 6.2.0 变化沿用上一版已整理文案。
- 用户明确将本轮实机验收缩小为 Chrome，取消 Firefox 界面和原生 PDF 验收。Firefox 仍保留构建与分发目标；不能把构建通过写成实机通过。
- Safari 已永久退出支持范围，不生成其产物，也不将历史反馈写成已修复。

## 验证

- 核心：329 个文件、2717 项通过；最终测试页主题修正后，相关 23 项通过。
- 发布门禁：冒烟 54、验收 471，Chrome/Firefox 构建、入口格式和单一内容池边界检查通过。
- Chrome 视觉：完整组件矩阵 492、资料库主页 41、设置主页 41 全部通过；截图抽查发现深色测试页背景遗漏，修正后重跑该页 41 项通过。共验收 574 个不同场景，另有 41 项修正后重跑。
- 覆盖明暗、中英、320/390/768/1024/1440px、短窗口、减少动态效果和 200% 等效重排。检查页面/控制台错误、边界、开关和书签布局以及浮层点击安全；截图人工抽查另行执行。
- 安装后 Chrome 原生 200% 缩放：管理面板无横向溢出，关闭按钮可达，验收后恢复原缩放。
- 已保存的真实 Chrome 原生 PDF 复核：4 页均非空、选中回复的 60 段正文完整且无混入其他回复。该打印实现本轮无改动；未重新执行 Firefox 打印。
- ZIP 完整性、包内 manifest、声明资源及每个文件与 dist 字节一致性均通过；两个包各含 111 个文件。

## 安装包

- `release/AI-MarkDone-v6.2.0-chrome.zip`
- `release/AI-MarkDone-v6.2.0-firefox.zip`（未做本轮实机验收）
- `release/AI-MarkDone-v6.2.0-SHA256SUMS.txt`

产物取自 `codex/unified-surface-visual-upgrade` 上通过最终门禁的 6.2.0 构建。
包和校验和保存在本地 `release/`，未上传。

## 正式发布边界

准备完成不代表已发布。本轮未合并 main、打标签、推送、上传 GitHub Release 或提交商店。
正式发版时按 `.codex/guides/release.md` 将确认后的提交合入 main，再处理标签和分发；公开发布状态以远端及商店记录为准。

详细证据：[6.2.0 验收记录](../docs/reviews/2026-10-12-6.2.0-release-readiness.md)。
