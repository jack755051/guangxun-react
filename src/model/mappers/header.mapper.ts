import type { HeaderViewModel, INavItem } from "@/model/view-model/header.view-model.ts";
import type { HeaderCmsDTO } from "@/model/dto/cms.dto.ts";
import { safeText } from "@/model/domain/guards/primitives.guard";

/**
 * 映射導航項目（支持嵌套）
 */
function mapNavItems(navDto: HeaderCmsDTO["nav"]): INavItem[] {
  return navDto
    .map((item) => {
      const navItem: INavItem = {
        label: safeText(item.label, ""),
        url: safeText(item.url, "#"),
      };

      // 如果有子項目，遞歸映射
      if (item.children && item.children.length > 0) {
        navItem.children = mapNavItems(item.children);
      }

      return navItem;
    })
    .filter((item) => item.label !== ""); // 過濾掉無效項目
}

/**
 * 映射 HeaderCmsDTO 到 HeaderViewModel
 */
export function mapHeaderCmsToViewModel(dto: HeaderCmsDTO): HeaderViewModel {
  return {
    kind: "default",
    data: {
      logo: {
        url: safeText(dto.logo.url, "/logo.svg"),
        alt: safeText(dto.logo.alt, "Logo"),
      },
      nav: mapNavItems(dto.nav),
      search: dto.search
        ? {
            placeholder: safeText(dto.search.placeholder, "Search..."),
          }
        : undefined,
      auth: dto.auth
        ? {
            loginText: safeText(dto.auth.login_text, "Login"),
            registerText: dto.auth.register_text ? safeText(dto.auth.register_text, "") : undefined,
          }
        : undefined,
    },
  };
}
