// CMS DTO 定義檔

// Header 相關 DTO 定義
export interface HeaderCmsDTO {
  logo: {
    url: string;
    alt: string;
  };
  nav: {
    label: string;
    url: string;
    children?: { label: string; url: string }[];
  }[];
  search?: {
    placeholder: string;
  };
  auth?: {
    login_text: string;
    register_text?: string;
  };
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
      contact_info_title?: string;
      contact_info: {
        // 支持兩種格式：
        // 1. 字串（單一值）: { email: "support@example.com" }
        // 2. 物件陣列（多個值）: { tel: [{ label: "台北總公司", value: "09xxxxx" }] }
        [key: string]: string | { label: string; value: string }[];
      };
      router_list: {
        list_label: string;
        routers: { label: string; url: string; target?: "_self" | "_blank" }[];
      }[];
      copy_right: string;
    };
