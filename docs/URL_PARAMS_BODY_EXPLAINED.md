# Domain、Path、Base URL 與 Params、Body 完整拆解

## 一、核心定錨

```
domain 決定「去哪台伺服器」
path 決定「找哪個資源」
query / body 決定「你想怎麼用這個資源」
```

---

## 二、Domain / Path / Base URL 的差異

### 一句話版（定錨）

```
domain 決定「找哪一台伺服器」
path 決定「伺服器裡的哪個資源」
base URL 是「給程式用來組合 URL 的前綴」
```

---

### 1️⃣ Domain（網域）

#### 是什麼？

```
https://api.example.com
```

👉 **domain = 網路上的一台服務入口**

#### Domain 解決的是

- DNS 指到哪一台機器
- Cookie 要不要被帶
- 同源政策（CORS）

#### 對 Cookie 的影響

- Cookie 只會送給**符合 domain** 的請求
- `api.example.com` ≠ `www.example.com`

---

### 2️⃣ Path（路徑）

#### 是什麼？

```
/api/users/123
```

👉 **path = 在這個 domain 底下，請哪個資源**

#### Path 解決的是

- API 路由
- Controller / handler
- REST 資源定位

#### 舉例

```
https://api.example.com/api/users
https://api.example.com/api/orders
```

👉 同一台伺服器，不同功能

---

### 3️⃣ Base URL（程式層概念）

#### 是什麼？

```javascript
const baseURL = "https://api.example.com"
```

👉 **base URL 不是網路概念，是「程式方便用的組合前綴」**

#### 為什麼要有 Base URL？

因為你不想每支 API 都寫完整網址：

```javascript
// ❌ 不好的做法
fetch("https://api.example.com/api/users")
fetch("https://api.example.com/api/orders")
fetch("https://api.example.com/api/products")
```

而是：

```javascript
// ✅ 好的做法
const baseURL = "https://api.example.com"
fetch(`${baseURL}/api/users`)
fetch(`${baseURL}/api/orders`)
fetch(`${baseURL}/api/products`)
```

---

### 三者關係圖（一次看懂）

```
https://api.example.com/api/users/123?active=true
│        │               │
│        │               └─ path
│        └─ domain
└─ protocol

base URL = https://api.example.com
```

---

## 三、Params 與 Body 的差異

### 短答（先給結論）

```
不是「只能」，而是「慣例與語意不同」
```

---

### 1️⃣ Params（Query Parameters）

#### 長相

```
GET /api/users?page=1&size=20
```

#### 本質

> 描述「我要什麼條件 / 篩選 / 查詢」

#### 特性

- 放在 URL
- 可被快取
- 可被書籤保存
- 長度有限

#### 慣例用途

- 查詢
- 篩選
- 分頁
- 排序

👉 **最常用在 GET**

---

### 2️⃣ Body（Request Body）

#### 長相

```json
{
  "name": "Alice",
  "email": "a@test.com"
}
```

#### 本質

> 描述「我要送什麼資料給你處理」

#### 特性

- 不在 URL
- 不可被快取
- 可送大量資料
- 語意是「動作」

#### 慣例用途

- 建立
- 更新
- 上傳

👉 **最常用在 POST / PUT / PATCH**

---

### 3️⃣ 重要澄清：技術上 vs 語意上

#### 技術上（HTTP 規格）

- GET 可以有 body（但不建議）
- POST 可以有 query
- HTTP 並沒有禁止

#### 為什麼大家「不這樣用」？

因為：

> **API 設計是靠「語意一致性」，不是靠技術極限**

---

## 四、正確的「語意對照表」（請記住）

| HTTP Method | Query Params | Body | 語意 |
|-------------|--------------|------|------|
| GET | ✅ 常用 | ❌ 避免 | 查詢資源 |
| POST | ⚠️ 可用 | ✅ 常用 | 建立 / 執行 |
| PUT | ⚠️ 可用 | ✅ 常用 | 整體更新 |
| PATCH | ⚠️ 可用 | ✅ 常用 | 部分更新 |
| DELETE | ⚠️ 可用 | ❌ / ⚠️ | 刪除 |

👉 **不是能不能，而是「該不該」**

---

## 五、把這一切接起來

### 為什麼 Token 常放 Header？

因為：
- 不屬於資源條件（不是 query）
- 不屬於業務資料（不是 body）
- 是**請求的上下文（context）**

```http
Authorization: Bearer <token>
```

---

## 六、實務範例

### 完整的 URL 結構

```
https://api.example.com/api/users?page=1&size=20
│      │              │   │      │
│      │              │   │      └─ Query Parameters (篩選條件)
│      │              │   └─ Resource Path (資源)
│      │              └─ API Prefix (API 前綴)
│      └─ Domain (伺服器位置)
└─ Protocol (通訊協定)

完整 URL = protocol + domain + path + query
Base URL = protocol + domain
```

### 各種請求方式範例

#### 1. GET 請求（查詢資源）

```javascript
// Query params 放在 URL
GET https://api.example.com/api/users?page=1&size=20&status=active

// 使用場景：
// - 查詢列表
// - 篩選資料
// - 分頁
```

#### 2. POST 請求（建立資源）

