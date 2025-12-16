import { ApiError } from "./client/error";
import { httpRequest } from "./client/http";

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
};

export type NormalFetchOptions = Omit<Parameters<typeof httpRequest>[0], "path"> & {
  url: string; // path
};

// ============================================
// Type Guard: 檢查是否為錯誤回應
// ============================================
type ErrorResponse = {
  success: false;
  error?: string;
  message?: string;
  [key: string]: unknown;
};

function isErrorResponse(data: unknown): data is ErrorResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "success" in data &&
    (data as { success: unknown }).success === false
  );
}

// ============================================
// 函數重載定義（Overload Signatures）
// ============================================

// 重載 1: responseType 為 'blob' 時返回 Blob
export function normalFetch<T = unknown>(
  options: NormalFetchOptions & { responseType: "blob" }
): Promise<ApiResponse<Blob>>;

// 重載 2: responseType 為 'arrayBuffer' 時返回 ArrayBuffer
export function normalFetch<T = unknown>(
  options: NormalFetchOptions & { responseType: "arrayBuffer" }
): Promise<ApiResponse<ArrayBuffer>>;

// 重載 3: responseType 為 'text' 時返回 string
export function normalFetch<T = unknown>(
  options: NormalFetchOptions & { responseType: "text" }
): Promise<ApiResponse<string>>;

// 重載 4: responseType 為 'formData' 時返回 FormData
export function normalFetch<T = unknown>(
  options: NormalFetchOptions & { responseType: "formData" }
): Promise<ApiResponse<FormData>>;

// 重載 5: 沒有指定 responseType 或為 'json' 時返回 T
export function normalFetch<T = unknown>(
  options: NormalFetchOptions & { responseType?: "json" | undefined }
): Promise<ApiResponse<T>>;

// 重載 6: 通用情況（fallback）
export function normalFetch<T = unknown>(options: NormalFetchOptions): Promise<ApiResponse<T>>;

// ============================================
// 實際實作（Implementation）
// ============================================
export async function normalFetch<T = unknown>(
  options: NormalFetchOptions
): Promise<ApiResponse<T | Blob | ArrayBuffer | string | FormData>> {
  const { url, responseType = "json", ...rest } = options;

  const { data, status } = await httpRequest<unknown>({
    ...rest,
    path: url,
    responseType,
  });

  // 二進制資料直接返回
  const isBinary = responseType === "blob" || responseType === "arrayBuffer";
  if (isBinary) {
    return {
      success: true,
      data: data as Blob | ArrayBuffer,
    } as ApiResponse<T | Blob | ArrayBuffer>;
  }

  // 錯誤回應檢查（使用 Type Guard）
  if (isErrorResponse(data)) {
    const errorMessage = data.error || data.message || "Business Error";
    throw new ApiError(status, errorMessage, data);
  }

  return data as ApiResponse<T>;
}
