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
