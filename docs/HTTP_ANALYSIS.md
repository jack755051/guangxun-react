# HTTP 客戶端分析報告

## http.ts 評估

### 已實現功能（完整度：85%）

1. 基本 HTTP 方法（GET, POST, PUT, DELETE）
2. 多種回應類型（json, text, blob, arrayBuffer, formData）
3. Timeout 機制（AbortController）
4. Authorization Token（Bearer）
5. CSRF 保護（自動讀取 cookie）
6. FormData 處理
7. Query 參數處理
8. 攔截器整合
9. 錯誤處理（ApiError）

### 潛在問題

#### 1. window.setTimeout（http.ts:66）

**問題：** 不支援 SSR（伺服器端渲染）

```typescript
const timer = window.setTimeout(() => controller.abort(), timeoutMs);
```

**建議：**
```typescript
const timer = setTimeout(() => controller.abort(), timeoutMs);
```

#### 2. 錯誤回應解析（http.ts:115-117）

**問題：** 即使回應失敗，也嘗試解析 body，但如果解析失敗可能丟失錯誤資訊

**現況：**
```typescript
if (!res.ok) {
  throw new ApiError(status, res.statusText, parsed);
}
```

**潛在問題：** `parsed` 在 line 113 可能為 `null`（如果 JSON 解析失敗）

**建議：** 已經有 `.catch(() => null)` 處理，目前實作可接受

#### 3. 缺少 Retry 機制

**場景：** 網路不穩定時自動重試

**建議：** 可選功能，不是必須

```typescript
export type HttpOptions = {
  // ... 現有選項
  retry?: number;           // 重試次數
  retryDelay?: number;      // 重試延遲（ms）
  retryCondition?: (error: any) => boolean; // 重試條件
};
```

#### 4. 缺少請求取消的公開 API

**場景：** 使用者離開頁面時取消進行中的請求

**現況：** AbortController 只在 timeout 時使用

**建議：** 可選功能

```typescript
export type HttpOptions = {
  signal?: AbortSignal;  // 允許外部傳入 AbortSignal
};
```

#### 5. HEAD 和 OPTIONS 方法的 body 處理（http.ts:100-102）

**問題：** HEAD 和 OPTIONS 不應該有 body

**現況：**
```typescript
if (upper !== "GET" && body !== undefined) {
  fetchInit.body = toBodyHelper(body, mergedHeaders["Content-Type"]);
}
```

**建議：**
```typescript
const methodsWithoutBody = ["GET", "HEAD", "OPTIONS"];
if (!methodsWithoutBody.includes(upper) && body !== undefined) {
  fetchInit.body = toBodyHelper(body, mergedHeaders["Content-Type"]);
}
```

#### 6. Response Headers 遺失

**問題：** 無法存取回應的 headers（某些 API 會在 header 中返回重要資訊）

**現況：**
```typescript
export type HttpResult<T> = { status: number; data: T };
```

**建議：**
```typescript
export type HttpResult<T> = {
  status: number;
  data: T;
  headers?: Headers;  // 可選，避免破壞現有程式碼
};
```

---

## normalFetch.ts 評估

### 已實現功能（完整度：90%）

1. 統一的 ApiResponse 格式
2. 業務邏輯錯誤處理（success: false）
3. 二進制資料處理（blob, arrayBuffer）

### 潛在問題

#### 1. ApiResponse 格式假設（normalFetch.ts:23-32）

**問題：** 假設所有 API 都返回 `{ success, data, error }` 格式

**現況：**
```typescript
if (data && typeof data === "object" && "success" in data && data.success === false) {
  throw new ApiError(status, "Business Error", data);
}
return data as ApiResponse<T>;
```

**問題：**
1. 不是所有後端都用這個格式
2. 如果後端返回 `{ code: 0, message: "", data: {} }` 就不適用

**建議：** 這是專案特定的封裝，需要與後端協議一致

#### 2. 缺少更詳細的錯誤資訊

**建議：**
```typescript
if (data && typeof data === "object" && "success" in data && data.success === false) {
  const errorMessage = (data as any).error || (data as any).message || "Business Error";
  throw new ApiError(status, errorMessage, data);
}
```

---

## 缺失功能總結

### 必須補充

無。目前實作已經涵蓋基本需求。

### 建議補充

1. 移除 `window.setTimeout`（支援 SSR）
2. HEAD/OPTIONS 方法不應該有 body
3. 回應中加入 headers（可選）

### 可選功能（進階）

1. Retry 機制
2. 請求取消的公開 API（外部 AbortSignal）
3. 請求去重
4. 快取機制
5. 上傳/下載進度監控
6. Mock 數據支援（開發環境）

---

## 評分

| 項目 | 分數 | 說明 |
|------|------|------|
| http.ts 功能完整度 | 85/100 | 基本功能完整，缺少進階功能 |
| http.ts 程式碼品質 | 90/100 | 結構清晰，有小問題 |
| normalFetch.ts 功能完整度 | 90/100 | 符合特定後端格式 |
| normalFetch.ts 程式碼品質 | 85/100 | 需要確認後端格式一致性 |
| 整體評價 | 87.5/100 | **生產環境可用** |

---

## 建議修改

### 高優先級

```typescript
// http.ts:66 - 移除 window
- const timer = window.setTimeout(() => controller.abort(), timeoutMs);
+ const timer = setTimeout(() => controller.abort(), timeoutMs);

// http.ts:131 - 移除 window
- window.clearTimeout(timer);
+ clearTimeout(timer);

// http.ts:100-102 - 處理 HEAD/OPTIONS
- if (upper !== "GET" && body !== undefined) {
+ const methodsWithoutBody = ["GET", "HEAD", "OPTIONS"];
+ if (!methodsWithoutBody.includes(upper) && body !== undefined) {
```

### 中優先級

```typescript
// http.ts:8 - 加入 headers
export type HttpResult<T> = {
  status: number;
  data: T;
  headers?: Headers;
};

// http.ts:119 - 回傳 headers
let result: HttpResult<T> = {
  status,
  data: parsed as T,
  headers: res.headers,
};
```

### 低優先級（可選）

保持現狀，等實際需要時再加入：
- Retry 機制
- 請求快取
- 上傳進度
