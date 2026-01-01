import { createSelector } from "reselect";
import { mapFooterCmsToViewModel } from "@/model/mappers/footer.mapper";
import type { FooterViewModel } from "@/model/view-model/footer.view-model";
import type { RootState } from "@/store";

export const selectFooterDto = (state: RootState) => state.footer.dto;

// 創建一個常數默認值，避免每次都創建新對象
const DEFAULT_FOOTER_VM: FooterViewModel = { kind: "single_line", data: { companyName: "©" } };

export const selectFooterVM = createSelector([selectFooterDto], (dto): FooterViewModel => {
  return dto ? mapFooterCmsToViewModel(dto) : DEFAULT_FOOTER_VM;
});
