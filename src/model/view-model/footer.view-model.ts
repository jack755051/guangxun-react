import type { FooterCmsType } from "../dto/cms.dto";

export interface FooterBaseVM<K extends FooterCmsType, T> {
  kind: K;
  data: T;
}

// ====================
//    基礎型別定義（Hook 使用）
// ====================

/** For Copyright information in the footer */
export type ICopyRight = {
  companyName: string;
  startYear?: number;
};

/** For Router information in the footer */
export type IRouter = {
  title: string;
  routers: IRouterList[];
};

export type IRouterList = {
  routerListTitle: string;
  routers: IRouterItem[];
};

export type IRouterItem = {
  alt: string;
  link: string;
  icon?: string;
  label: string;
  target?: "_self" | "_blank";
};

/** For Contact information in the footer */
export type ContactItem = {
  label: string;
  value: string;
};

export type IContactInfoBase = {
  // key 可能是 'tel', 'address', 'email' 等
  // 值可能是字串（單一），或是物件陣列（多個分公司）
  [key: string]: string | ContactItem[];
};

// ====================
//    Block Type Aliases
// ====================

export type blockSingleLine = ICopyRight;
export type blockLinks = ICopyRight & IRouter;
export type blockRich = ICopyRight & IRouter & { contactInfo: IContactInfoBase };

// ====================
//    組合式 ViewModel
// ====================

// 單行版權：只需要版權區塊
export interface FooterSingleLineVM extends FooterBaseVM<"single_line", blockSingleLine> {}

// 連結版：版權 + 路由連結
export interface FooterLinksVM extends FooterBaseVM<"links", blockLinks> {}

// 豐富版：版權 + 聯絡方式 + 路由連結
export interface FooterRichVM extends FooterBaseVM<"rich", blockRich> {}

export type FooterViewModel = FooterSingleLineVM | FooterLinksVM | FooterRichVM;
