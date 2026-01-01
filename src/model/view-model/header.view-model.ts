import type { HeaderCmsType } from "../dto/cms.dto";

// ====================
//    Base Interface
// ====================
export interface HeaderBaseVM<K extends HeaderCmsType, T> {
  kind: K;
  data: T;
}

// ====================
//    原子區塊定義
// ====================

// Logo 區塊
export interface HeaderLogo {
  url: string;
  alt: string;
}

export interface BlockLogo {
  logo: HeaderLogo;
}

// 導航區塊
export interface HeaderNavItem {
  label: string;
  url: string;
  children?: HeaderNavItem[];
}

export interface BlockNav {
  nav: HeaderNavItem[];
}

// 認證區塊（登入/註冊）
export interface HeaderAuth {
  loginText: string;
  registerText?: string;
}

export interface BlockAuth {
  auth: HeaderAuth;
}

// 搜尋區塊
export interface HeaderSearch {
  placeholder: string;
}

export interface BlockSearch {
  search: HeaderSearch;
}

// ====================
//    組合式 ViewModel
// ====================

// 基礎版：Logo + 導航
export interface HeaderLogoAndNavVM extends HeaderBaseVM<
  "logo_and_nav",
  BlockLogo & BlockNav
> {}

// 帶認證：Logo + 導航 + 認證按鈕
export interface HeaderWithAuthVM extends HeaderBaseVM<
  "with_auth",
  BlockLogo & BlockNav & BlockAuth
> {}

// 帶搜尋：Logo + 導航 + 搜尋框
export interface HeaderWithSearchVM extends HeaderBaseVM<
  "with_search",
  BlockLogo & BlockNav & BlockSearch
> {}

// 完整版：Logo + 導航 + 認證 + 搜尋
export interface HeaderFullVM extends HeaderBaseVM<
  "full",
  BlockLogo & BlockNav & BlockAuth & BlockSearch
> {}

export type HeaderViewModel =
  | HeaderLogoAndNavVM
  | HeaderWithAuthVM
  | HeaderWithSearchVM
  | HeaderFullVM;
