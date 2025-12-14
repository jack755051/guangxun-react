# API 攔截器指南

## 什麼是攔截器

攔截器在 HTTP 請求發送前或回應返回後執行，統一處理與後端的通訊邏輯。
目的：減少重複代碼、降低耦合、集中管理認證和錯誤處理。

## 快速開始

```typescript
import { httpRequest } from "@/api/client/http";

// token 會自動附加
const response = await httpRequest({
  baseUrl: "https://api.example.com",
  path: "/users",
});
```

## 目前啟用的攔截器

請求攔截器：自動附加 Token
回應攔截器：401 跳轉登入、403 權限提示、5xx 錯誤提示

## 自定義攔截器

在 `src/api/setupInterceptors.ts` 添加：

```typescript
import { addRequestInterceptor, addResponseInterceptor } from "./client/interceptor";

// 請求攔截器
addRequestInterceptor((config) => ({
  ...config,
  headers: { ...config.headers, "X-Custom": "value" },
}));

// 回應攔截器
addResponseInterceptor((result) => {
  if (result.status === 404) console.log("Not Found");
  return result;
});
```

## Token 設定

在 `src/api/config.ts` 設定：

```typescript
export const TOKEN_STORAGE_KEY = "access_token";
```

確定方式：查看後端登入 API 回應格式，常見命名：`token`, `access_token`, `jwt`

```json
{ "token": "..." }        -> "token"
{ "access_token": "..." } -> "access_token"
```

## 什麼需要與後端溝通

需要溝通：添加 Header 且後端會使用、修改請求 Body、CSRF Token
不需要溝通：前端日誌、效能監控、UI 處理

## 常見範例

```typescript
// 多語系
addRequestInterceptor((config) => ({
  ...config,
  headers: { ...config.headers, "Accept-Language": "zh-TW" },
}));

// 多租戶
addRequestInterceptor((config) => ({
  ...config,
  headers: { ...config.headers, "X-Tenant-ID": getTenantId() },
}));

// 錯誤通知
addResponseInterceptor((result) => {
  if (result.status >= 400) showNotification(result.data.message);
  return result;
});
```

## 管理攔截器

```typescript
import { removeRequestInterceptor, clearInterceptors } from "./client/interceptor";

// 移除特定攔截器
const interceptor = (config) => config;
addRequestInterceptor(interceptor);
removeRequestInterceptor(interceptor);

// 清空所有（測試用）
clearInterceptors();
```
