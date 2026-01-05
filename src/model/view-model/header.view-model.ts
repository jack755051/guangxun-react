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

export interface IAuthTextGroup {
  loginText?: string;
  registerText?: string;
  welcomeText?: string;
}

export interface IAvatar {
  imageUrl: string;
  fallbackText: string;
}

export interface IUserInfo {
  userName: string;
  email?: string;
  avatar: IAvatar;
}

// 認證區塊（登入/註冊）
export interface IAuth {
  textGroup: IAuthTextGroup;
  user: IUserInfo;
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
