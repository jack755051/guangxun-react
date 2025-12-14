import type { HttpOptions, HttpResult } from "./http";

type RequestInterceptor = (config: HttpOptions) => HttpOptions | Promise<HttpOptions>;
type ResponseInterceptor = (
  result: HttpResult<unknown>
) => HttpResult<unknown> | Promise<HttpResult<unknown>>;

// 儲存攔截器的陣列
const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];

// 註冊攔截器的函數
export function addRequestInterceptor(fn: RequestInterceptor) {
  requestInterceptors.push(fn);
}

export function addResponseInterceptor(fn: ResponseInterceptor) {
  responseInterceptors.push(fn);
}

/**
 * 新增執行攔截器的函數
 * @param config
 * @returns
 */
export async function runRequestInterceptors(config: HttpOptions): Promise<HttpOptions> {
  let finalConfig = config;
  for (const interceptor of requestInterceptors) {
    finalConfig = await interceptor(finalConfig);
  }
  return finalConfig;
}

export async function runResponseInterceptors(
  result: HttpResult<unknown>
): Promise<HttpResult<unknown>> {
  let finalResult = result;
  for (const interceptor of responseInterceptors) {
    finalResult = await interceptor(finalResult);
  }
  return finalResult;
}

/**
 * 移除攔截器
 * @param fn
 */
export function removeRequestInterceptor(fn: RequestInterceptor) {
  const index = requestInterceptors.indexOf(fn);
  if (index > -1) requestInterceptors.splice(index, 1);
}

export function removeResponseInterceptor(fn: ResponseInterceptor) {
  const index = responseInterceptors.indexOf(fn);
  if (index > -1) responseInterceptors.splice(index, 1);
}

/**
 * 清空所有攔截器
 */
export function clearInterceptors() {
  requestInterceptors.length = 0;
  responseInterceptors.length = 0;
}
