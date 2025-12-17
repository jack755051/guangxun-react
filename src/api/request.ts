/**
 * 便利的 HTTP 請求 API
 *
 * 提供簡化的 API 呼叫方式，自動使用環境變數設定的 baseURL 和 timeout
 */

import { httpRequest, type HttpOptions } from "./client/http";
import { API_CONFIG } from "./config";

/**
 * 簡化的請求選項：baseUrl 變成可選，會自動使用環境變數
 */
export type RequestOptions = Omit<HttpOptions, "baseUrl"> & {
  baseUrl?: string;
};

/**
 * 通用請求函數：自動使用環境變數的 baseURL 和 timeout
 *
 * @param options - 請求選項
 * @returns Promise<HttpResult<T>>
 *
 * @example
 * // 使用預設 baseURL
 * const result = await request({ path: '/users' });
 *
 * // 覆蓋 baseURL
 * const result = await request({
 *   baseUrl: 'https://other-api.com',
 *   path: '/users'
 * });
 */
export async function request<T>(options: RequestOptions) {
  return httpRequest<T>({
    baseUrl: API_CONFIG.baseURL, // 預設使用環境變數
    timeoutMs: API_CONFIG.timeout,
    ...options,
  });
}

/**
 * 便利 API 物件：提供常用 HTTP 方法的快捷方式
 *
 * @example
 * // GET 請求
 * const users = await api.get('/users');
 * const user = await api.get('/users/1', { query: { include: 'posts' } });
 *
 * // POST 請求
 * await api.post('/users', { name: 'John' });
 *
 * // PUT 請求
 * await api.put('/users/1', { name: 'Jane' });
 *
 * // DELETE 請求
 * await api.delete('/users/1');
 *
 * // PATCH 請求
 * await api.patch('/users/1', { email: 'john@example.com' });
 */
export const api = {
  /**
   * GET 請求
   *
   * @param path - API 路徑
   * @param options - 額外的請求選項
   * @returns Promise<HttpResult<T>>
   *
   * @example
   * const users = await api.get<User[]>('/users');
   * const user = await api.get<User>('/users/1', {
   *   query: { include: 'posts' },
   *   retry: 3
   * });
   */
  get: <T = unknown>(path: string, options?: Partial<RequestOptions>) =>
    request<T>({
      path,
      method: "GET",
      ...options,
    }),

  /**
   * POST 請求
   *
   * @param path - API 路徑
   * @param body - 請求體資料
   * @param options - 額外的請求選項
   * @returns Promise<HttpResult<T>>
   *
   * @example
   * await api.post('/users', { name: 'John', email: 'john@example.com' });
   * await api.post('/upload', formData, { enableDedup: false });
   */
  post: <T = unknown>(path: string, body?: unknown, options?: Partial<RequestOptions>) =>
    request<T>({
      path,
      method: "POST",
      body,
      ...options,
    }),

  /**
   * PUT 請求
   *
   * @param path - API 路徑
   * @param body - 請求體資料
   * @param options - 額外的請求選項
   * @returns Promise<HttpResult<T>>
   *
   * @example
   * await api.put('/users/1', { name: 'Jane' });
   */
  put: <T = unknown>(path: string, body?: unknown, options?: Partial<RequestOptions>) =>
    request<T>({
      path,
      method: "PUT",
      body,
      ...options,
    }),

  /**
   * DELETE 請求
   *
   * @param path - API 路徑
   * @param options - 額外的請求選項
   * @returns Promise<HttpResult<T>>
   *
   * @example
   * await api.delete('/users/1');
   * await api.delete('/posts/1', { retry: 2 });
   */
  delete: <T = unknown>(path: string, options?: Partial<RequestOptions>) =>
    request<T>({
      path,
      method: "DELETE",
      ...options,
    }),

  /**
   * PATCH 請求
   *
   * @param path - API 路徑
   * @param body - 請求體資料（通常是部分更新）
   * @param options - 額外的請求選項
   * @returns Promise<HttpResult<T>>
   *
   * @example
   * await api.patch('/users/1', { email: 'newemail@example.com' });
   */
  patch: <T = unknown>(path: string, body?: unknown, options?: Partial<RequestOptions>) =>
    request<T>({
      path,
      method: "PATCH",
      body,
      ...options,
    }),

  /**
   * HEAD 請求（只取得 headers，不取得 body）
   *
   * @param path - API 路徑
   * @param options - 額外的請求選項
   * @returns Promise<HttpResult<T>>
   *
   * @example
   * const result = await api.head('/large-file');
   * const fileSize = result.headers?.get('Content-Length');
   */
  head: <T = unknown>(path: string, options?: Partial<RequestOptions>) =>
    request<T>({
      path,
      method: "HEAD",
      ...options,
    }),
};
