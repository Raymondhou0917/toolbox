# 🧰 雷蒙三十工具箱（Toolbox）

> 超級個體的實用小工具——簡單、美觀、好用。

這是一個我為自己和社群夥伴打造的數位工具集合。裡面放的都是我們在工作、教學、活動中會用到的小工具，目標是讓這些工具**免費、好用、隨開即用**。

## 🎯 目前有哪些工具？

| 工具 | 說明 | 路徑 |
|------|------|------|
| **抽獎工具集** | 包含幸運輪盤、數字抽獎、配對分組三種功能。支援自訂名單組、本地暫存。 | `/lottery` |
| **倒數計時器** | 簡潔的課程倒數計時器，有休息、開場、練習三種模式，可以嵌入 Notion 或 OBS。 | `/timer` |

未來會持續新增更多工具，像是：簡報計時器、隨機點名器、活動簽到表等等。

## 🛠️ 技術架構（給想改 code 的人看）

這個專案用的是：
- **前端**：React 19 + Vite + Tailwind CSS 4 + shadcn/ui
- **動畫**：Canvas API（輪盤）、CSS transitions、Confetti 特效
- **資料儲存**：LocalStorage（本地暫存）

專案結構很單純：
- `/` → 入口頁（工具選單）
- `/lottery` → 抽獎工具集（React SPA）
- `/timer` → 倒數計時器（原本的純 HTML/CSS/JS，直接放在 public 資料夾）

## 🚀 怎麼部署？

這是一個**純前端靜態網站**，可以部署到任何靜態網站託管服務：

### Zeabur 部署
1. 把這個 repo 連結到 Zeabur
2. 設定 Port 為 `8080`（或讓 Zeabur 自動偵測）
3. 綁定自訂網域（例如 `tool.lifehacker.tw`）

### 本地開發
```bash
pnpm install
pnpm dev
```

### 建置生產版本
```bash
pnpm build
pnpm preview
```

## 📝 更新紀錄

> 完整的更新紀錄請參閱 **[CHANGELOG.md](./CHANGELOG.md)**

### 最新版本

**v1.1.3** (2024-12-09)
- 新增「重置名單」功能，避免不小心刪除
- 修正多選項輪盤動畫與結果不匹配問題

**v1.1.1** (2024-12-09)
- 修正輪盤動畫與結果不匹配問題
- 新增「中獎後自動移除獲獎者」勾選功能

**v1.1.0** (2024-12-09)
- 簡化為純前端版本，移除資料庫和登入依賴

---

## 👋 關於作者

**侯智薰（雷蒙）**
- 個人網站：[raymondhouch.com](https://raymondhouch.com/)
- 社群媒體：[portaly.cc/notionhacker](https://portaly.cc/notionhacker)
- 品牌官網：[lifehacker.tw](https://lifehacker.tw)

© 2025 雷蒙三十
