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
