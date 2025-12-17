/**
 * API 相關配置
 *
 * 原則：
 * ✅ 環境變數（.env）：存放會變動的值（API URL、timeout、token key）
 * ✅ config.ts：存放固定的結構化配置（路由、CSRF 設定、常數物件）
 *
 * 如果你覺得這個檔案沒必要，可以直接刪除，
 * 把 TOKEN_STORAGE_KEY 改回在 setupInterceptors.ts 中定義即可。
 */

/**
 * API 基礎 URL
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.example.com";

/**
 * Token 存儲的 key 名稱
 * 💡 根據後端協議修改這個值
 */
export const TOKEN_STORAGE_KEY = import.meta.env.VITE_TOKEN_STORAGE_KEY || "access_token";

/**
 * API 請求超時時間（毫秒）
 */
export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

/**
 * 路由路徑常數
 * 好處：集中管理，避免寫錯路徑，支援 auto-complete
 */
export const ROUTES = {
  LOGIN: "/login",
  HOME: "/",
  UNAUTHORIZED: "/401",
  FORBIDDEN: "/403",
} as const;

/**
 * CSRF Token 配置（物件結構，不適合放 .env）
 */
export const CSRF_CONFIG = {
  cookieName: "XSRF-TOKEN",
  headerName: "X-XSRF-TOKEN",
} as const;

/**
 * 完整的 API 配置物件
 */
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  tokenKey: TOKEN_STORAGE_KEY,
  csrf: CSRF_CONFIG,
} as const;
