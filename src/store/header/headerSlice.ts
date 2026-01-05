import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { HeaderCmsDTO } from "@/model/dto/cms.dto";

// 使用者資訊型別
export interface UserInfo {
  username: string;
  avatar?: string;
  email?: string;
}

type HeaderState = {
  // CMS 資料相關
  dto: HeaderCmsDTO | null;
  loading: boolean;
  error?: string;

  // UI 狀態相關
  ui: {
    // 使用者登入狀態
    isLoggedIn: boolean;
    userInfo: UserInfo | null;
    // AuthPanel 下拉選單是否開啟
    isAuthDropdownOpen: boolean;
  };
};

const initialState: HeaderState = {
  // CMS 資料
  dto: null,
  loading: false,

  // UI 狀態
  ui: {
    isLoggedIn: false,
    userInfo: null,
    isAuthDropdownOpen: false,
  },
};

const headerSlice = createSlice({
  name: "header",
  initialState,
  reducers: {
    // ==================== CMS 資料相關 ====================
    setHeaderData(state, action: PayloadAction<HeaderCmsDTO>) {
      state.dto = action.payload;
      state.loading = false;
      state.error = undefined;
    },
    setHeaderLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setHeaderError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearHeaderError(state) {
      state.error = undefined;
    },

    // ==================== UI 狀態相關 ====================
    // 登入
    login(state, action: PayloadAction<UserInfo>) {
      state.ui.isLoggedIn = true;
      state.ui.userInfo = action.payload;
    },
    // 登出
    logout(state) {
      state.ui.isLoggedIn = false;
      state.ui.userInfo = null;
      state.ui.isAuthDropdownOpen = false;
    },
    // 更新使用者資訊
    updateUserInfo(state, action: PayloadAction<Partial<UserInfo>>) {
      if (state.ui.userInfo) {
        state.ui.userInfo = { ...state.ui.userInfo, ...action.payload };
      }
    },
    // 切換 AuthPanel 下拉選單
    toggleAuthDropdown(state) {
      state.ui.isAuthDropdownOpen = !state.ui.isAuthDropdownOpen;
    },
    // 設定 AuthPanel 下拉選單狀態
    setAuthDropdownOpen(state, action: PayloadAction<boolean>) {
      state.ui.isAuthDropdownOpen = action.payload;
    },
  },
});

export const {
  // CMS 資料
  setHeaderData,
  setHeaderLoading,
  setHeaderError,
  clearHeaderError,
  // UI 狀態
  login,
  logout,
  updateUserInfo,
  toggleAuthDropdown,
  setAuthDropdownOpen,
} = headerSlice.actions;

export default headerSlice.reducer;
