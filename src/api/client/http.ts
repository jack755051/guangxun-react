import { getCookies } from "./cookies";
import { ApiError } from "./error";
import { toBodyHelper } from "./body";
import { runRequestInterceptors, runResponseInterceptors } from "./interceptor";

export type ResponseType = "json" | "text" | "blob" | "arrayBuffer" | "formData";

export type HttpResult<T> = { status: number; data: T };

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

export async function httpRequest<T = unknown>(options: HttpOptions): Promise<HttpResult<T>> {
  // 執行請求攔截器
  const interceptedOptions = await runRequestInterceptors(options);

  //options 解構與預設值
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
  } = interceptedOptions;

  const url = buildUrl(baseUrl, path, query);
  // 用AbortController來實現timeout
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  // mergedHeaders：合併 header 並追加 Authorization/CSRF
  const mergedHeaders: Record<string, string> = { ...headers };

  // Authorization
  if (accessToken) {
    mergedHeaders["Authorization"] = `Bearer ${accessToken}`;
  }

  // CSRF (non-GET)
  const upper = method.toUpperCase();
  if (upper !== "GET") {
    const xsrf = getCookies(csrfCookieName);
    if (xsrf) mergedHeaders[csrfHeaderName] = xsrf;
  }

  // FormData: do not set content-type
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (isFormData) {
    delete mergedHeaders["Content-Type"];
    delete mergedHeaders["content-type"];
  } else if (body && typeof body == "object" && !(body instanceof Blob)) {
    // 如果是一般 JSON
    if (!mergedHeaders["Content-Type"]) mergedHeaders["Content-Type"] = "application/json";
  }

  const fetchInit: RequestInit = {
    method: upper,
    headers: mergedHeaders,
    credentials,
    signal: controller.signal,
  };

  if (upper !== "GET" && body !== undefined) {
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
    else parsed = await res.json().catch(() => null);

    if (!res.ok) {
      throw new ApiError(status, res.statusText, parsed);
    }

    let result: HttpResult<T> = { status, data: parsed as T };

    // 執行回應攔截器
    result = (await runResponseInterceptors(result)) as HttpResult<T>;

    return result;
  } catch (e: unknown) {
    if (e instanceof DOMException && e.name === "AbortError")
      throw new ApiError(408, "Request Timeout");
    throw e;
  } finally {
    // 避免 timer 未被清除造成記憶體外洩
    window.clearTimeout(timer);
  }
}
