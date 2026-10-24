# Dan 的生日卡片

純 HTML、CSS、JavaScript 的靜態網頁，不需要安裝套件或建置。

在專案資料夾執行 `python3 -m http.server 3000 --bind 127.0.0.1`，開啟 http://localhost:3000/ 預覽。JavaScript 模組需要透過 HTTP 預覽。

## 修改內容

`card-content.js` 集中管理背景圖片、標題、副標題、底部文字、信件、庫洛米圖片與相簿順序。修改 `letter` 即可更新信件；多行內容可使用 JavaScript 的反引號字串。`letterSticker` 設定貼圖與要接在哪句文字之後。信件以段落排版，手機內文約 13px；目前內容在 402 × 700px 的模擬可視區域內可完整顯示整張卡片。信紙隨文字自然增高，較窄螢幕或放大文字時仍可捲動閱讀。

相簿依 `us/010.jpg` 到 `us/440.jpg` 排列，第一張與原草圖相同。手機可在相框照片或放大照片上左滑下一張、右滑上一張；上下滑動保留捲動功能。也可使用前後按鈕、在相簿取得焦點時使用鍵盤左右鍵，或點擊照片放大；按 Escape 關閉放大畫面。照片按需載入。

## 元件

每個元件的程式與樣式放在 `components/` 的同名 `.js`、`.css` 檔案：

| 元件 | 檔名 | 可調整內容 |
| --- | --- | --- |
| 背景 | `background` | 畫作、疊色、裁切 |
| 主標題 | `title` | 文字、字體、位置 |
| 副標題／底部文字 | `subtitle` | 獨立文字內容與位置 |
| 中央信紙 | `letter` | 信件、白紙造型與淡線 |
| 相簿 | `album` | 相框、切換按鈕、放大檢視 |
| 庫洛米 | `character` | 插畫、大小與位置 |
| 裝飾 | `decorations` | 星星與外框 |

`card.js` 組合各元件；`styles.css` 管理整體版面。這是程式與內容設定的拆分，沒有另建拖拉編輯器。

## 之後發布

使用相對路徑，可部署在 GitHub Pages 的專案網址下。網頁需要 `index.html`、`card.js`、`card-content.js`、`styles.css`、`components/`、`assets/`、使用中的 `artwork/article2.jpg` 和 `us/` 中的 44 張 JPG。

本機備份 ZIP、`us/duplicates/` 與 CSV 對照表不供網頁使用，發布時不需要上傳。