```javascript
// Body 放資料
POST https://api.example.com/api/users
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@example.com",
  "role": "admin"
}

// 使用場景：
// - 建立新使用者
// - 提交表單
// - 上傳資料
```

#### 3. PUT 請求（更新資源）

```javascript
// ID 放在 path，資料放在 body
PUT https://api.example.com/api/users/123
Content-Type: application/json

{
  "name": "Alice Updated",
  "email": "alice.new@example.com",
  "role": "user"
}

// 使用場景：
// - 完整更新使用者資料
```

#### 4. PATCH 請求（部分更新）

```javascript
// 只更新部分欄位
PATCH https://api.example.com/api/users/123
Content-Type: application/json

{
  "email": "alice.new@example.com"
}

// 使用場景：
// - 只更新某些欄位
```

#### 5. DELETE 請求（刪除資源）

```javascript
// ID 放在 path
DELETE https://api.example.com/api/users/123

// 使用場景：
// - 刪除資源
```

---

### 混合使用的合理場景

#### POST 帶 Query（合理）

```javascript
// 建立資源，但需要額外參數控制行為
POST https://api.example.com/api/users?notify=true
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@example.com"
}

// notify 是「操作選項」，不是資源資料
// ✅ 這樣設計是合理的
```

#### GET 帶 Body（不建議）

```javascript
// ❌ 技術上可行，但語意不清
GET https://api.example.com/api/users
Content-Type: application/json

{
  "filters": {
    "age": { "min": 18, "max": 65 }
  }
}

// ✅ 應該改用 Query 或 POST
GET https://api.example.com/api/users?ageMin=18&ageMax=65

// 或者如果篩選條件太複雜，改用 POST
POST https://api.example.com/api/users/search
```

---

## 七、在程式碼中的應用

### 使用 Base URL 的好處

```javascript
// config.ts
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  timeout: 10000,
}

// httpClient.ts
import axios from 'axios'
import { API_CONFIG } from './config'

const httpClient = axios.create({
  baseURL: API_CONFIG.baseURL,  // 統一管理
  timeout: API_CONFIG.timeout,
})

// 使用時
httpClient.get('/api/users')  // 自動拼接成 https://api.example.com/api/users
httpClient.post('/api/users', data)  // 自動拼接
```

### Query Params 的組合

```javascript
// 手動拼接（不推薦）
const url = `/api/users?page=${page}&size=${size}`

// 使用 URLSearchParams（推薦）
const params = new URLSearchParams({
  page: '1',
  size: '20',
  status: 'active'
})
fetch(`/api/users?${params}`)

// 使用 Axios（最推薦）
axios.get('/api/users', {
  params: {
    page: 1,
    size: 20,
    status: 'active'
  }
})
// 自動轉成：/api/users?page=1&size=20&status=active
```

### Body 的發送

```javascript
// JSON Body
axios.post('/api/users', {
  name: 'Alice',
  email: 'alice@example.com'
}, {
  headers: {
    'Content-Type': 'application/json'
  }
})

// FormData Body（檔案上傳）
const formData = new FormData()
formData.append('file', file)
formData.append('name', 'Alice')

axios.post('/api/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})
```

---

## 八、設計 API 的判斷流程

當你要設計一個 API 時，問自己：

### 1. 這是什麼操作？

- 查詢 → GET
- 建立 → POST
- 更新 → PUT / PATCH
- 刪除 → DELETE

### 2. 資料的性質是什麼？

```
是篩選條件？ → Query Params
是資源資料？ → Body
是資源 ID？  → Path
是請求上下文？→ Header
```

### 3. 實際範例

#### 需求：取得某個使用者的訂單列表，支援分頁

```javascript
// ✅ 好的設計
GET /api/users/123/orders?page=1&size=20
    │         │   │       │
    │         │   │       └─ Query（篩選條件）
    │         │   └─ Path（資源）
    │         └─ Path（使用者 ID）
    └─ Path（資源類型）
```

#### 需求：建立新訂單，並發送通知

```javascript
// ✅ 好的設計
POST /api/orders?notify=true
Content-Type: application/json

{
  "userId": 123,
  "items": [
    { "productId": 1, "quantity": 2 }
  ]
}

// notify 是操作選項 → Query
// 訂單資料是資源本體 → Body
```

---

## 九、總結

### 三個核心概念

| 概念 | 定義 | 範例 |
|------|------|------|
| **Domain** | 去哪台伺服器 | `api.example.com` |
| **Path** | 找哪個資源 | `/api/users/123` |
| **Base URL** | 程式組合前綴 | `https://api.example.com` |

### 資料放置原則

| 資料性質 | 放置位置 | HTTP Method |
|----------|----------|-------------|
| 篩選條件、分頁、排序 | Query Params | 主要用於 GET |
| 資源資料、建立、更新 | Body | 主要用於 POST/PUT/PATCH |
| 資源識別 | Path | 所有 Method |
| 認證、上下文 | Header | 所有 Method |

### 最後三句話

> **domain 決定「去哪台伺服器」**
> **path 決定「找哪個資源」**
> **query / body 決定「你想怎麼用這個資源」**

當你看到一個 API，能自然判斷：
- 為什麼這個資料在 query
- 為什麼那個資料在 body

那你已經是「會設計 API 的人」，不是只會用 API 的人了。
