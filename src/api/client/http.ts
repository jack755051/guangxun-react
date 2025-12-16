import { getCookies } from "./cookies";
import { ApiError } from "./error";
import { toBodyHelper } from "./body";
import { runRequestInterceptors, runResponseInterceptors } from "./interceptor";
import { dedupeRequest } from "./requestCache";

export type ResponseType = "json" | "text" | "blob" | "arrayBuffer" | "formData";

export type HttpResult<T> = {
  status: number;
  data: T;
  headers?: Headers;
};

export type HttpOptions = {
  baseUrl: string;
  path: string;
  method?: string;
  query?: Record<string, unknown>;
  headers?: Record<string, string>;
  body?: unknown;
  responseType?: ResponseType;
  timeoutMs?: number;
  credentials?: RequestCredentials; // "include"
  accessToken?: string;
  csrfCookieName?: string; // "XSRF-TOKEN"
  csrfHeaderName?: string; // "X-XSRF-TOKEN"
  enableDedup?: boolean; // 預設啟用請求去重
  signal?: AbortSignal; // 用於取消請求
};

/**
 * 建立完整的 URL 字串
 * @param baseURL
 * @param path
 * @param query
 * @returns
 */
function buildUrl(baseURL: string, path: string, query?: Record<string, unknown>): string {
  const url = new URL(path, baseURL);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

// ========================================
// 將原本的請求邏輯提取為獨立函數
// ========================================
async function executeRequest<T>(options: HttpOptions): Promise<HttpResult<T>> {
  // 執行請求攔截器
  const interceptedOptions = await runRequestInterceptors(options);

  const {
    baseUrl,
    path,
    method = "GET",
    query,
    headers = {},
    body,
    responseType = "json",
    timeoutMs = 30000,
    credentials = "include",
    accessToken,
    csrfCookieName = "XSRF-TOKEN",
    csrfHeaderName = "X-XSRF-TOKEN",
    signal: externalSignal,
  } = interceptedOptions;

  const url = buildUrl(baseUrl, path, query);

  // ========================================
  // 合併內部 timeout 和外部 signal
  // ========================================

  const internalController = new AbortController();
  const timer = setTimeout(() => internalController.abort(), timeoutMs);

  // 如果有外部 signal，需要合併兩個 signal
  let finalSignal: AbortSignal;

  if (externalSignal) {
    // 使用 AbortSignal.any() 合併多個 signal (需要新版瀏覽器支援)
    if ("any" in AbortSignal) {
      finalSignal = (AbortSignal as any).any([internalController.signal, externalSignal]);
    } else {
      // 舊瀏覽器的相容方案
      finalSignal = internalController.signal;

      // 當外部 signal 取消時，也取消內部 controller
      if (externalSignal.aborted) {
        internalController.abort();
      } else {
        externalSignal.addEventListener("abort", () => {
          internalController.abort();
        });
      }
    }
  } else {
    finalSignal = internalController.signal;
  }

  // ========================================
  // Headers 處理
  // ========================================
  const mergedHeaders: Record<string, string> = { ...headers };

  if (accessToken) {
    mergedHeaders["Authorization"] = `Bearer ${accessToken}`;
  }

  const upper = method.toUpperCase();
  if (upper !== "GET") {
    const xsrf = getCookies(csrfCookieName);
    if (xsrf) mergedHeaders[csrfHeaderName] = xsrf;
  }

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (isFormData) {
    delete mergedHeaders["Content-Type"];
    delete mergedHeaders["content-type"];
  } else if (body && typeof body == "object" && !(body instanceof Blob)) {
    if (!mergedHeaders["Content-Type"]) mergedHeaders["Content-Type"] = "application/json";
  }

  const fetchInit: RequestInit = {
    method: upper,
    headers: mergedHeaders,
    credentials,
    signal: finalSignal,
  };

  const methodsWithoutBody = ["GET", "HEAD", "OPTIONS"];
  if (!methodsWithoutBody.includes(upper) && body !== undefined) {
    fetchInit.body = toBodyHelper(body, mergedHeaders["Content-Type"]);
  }

  try {
    const res = await fetch(url, fetchInit);
    const status = res.status;

    let parsed: unknown;
    if (responseType === "blob") parsed = await res.blob();
    else if (responseType === "arrayBuffer") parsed = await res.arrayBuffer();
    else if (responseType === "text") parsed = await res.text();
    else if (responseType === "formData") parsed = await res.formData();
    else {
      try {
        parsed = await res.json();
      } catch (jsonError) {
        console.warn("[HTTP] Response is not valid JSON:", url);
        parsed = null;
      }
    }

    if (!res.ok) {
      throw new ApiError(status, res.statusText, parsed);
    }

    let result: HttpResult<T> = {
      status,
      data: parsed as T,
      headers: res.headers,
    };

    result = (await runResponseInterceptors(result)) as HttpResult<T>;

    return result;
  } catch (e: unknown) {
    // 區分 timeout 和外部取消
    if (externalSignal?.aborted) {
      // 外部取消
      throw new ApiError(499, "Request Cancelled by User");
    } else {
      // Timeout
      throw new ApiError(408, "Request Timeout");
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

// ========================================
// 主要入口：根據 enableDedup 決定是否去重
// ========================================
export async function httpRequest<T = unknown>(options: HttpOptions): Promise<HttpResult<T>> {
  const { enableDedup = true } = options;

  // 如果關閉去重，直接執行請求
  if (!enableDedup) {
    console.log("[HTTP] 去重已關閉，直接發送請求");
    return executeRequest(options);
  }

  // 啟用去重
  return dedupeRequest(options, () => executeRequest(options));
}
