import type { HttpOptions, HttpResult } from "./http";

// 儲存進行中的請求
const pendingRequests = new Map<string, Promise<HttpResult<any>>>();

function generateCacheKey(options: HttpOptions): string {
  const { baseUrl, path, method = "GET", query, body } = options;

  // 將 query 和 body 序列化為字串
  const queryStr = query ? JSON.stringify(sortObject(query)) : "";
  const bodyStr =
    body instanceof FormData
      ? "FormData" // FormData 無法序列化，用固定字串
      : body
        ? JSON.stringify(body)
        : "";

  return `${method}:${baseUrl}${path}:${queryStr}:${bodyStr}`;
}

/**
 * 對物件的 key 排序，確保相同內容產生相同的 JSON 字串
 * { b: 2, a: 1 } 和 { a: 1, b: 2 } 應該產生相同的 key
 */
function sortObject(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.keys(obj)
    .sort()
    .reduce(
      (result, key) => {
        result[key] = obj[key];
        return result;
      },
      {} as Record<string, unknown>
    );
}

/**
 * 請求去重：如果有進行中的相同請求，直接返回該 Promise
 * @param options HTTP 請求選項
 * @param requestFn 實際的請求函數
 * @returns Promise<HttpResult<T>>
 */
export function dedupeRequest<T>(
  options: HttpOptions,
  requestFn: () => Promise<HttpResult<T>>
): Promise<HttpResult<T>> {
  const key = generateCacheKey(options);

  // 如果有進行中的相同請求，直接返回
  if (pendingRequests.has(key)) {
    console.log(`[RequestCache] 使用快取的請求: ${key}`);
    return pendingRequests.get(key)!;
  }

  console.log(`[RequestCache] 發送新請求: ${key}`);

  // 發送新請求
  const promise = requestFn().finally(() => {
    // 請求完成後移除快取
    pendingRequests.delete(key);
  });

  // 存入快取
  pendingRequests.set(key, promise);

  return promise;
}

// ========================================
// 除錯工具 API
// ========================================

/**
 * 取得目前進行中的請求數量
 * @returns 進行中的請求數量
 *
 * @example
 * console.log('進行中的請求:', getPendingRequestCount()); // 3
 */
export function getPendingRequestCount(): number {
  return pendingRequests.size;
}

/**
 * 取得所有進行中的請求 key
 * @returns 請求 key 陣列
 *
 * @example
 * const keys = getPendingKeys();
 * console.log(keys);
 * // ["GET:https://api.example.com/users::", "POST:https://api.example.com/orders::"]
 */
export function getPendingKeys(): string[] {
  return Array.from(pendingRequests.keys());
}

/**
 * 取得詳細的快取資訊
 * @returns 快取詳細資訊物件
 *
 * @example
 * const info = getRequestCacheInfo();
 * console.log(info);
 * // {
 * //   count: 2,
 * //   keys: ["GET:.../users::", "POST:.../orders::"],
 * //   details: [
 * //     { key: "GET:.../users::", pending: true },
 * //     { key: "POST:.../orders::", pending: true }
 * //   ]
 * // }
 */
export function getRequestCacheInfo(): {
  count: number;
  keys: string[];
  details: Array<{ key: string; pending: true }>;
} {
  const keys = getPendingKeys();
  const details = keys.map((key) => ({
    key,
    pending: true as const,
  }));

  return {
    count: pendingRequests.size,
    keys,
    details,
  };
}

/**
 * 清空所有進行中的請求快取
 * ⚠️ 注意：這不會取消請求，只是移除快取記錄
 *
 * @example
 * clearRequestCache();
 * console.log(getPendingRequestCount()); // 0
 */
export function clearRequestCache(): void {
  console.warn("[RequestCache] 清空所有快取");
  pendingRequests.clear();
}

/**
 * 檢查特定請求是否在快取中
 * @param options 請求選項
 * @returns 是否在快取中
 *
 * @example
 * const isCached = isRequestCached({
 *   baseUrl: 'https://api.example.com',
 *   path: '/users'
 * });
 * console.log(isCached); // true 或 false
 */
export function isRequestCached(options: HttpOptions): boolean {
  const key = generateCacheKey(options);
  return pendingRequests.has(key);
}

// ========================================
// 開發模式：自動監控
// ========================================
if (import.meta.env.DEV) {
  // 每 10 秒記錄一次快取狀態（只在有請求時）
  setInterval(() => {
    const count = getPendingRequestCount();
    if (count > 0) {
      console.log(`[RequestCache] 目前有 ${count} 個進行中的請求`);
      const info = getRequestCacheInfo();
      console.table(info.details);
    }
  }, 10000);

  // 暴露除錯 API 到全域（開發模式）
  (window as any).__httpDebug = {
    getPendingCount: getPendingRequestCount,
    getPendingKeys: getPendingKeys,
    getCacheInfo: getRequestCacheInfo,
    clearCache: clearRequestCache,
    isRequestCached: isRequestCached,
  };

  console.log("%c🔧 HTTP 除錯工具已載入", "color: #00ff00; font-weight: bold; font-size: 14px;");
  console.log("使用方式:");
  console.log("  __httpDebug.getPendingCount() - 查看進行中請求數");
  console.log("  __httpDebug.getPendingKeys() - 查看請求 keys");
  console.log("  __httpDebug.getCacheInfo() - 查看詳細資訊");
  console.log("  __httpDebug.clearCache() - 清空快取");
  console.log("  __httpDebug.isRequestCached(options) - 檢查請求是否快取");
}
