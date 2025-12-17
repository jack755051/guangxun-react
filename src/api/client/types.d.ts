interface AbortSignalConstructor {
  /**
   * 創建一個新的 AbortSignal，當任何給定的 signal 被 abort 時，該 signal 也會 abort
   * @param signals - 要合併的 AbortSignal 陣列
   * @returns 合併後的 AbortSignal
   */
  any(signals: AbortSignal[]): AbortSignal;
}

// 擴充全域 AbortSignal
declare global {
  interface AbortSignal {
    constructor: AbortSignalConstructor;
  }

  const AbortSignal: AbortSignalConstructor;
}

/**
 * HTTP 除錯工具介面
 */
interface HttpDebugTools {
  getPendingCount: () => number;
  getPendingKeys: () => string[];
  getCacheInfo: () => {
    count: number;
    keys: string[];
    details: Array<{ key: string; pending: true }>;
  };
  clearCache: () => void;
  isRequestCached: (options: import("../api/client/http").HttpOptions) => boolean;
}

/**
 * 擴充 Window 介面，加入除錯工具
 */
declare global {
  interface Window {
    __httpDebug?: HttpDebugTools;
  }
}

export {};
