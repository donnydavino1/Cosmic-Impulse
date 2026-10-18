# 打造你自己的 Cosmic Impulse（借助你的 AI）

Cosmic Impulse 生来就是给玩家改造的。你不需要会编程：把代码仓库交给一个 AI 编程助手，描述你想要的游戏：
*“像潜艇声呐室一样的驾驶舱”*、*“单手拇指就能操作”*、*“我的飞船像蝠鲼，开火时会发光”*。

## 唯一的规则
你的 AI 可以修改你**看到和触碰到**的一切。但如果你想和其他玩家对战，它不能修改**规则模块**：
这样你的物理指纹保持一致，公平竞技才能成立。参见 [[公平竞技与规则|Fair Play and Rules]]。

## 怎么做
1. 下载代码（zip 包或 GitHub 仓库）。
2. 先把 **`AGENTS.md`** 交给你的 AI：它说明了哪些文件可以改、哪些是共享规则、以及如何验证。
3. 提出你的要求。AI 会修改 `game/` 中的模块并运行 `node tools/build-game.mjs`。
4. 如果构建输出显示 `physics fingerprint … (official ✓)`，你依然可以与所有人对战。

## 可直接复制的提示词
> 请阅读本仓库中的 AGENTS.md、docs/LAWS.md、docs/ARCHITECTURE.md 和 docs/MODDING.md。我想改变游戏的外观和手感：
> [描述你的想法]。不要修改 game/manifest.json 中列出的任何 RULES 模块，保证我的物理指纹仍是官方版本。
> 构建两个版本并告诉我指纹。

技术文档（英文）位于 `docs/` 和 `AGENTS.md`；即使你用中文和 AI 交流，它也能读懂。
