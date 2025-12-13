import { ApiError } from "@/api/client/error";

/**
 * 將各種類型的 body 轉換為 fetch API 可接受的 BodyInit 格式
 * @param body 要轉換的請求體資料
 * @param contentType 內容類型標頭
 * @returns 轉換後的 BodyInit 或 undefined
 */
export function toBodyHelper(body: unknown, contentType?: string): BodyInit | undefined {
  // 空值處理：如果 body 為 undefined 或 null，直接返回 undefined
  if (body === undefined || body === null) return undefined;

  // 表單資料處理：FormData 已經是標準的 BodyInit 類型，直接返回
  if (typeof FormData !== "undefined" && body instanceof FormData) return body;

  // 二進制大物件處理：Blob 類型（包含 File）可直接作為請求體
  if (typeof Blob !== "undefined" && body instanceof Blob) return body;

  // URL 編碼表單處理：URLSearchParams 用於 application/x-www-form-urlencoded
  if (body instanceof URLSearchParams) return body;

  // 字串處理：直接傳送文字內容
  if (typeof body === "string") return body;

  // 原始二進制資料處理：ArrayBuffer 是最基本的二進制資料容器
  if (body instanceof ArrayBuffer) return body;

  // 類型化陣列檢視處理：Uint8Array、Int32Array 等都是 ArrayBufferView
  if (ArrayBuffer.isView(body)) {
    const view = body as ArrayBufferView;

    // 建立新的 ArrayBuffer 副本，避免 SharedArrayBuffer 的安全性問題
    // 這樣確保回傳的永遠是標準 ArrayBuffer 而非 SharedArrayBuffer
    const ab = new ArrayBuffer(view.byteLength);

    // 將原始檢視的資料複製到新的 ArrayBuffer 中
    const src = new Uint8Array(view.buffer as ArrayBufferLike, view.byteOffset, view.byteLength);
    const dst = new Uint8Array(ab);
    dst.set(src);

    return ab;
  }

  // JSON 物件處理：當 Content-Type 為 application/json 時，序列化物件
  if (typeof body === "object") {
    if (contentType?.includes("application/json")) return JSON.stringify(body);
  }

  // 不支援的類型：拋出錯誤
  throw new ApiError(400, "Invalid request body type");
}
