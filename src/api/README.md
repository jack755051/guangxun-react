# HTTP 客戶端使用指南

## 快速開始

### 方式 1: 使用便利 API（推薦）✨

```typescript
import { api } from "./request";

// GET 請求（自動使用環境變數的 baseURL）
const result = await api.get("/users");

// POST 請求
await api.post("/users", { name: "John", email: "john@example.com" });

// PUT 請求
await api.put("/users/1", { name: "Jane" });

// DELETE 請求
await api.delete("/users/1");
```

### 方式 2: 使用底層 API

```typescript
import { httpRequest } from "./client/http";

// 基本 GET 請求
const result = await httpRequest({
  baseUrl: "https://api.example.com",
  path: "/users",
});

// POST 請求
await httpRequest({
  baseUrl: "https://api.example.com",
  path: "/users",
  method: "POST",
  body: { name: "John", email: "john@example.com" },
});
```

## 核心功能

### 1. 基本請求

```typescript
// 使用便利 API
import { api } from "./request";

// GET with query
await api.get("/users", { query: { page: 1, limit: 10 } });

// POST with JSON
await api.post("/users", { name: "John" });

// 上傳檔案
const formData = new FormData();
formData.append("file", file);
await api.post("/upload", formData);

// 使用底層 API（需要完整控制時）
await httpRequest({
  baseUrl: "https://api.example.com",
  path: "/users",
  query: { page: 1, limit: 10 },
});
```

### 2. 自動重試

```typescript
import { api } from "./request";

// 網路不穩定時自動重試
await api.get("/data", {
  retry: 3, // 重試 3 次
  retryDelay: 1000, // 每次間隔 1 秒
});

// 指數退避
await api.get("/data", {
  retry: 5,
  retryDelay: (attempt) => Math.pow(2, attempt) * 1000, // 1s, 2s, 4s, 8s, 16s
});
```

### 3. 請求取消

```typescript
import { api } from "./request";

// 元件卸載時自動取消
const controller = new AbortController();

api.get("/users", { signal: controller.signal });

// 取消請求
controller.abort();
```

### 4. 處理 Rate Limit (429)

```typescript
import { api } from "./request";

// 自動讀取 Retry-After header 並等待適當時間
await api.get("/data", {
  retry: 3,
  handleRateLimit: true, // 智能處理 429 錯誤
});
```

## 環境變數設定

在 `.env` 中設定預設值：

```bash
VITE_API_BASE_URL=https://api.example.com
VITE_API_TIMEOUT=30000
VITE_TOKEN_STORAGE_KEY=access_token
```

使用：

```typescript
import { api } from "./request";

// api.* 方法會自動使用環境變數的 baseURL 和 timeout
await api.get("/users");

// 如果需要覆蓋預設值
await api.get("/users", {
  baseUrl: "https://other-api.com", // 覆蓋 baseURL
  timeoutMs: 60000, // 覆蓋 timeout
});
```

## 進階功能

### 請求去重

同時發送相同請求時，自動共享結果：

```typescript
// 同時發送 3 個相同請求，實際只會發送 1 個 HTTP 請求
const [r1, r2, r3] = await Promise.all([
  httpRequest({ baseUrl: "...", path: "/users" }),
  httpRequest({ baseUrl: "...", path: "/users" }),
  httpRequest({ baseUrl: "...", path: "/users" }),
]);

// 關閉去重
await httpRequest({
  baseUrl: "...",
  path: "/orders",
  method: "POST",
  enableDedup: false, // 每次都發送新請求
});
```

### 除錯工具（開發模式）

在瀏覽器 Console 中：

```javascript
// 查看進行中的請求數
__httpDebug.getPendingCount();

// 查看所有請求
__httpDebug.getCacheInfo();

// 清空快取
__httpDebug.clearCache();
```

## 錯誤處理

```typescript
import { ApiError } from './client/error';

try {
  await httpRequest({ ... });
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.status);   // HTTP 狀態碼
    console.log(error.message);  // 錯誤訊息
    console.log(error.data);     // 後端回應資料
    console.log(error.headers);  // Response Headers
  }
}
```

## 完整範例

```typescript
const result = await httpRequest({
  baseUrl: "https://api.example.com",
  path: "/users",
  method: "GET",
  query: { page: 1 },
  headers: { "X-Custom": "value" },
  responseType: "json",
  timeoutMs: 30000,
  credentials: "include",
  retry: 3,
  retryDelay: 1000,
  enableDedup: true,
  signal: controller.signal,
  handleRateLimit: true,
});
```

更多詳情請參考 [API_INTERCEPTOR.md](../docs/API_INTERCEPTOR.md)
