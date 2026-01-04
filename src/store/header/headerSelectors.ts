import { createSelector } from "reselect";
import type { HeaderViewModel } from "@/model/view-model/header.view-model.ts";
import type { RootState } from "@/store";
import { mapHeaderCmsToViewModel } from "@/model/mappers/header.mapper";
import { generateNavItems } from "@/routes";
import { routesConfig } from "@/routes/routes.config";

export const selectHeaderDto = (state: RootState) => state.header.dto;

const DEFAULT_HEADER_VM: HeaderViewModel = {
  kind: "default",
  data: {
    logo: {
      url: "/logo.svg",
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
  },
};

export const selectHeaderVM = createSelector([selectHeaderDto], (dto): HeaderViewModel => {
  return dto ? mapHeaderCmsToViewModel(dto) : DEFAULT_HEADER_VM;
});
