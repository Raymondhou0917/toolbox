# Project TODO

## 已完成功能
- [x] 基本首頁佈局
- [x] 導航選單
- [x] 輪盤抽獎功能
- [x] 數字抽獎功能
- [x] 配對分組功能
- [x] 本地暫存 (Local Storage)
- [x] 升級為全端架構
- [x] 整合 Google 登入按鈕

## 進行中功能
- [x] 名單組功能（類似 Excel 工作表切換）
- [x] 預設名單組：雷蒙三十、健身鍛鍊、命運之輪
- [x] 移除單次輸入，只保留批次輸入
- [x] 新增儲存名單組按鈕
- [x] 雲端同步機制（登入用戶）
- [x] 資料庫 schema 設計

## 待開發功能
- [x] 名單組的新增/編輯/刪除
- [ ] 本地與雲端資料合併邏輯
- [ ] 配對分組也支援名單組功能


## 專案整合（新需求）
- [x] 分析 countdown-timer 與 lottery_tool 的技術架構差異
- [x] 設計統一的工具入口頁面 (tool.lifehacker.tw)
- [x] 建立 Bento Grid 風格的工具選單
- [x] 更新 lottery_tool 的 Footer 加入工具切換連結
- [x] 更新 countdown-timer 的 Footer 加入工具切換連結
- [x] 規劃共用 CSS/JS 資源的整合方案（採用方案 B）
- [ ] 準備 Zeabur 部署文件


## Monorepo 架構建置（新需求）
- [ ] 建立 lifehacker-tools Monorepo 專案結構
- [ ] 設置 pnpm workspace 配置
- [ ] 建立共用 UI 元件庫 (packages/ui)
- [ ] 重構 countdown-timer 為 React 版本 (packages/timer)
- [ ] 整合 lottery_tool 到 Monorepo (packages/lottery)
- [ ] 建立入口頁面 (packages/portal)
- [ ] 更新所有工具的 Footer 加入工具切換連結
- [ ] 測試所有工具功能正常
- [ ] 準備 GitHub 推送


## GitHub 推送（新需求）
- [ ] 撰寫 README.md（專案介紹與 Update Log）
- [ ] 初始化 Git 並推送到 GitHub toolbox repo
