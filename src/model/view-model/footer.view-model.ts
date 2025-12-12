import type { CommonUrl } from "../common";
import type { FooterCmsType } from "../dto/cms.dto";

export interface FooterBaseVM<K extends FooterCmsType, T> {
  kind: K;
  data: T;
}

// 聯繫方法
export type RichContactInfo<TExtra extends object = {}> = {
  tel?: string[];
  fax?: string[];
  address?: string;
  email?: string;
} & TExtra;

// 路由項目
export interface RichRouterItem extends CommonUrl {
  target?: "_self" | "_blank";
}

export interface RouterList {
  listLabel: string;
  routers: RichRouterItem[];
}

export interface FooterLinks {
  routerList: RouterList[];
  copyRight: string;
}

export interface FooterRich {
  contactInfo: RichContactInfo;
  routerList: RouterList[];
  copyRight: string;
}

export interface FooterSingleLineVM extends FooterBaseVM<"single_line", { copyRight: string }> {}

export interface FooterLinksVM extends FooterBaseVM<"links", { links: FooterLinks }> {}

export interface FooterRichVM extends FooterBaseVM<"rich", { rich: FooterRich }> {}

// 底部顯示效果
export type FooterViewModel = FooterSingleLineVM | FooterLinksVM | FooterRichVM;
