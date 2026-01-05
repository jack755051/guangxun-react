import { createSelector } from "reselect";
import type { HeaderViewModel } from "@/model/view-model/header.view-model.ts";
import type { RootState } from "@/store";
import { mapHeaderCmsToViewModel } from "@/model/mappers/header.mapper";
import { generateNavItems } from "@/routes";
import { routesConfig } from "@/routes/routes.config";

// ==================== 基礎 Selectors ====================
export const selectHeaderDto = (state: RootState) => state.header.dto;
export const selectHeaderLoading = (state: RootState) => state.header.loading;
export const selectHeaderError = (state: RootState) => state.header.error;

// ==================== UI State Selectors ====================
export const selectHeaderUI = (state: RootState) => state.header.ui;
export const selectIsLoggedIn = (state: RootState) => state.header.ui.isLoggedIn;
export const selectUserInfo = (state: RootState) => state.header.ui.userInfo;
export const selectIsAuthDropdownOpen = (state: RootState) => state.header.ui.isAuthDropdownOpen;

// ==================== ViewModel Selectors ====================
const DEFAULT_HEADER_VM: HeaderViewModel = {
  kind: "default",
  data: {
    logo: {
      url: "/image/sanring-logo.png",
      alt: "SanRing Logo",
    },
    nav: generateNavItems(routesConfig).map((item) => ({
      label: item.label,
      url: item.path,
      children: item.children?.map((child) => ({
        label: child.label,
        url: child.path,
      })),
    })),
    search: { placeholder: "what's your search..." },
    auth: {
      user: {
        userName: "Charlie",
        avatar: {
          imageUrl: "https://github.com/shadcn.png",
          fallbackText: "CN",
        },
        email: "charlieTai@gmail.com",
      },
      textGroup: {
        welcomeText: "歡迎",
      },
    },
  },
};

export const selectHeaderVM = createSelector([selectHeaderDto], (dto): HeaderViewModel => {
  return dto ? mapHeaderCmsToViewModel(dto) : DEFAULT_HEADER_VM;
});
