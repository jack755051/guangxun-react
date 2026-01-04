// ====================
//    基礎型別定義（Block 使用）
// ====================

// Logo 區塊
export interface ILogo {
  url: string;
  alt: string;
}

// 導航區塊
export interface INavItem {
  label: string;
  url: string;
  children?: INavItem[];
}

// 認證區塊（登入/註冊）
export interface IAuth {
  loginText: string;
  registerText?: string;
}

// 搜尋區塊
export interface ISearch {
  placeholder: string;
}

// ====================
//    Data 結構（可選欄位組合）
// ====================

export interface HeaderData {
  logo: ILogo;
  nav: INavItem[];
  search?: ISearch;
  auth?: IAuth;
}

// ====================
//    ViewModel（kind + data 結構）
// ====================

export interface HeaderViewModel {
  kind: "default";
  data: HeaderData;
}
