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
 * Token 存儲的 key 名稱
 * 💡 根據後端協議修改這個值
 */
export const TOKEN_STORAGE_KEY = "access_token";

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
