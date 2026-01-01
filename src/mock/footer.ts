import type { FooterCmsDTO } from "@/model/dto/cms.dto";

/**
 * Mock Footer Data - Three variants for testing
 * Switch between them to test different layouts
 */

// Variant 1: Single Line (simplest)
export const mockFooterSingleLine: FooterCmsDTO = {
  type: "single_line",
  label: "Google Inc.",
};

// Variant 2: Links (current - your data)
export const mockFooterLinks: FooterCmsDTO = {
  type: "links",
  router_list: [
    {
      list_label: "關於我們",
      routers: [
        { label: "關於我們", url: "/about" },
        { label: "團隊介紹", url: "/team" },
        { label: "聯絡我們", url: "/contact" },
      ],
    },
    {
      list_label: "產品服務",
      routers: [
        { label: "產品列表", url: "/products" },
        { label: "解決方案", url: "/solutions" },
        { label: "定價方案", url: "/pricing" },
      ],
    },
    {
      list_label: "資源中心",
      routers: [
        { label: "部落格", url: "/blog" },
        { label: "文件", url: "/docs", target: "_blank" },
        { label: "API", url: "/api", target: "_blank" },
      ],
    },
  ],
  copy_right: "Google Inc.",
};

// Variant 3: Rich (with contact info - new flexible format)
export const mockFooterRich: FooterCmsDTO = {
  type: "rich",
  copy_right: "Google Inc.",
  contact_info: {
    // 字串格式（單一值）
    email: "support@example.com",
    address: "台北市信義區信義路五段7號",

    // 物件陣列格式（多個分公司/據點）
    tel: [
      { label: "台北總公司", value: "+886-2-1234-5678" },
      { label: "高雄分公司", value: "+886-7-9876-5432" },
      { label: "客服專線", value: "+886-800-123-456" },
    ],
    fax: [
      { label: "台北傳真", value: "+886-2-8765-4321" },
      { label: "高雄傳真", value: "+886-7-5432-1098" },
    ],
  },
  router_list: [
    {
      list_label: "關於我們",
      routers: [
        { label: "關於我們", url: "/about" },
        { label: "團隊介紹", url: "/team" },
      ],
    },
    {
      list_label: "產品服務",
      routers: [
        { label: "產品列表", url: "/products" },
        { label: "解決方案", url: "/solutions" },
      ],
    },
  ],
};

/**
 * Current active mock data
 * Change this to test different variants:
 * - mockFooterSingleLine
 * - mockFooterLinks
 * - mockFooterRich
 */
export const mockFooterData: FooterCmsDTO = mockFooterLinks; // <-- Change here to switch variant

/**
 * Simulate API delay for realistic development experience
 */
export const simulateApiDelay = (ms: number = 500) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Mock Footer API - Simulating backend request
 * Used during development, will be replaced with real API later
 */
export const mockFetchFooter = async (): Promise<FooterCmsDTO> => {
  await simulateApiDelay(500); // Simulate network latency
  return mockFooterData;
};
