# SEO Keyword Ranking Portfolio (SEO 關鍵字實績展示)

這是一個展示 SEO 內容行銷與搜尋排名優化成果的靜態網站作品集。網站加入了簡單的後台管理功能，允許透過拖放方式調整卡片順序。

## 🌟 重大更新 (2026-01-23)

- **動態內容渲染**：重構 `index.html`，改由 Javascript 讀取 `data/items.js` 動態產生卡片與統計數據，提升維護性。
- **後台管理系統**：新增 `/admin` 管理頁面，支援「拖放排序」功能，可直觀調整前台卡片顯示順序。
- **後端伺服器**：建立 Express.js 伺服器 (`server.js`)，用於運作後台 API 以及儲存排序結果。
- **新增案例**：加入多項新實績，包括「固態奈米金」、「金銀比均值回歸」等高技術含量的關鍵字排名。

## 🚀 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 啟動伺服器 (開發模式)

這將會同時啟動靜態檔案服務與 API 伺服器。

```bash
npm start
# Server running at http://localhost:3003
```

### 3. 使用後台

前往 [http://localhost:3003/admin](http://localhost:3003/admin)
- 拖曳卡片以調整順序。
- 點擊「Save Changes」即可更新 `data/items.js`。
- 回到首頁重新整理即可看到最新排序。

## 📁 專案結構

- `index.html`: 前端首頁 (動態渲染)。
- `data/items.js`: 資料核心，儲存所有排名實績的 JSON 資料。
- `admin/`: 後台管理頁面的 HTML 與 CSS。
- `server.js`: Node.js 伺服器，處理靜態檔案與儲存 API。
- `deploy.ps1`: 自動化部署腳本 (Powershell)。
- `config.json`: 專案與部署設定檔。

## 🆕 新增內容流程

1. 將新的截圖圖片放入專案根目錄。
2. 編輯 `data/items.js`，依照格式新增一筆物件資料：
    ```javascript
    {
        "id": "unique-id",
        "title": "關鍵字標題",
        "rank": 1,
        "date": "YYYYMMDD",
        "image": "filename.jpg",
        "description": "簡短描述",
        "keywords": ["關鍵字"]
    }
    ```
3. (選用) 前往後台調整顯示順序。
4. 提交並部署。
