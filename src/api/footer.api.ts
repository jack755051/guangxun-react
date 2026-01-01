import type { FooterCmsDTO } from "@/model/dto/cms.dto";
import { APIURL } from "./url";

// 開發環境使用 mock，生產環境使用真實 API
const USE_MOCK = import.meta.env.DEV; // Vite 環境變量

/**
 * 獲取 Footer 配置
 * 開發環境：使用 mock 數據
 * 生產環境：調用真實 API
 */
export const fetchFooterConfig = async (): Promise<FooterCmsDTO> => {
  if (USE_MOCK) {
    // 開發環境使用 mock
    const { mockFetchFooter } = await import("@/mock/footer");
    return mockFetchFooter();
  }

  // 生產環境調用真實 API
  const response = await fetch(APIURL.FOOTER);

  if (!response.ok) {
    throw new Error(`Failed to fetch footer config: ${response.statusText}`);
  }

  return response.json();
};
