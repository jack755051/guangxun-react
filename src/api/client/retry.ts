import { ApiError } from "./error";
import type { HttpResult } from "./http";

export type RetryOptions = {
  retry?: number;
  retryDelay?: number | ((attemptNumber: number) => number);
  retryCondition?: (error: ApiError) => boolean;
  // 是否自動處理 429 Rate Limit
  handleRateLimit?: boolean; // 預設 false
};

/**
 * 預設的重試條件：只重試 5xx 伺服器錯誤
 */
function defaultRetryCondition(error: ApiError): boolean {
  if (error.status >= 500 && error.status < 600) return true;

  // 408 請求超時
  if (error.status === 408) return true;

  return false;
}

/**
 * 計算重試延遲時間
 */
function getRetryDelay(
  retryDelay: number | ((attemptNumber: number) => number),
  attemptNumber: number
): number {
  if (typeof retryDelay === "function") {
    return retryDelay(attemptNumber);
  }
  return retryDelay;
}

/**
 * 從 429 錯誤中讀取 Retry-After 時間（秒）
 *
 * Retry-After header 的兩種格式：
 * 1. 延遲秒數：Retry-After: 120
 * 2. HTTP 日期：Retry-After: Wed, 21 Oct 2025 07:28:00 GMT
 *
 * @param error - ApiError 錯誤物件
 * @returns Retry-After 秒數，如果沒有則返回 null
 */
function getRetryAfterSeconds(error: ApiError): number | null {
  // 1. 優先從 headers 中讀取（標準做法，符合 HTTP 規範）
  if (error.headers) {
    const retryAfter = error.headers.get("Retry-After");

    if (retryAfter) {
      // 檢查是否為數字（延遲秒數）
      const seconds = Number(retryAfter);
      if (!isNaN(seconds) && seconds > 0) {
        return seconds;
      }

      // 檢查是否為 HTTP 日期格式
      try {
        const retryDate = new Date(retryAfter);
        const now = new Date();
        const diffMs = retryDate.getTime() - now.getTime();
        const diffSeconds = Math.ceil(diffMs / 1000);

        if (diffSeconds > 0) {
          return diffSeconds;
        }
      } catch (e) {
        // 日期解析失敗，繼續嘗試其他方式
      }
    }
  }

  // 2. 從 error.data 中讀取（備用方案，某些後端會把資訊放在 body）
  if (error.data && typeof error.data === "object") {
    const data = error.data as any;

    // 常見的欄位名稱
    if (data.retryAfter) {
      const seconds = Number(data.retryAfter);
      if (!isNaN(seconds) && seconds > 0) return seconds;
    }

    if (data.retry_after) {
      const seconds = Number(data.retry_after);
      if (!isNaN(seconds) && seconds > 0) return seconds;
    }

    // 其他可能的欄位名稱
    if (data.retryAfterSeconds) {
      const seconds = Number(data.retryAfterSeconds);
      if (!isNaN(seconds) && seconds > 0) return seconds;
    }
  }

  return null;
}

/**
 * 延遲執行
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function executeWithRetry<T>(
  requestFn: () => Promise<HttpResult<T>>,
  options: RetryOptions = {}
): Promise<HttpResult<T>> {
  const {
    retry = 0,
    retryDelay = 1000,
    retryCondition = defaultRetryCondition,
    handleRateLimit = false, // 預設不處理 429
  } = options;

  let lastError: ApiError | null = null;
  let attemptNumber = 0;
  // 第一次請求 + 重試次數
  const maxAttempts = retry + 1;

  for (let i = 0; i < maxAttempts; i++) {
    attemptNumber = i;

    try {
      // 嘗試執行請求
      const result = await requestFn();

      // 成功：返回結果
      if (i > 0) {
        console.log(`[Retry] 第 ${i} 次重試成功`);
      }
      return result;
    } catch (error: unknown) {
      // 錯誤處理
      if (!(error instanceof ApiError)) {
        // 不是 ApiError，直接拋出
        throw error;
      }

      lastError = error;

      // ========================================
      // 特別處理 429 Rate Limit
      // ========================================

      if (error.status === 429 && handleRateLimit) {
        // 檢查是否還有重試次數
        if (i >= maxAttempts - 1) {
          console.error("[Retry] Rate limit 超過，且已無重試次數");
          throw error;
        }

        // 嘗試讀取 Retry-After
        const retryAfterSeconds = getRetryAfterSeconds(error);

        if (retryAfterSeconds !== null) {
          const delayMs = retryAfterSeconds * 1000;
          console.warn(
            `[Retry] Rate limit 超過 (429), ` +
              `根據 Retry-After 將在 ${retryAfterSeconds} 秒後重試`
          );
          await delay(delayMs);
          continue; // 重試
        } else {
          // 沒有 Retry-After，使用預設延遲
          console.warn(
            `[Retry] Rate limit 超過 (429), ` + `沒有 Retry-After，使用預設延遲 ${retryDelay}ms`
          );
          const delayMs = getRetryDelay(retryDelay, attemptNumber);
          await delay(delayMs);
          continue; // 重試
        }
      }

      // ========================================
      // 一般錯誤處理
      // ========================================
      const shouldRetry = i < maxAttempts - 1 && retryCondition(error);

      if (!shouldRetry) {
        // 不應該重試，直接拋出錯誤
        if (i > 0) {
          console.error(`[Retry] 重試 ${i} 次後仍然失敗`);
        }
        throw error;
      }

      // 計算延遲時間
      const delayMs = getRetryDelay(retryDelay, attemptNumber);

      console.warn(
        `[Retry] 第 ${i + 1} 次請求失敗 (${error.status} ${error.message}), ` +
          `將在 ${delayMs}ms 後重試 (剩餘 ${maxAttempts - i - 1} 次)`
      );

      // 延遲後重試
      await delay(delayMs);
    }
  }

  // 理論上不會到這裡，但為了型別安全
  throw lastError || new ApiError(500, "Unknown Error");
}
