/**
 * API 攔截器設定
 *
 * 🎯 攔截器的核心目的：統一處理與後端的 HTTP 通訊
 *
 * 主要用途：
 * 1. 統一添加認證資訊（Token）
 * 2. 統一處理後端回應（401跳轉、錯誤提示）
 * 3. 減少重複代碼、降低耦合
 *
 * 注意：
 * - 日誌、效能監控等「純前端邏輯」可以考慮用其他方式實作
 * - 攔截器應該專注於「與後端溝通」的邏輯
 */
import { addRequestInterceptor, addResponseInterceptor } from "./client/interceptor";
import { TOKEN_STORAGE_KEY, ROUTES } from "./config";

/**
 * 初始化所有攔截器
 */
export function setupInterceptors() {
  // ════════════════════════════════════════════════════════════════
  // 📤 請求攔截器：統一處理發送給後端的請求
  // ════════════════════════════════════════════════════════════════

  // 1️⃣ 自動附加 Token
  // 目的：避免每個 API 都要手動傳 token
  // 需與後端確認：Authorization header 的格式
  addRequestInterceptor((config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token && !config.accessToken) {
      config.accessToken = token;
    }
    return config;
  });

  // 💡 如果需要添加其他統一的 header（例如多租戶、語系），在這裡加
  // addRequestInterceptor((config) => {
  //   return {
  //     ...config,
  //     headers: {
  //       ...config.headers,
  //       "X-Tenant-ID": getTenantId(),
  //       "Accept-Language": getCurrentLocale(),
  //     },
  //   };
  // });

  // ════════════════════════════════════════════════════════════════
  // 📥 回應攔截器：統一處理後端回應
  // ════════════════════════════════════════════════════════════════

  // 2️⃣ 401 Unauthorized - 自動跳轉登入
  // 目的：統一處理 token 過期，避免每個 API 都要寫
  addResponseInterceptor((result) => {
    if (result.status === 401) {
      console.warn("[Auth] Token 過期，跳轉登入頁");
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      // 根據你的路由設定調整
      // window.location.href = ROUTES.LOGIN;
    }
    return result;
  });

  // 3️⃣ 403 Forbidden - 權限不足提示
  // 目的：統一處理權限問題
  addResponseInterceptor((result) => {
    if (result.status === 403) {
      console.error("[Auth] 權限不足");
      // 可以觸發全域通知
      // toast.error("您沒有權限執行此操作");
    }
    return result;
  });

  // 4️⃣ 5xx Server Error - 統一錯誤處理
  // 目的：統一處理伺服器錯誤
  addResponseInterceptor((result) => {
    if (result.status >= 500) {
      console.error("[Server] 伺服器錯誤", result);
      // 可以觸發全域通知
      // toast.error("伺服器發生錯誤，請稍後再試");
    }
    return result;
  });

  console.log("[Interceptors] 已初始化 API 攔截器");
}

// ════════════════════════════════════════════════════════════════
// 💡 關於日誌和效能監控
// ════════════════════════════════════════════════════════════════
//
// 日誌記錄和效能監控可以考慮用其他方式實作：
//
// 1️⃣ 使用專門的 logger 工具
//    import logger from "@/utils/logger";
//    logger.logApiRequest(config);
//
// 2️⃣ 使用瀏覽器 DevTools 的 Network 面板
//    已經有完整的請求記錄和時間
//
// 3️⃣ 使用第三方服務（Sentry, LogRocket, etc.）
//    更專業的監控和錯誤追蹤
//
// 如果真的要在攔截器中加日誌，可以這樣做：
//
// if (import.meta.env.DEV) {
//   addRequestInterceptor((config) => {
//     console.log(`[API] ${config.method} ${config.path}`);
//     return config;
//   });
// }
//
// 但這不是攔截器的核心職責。
// ════════════════════════════════════════════════════════════════
