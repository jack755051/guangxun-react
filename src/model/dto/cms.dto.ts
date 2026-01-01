// CMS DTO 定義檔

// Header 相關 DTO 定義
export type HeaderCmsType = "logo_and_nav" | "with_auth" | "with_search" | "full"; // base: 一般頂部套件(logo + navgation), auth: 帶有登入註冊按鈕標頭, search: 帶有搜尋框標頭, full: 帶有所有功能標頭
export interface HeaderFeatures {
  hasAuth: boolean;
  hasSearch: boolean;
}

// Footer 相關 DTO 定義
export type FooterCmsType = "single_line" | "links" | "rich";

export type FooterCmsDTO =
  | { type: "single_line"; label: string }
  | {
      type: "links";
      router_list: {
        list_label: string;
        routers: { label: string; url: string; target?: "_self" | "_blank" }[];
      }[];
      copy_right: string;
    }
  | {
      type: "rich";
      contact_info: {
        tel: string[];
        fax?: string[];
        address?: string;
        email?: string;
        [key: string]: unknown;
      };
      router_list: {
        list_label: string;
        routers: { label: string; url: string; target?: "_self" | "_blank" }[];
      }[];
      copy_right: string;
    };
