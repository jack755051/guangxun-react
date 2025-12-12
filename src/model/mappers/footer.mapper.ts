import { MAX_LINKS } from "../domain/footer.policy";
import { isHttpUrl, safeText } from "../domain/guards/primitives.guard";
import type { FooterCmsDTO } from "../dto/cms.dto";
import type { FooterViewModel, RichRouterItem } from "../view-model/footer.view-model";
import { isNotNull } from "./_shared/type-guards";

/** 映射FooterCmsDTO到FooterViewModel */
export function mapFooterCmsToViewModel(dto: FooterCmsDTO): FooterViewModel {
  switch (dto.type) {
    case "single_line":
      return {
        kind: "single_line",
        data: {
          copyRight: safeText(dto.label, "©"),
        },
      };
    case "links": {
      const copyRight = safeText(dto.copy_right, "©");
      const routerList = mapRouterList(dto.router_list);

      const hasAnyRouters = routerList.some((s) => s.routers.length > 0);
      if (!hasAnyRouters && !copyRight) return fallbackFooter();

      return {
        kind: "links",
        data: {
          links: {
            routerList,
            copyRight,
          },
        },
      };
    }
    case "rich": {
      const copyRight = safeText(dto.copy_right, "©");
      const routerList = mapRouterList(dto.router_list);

      const contactInfo = {
        tel: (dto.contact_info.tel ?? []).map((t) => safeText(t)).filter(Boolean),
        fax: (dto.contact_info.fax ?? []).map((f) => safeText(f)).filter(Boolean),
        address: safeText(dto.contact_info.address, ""),
        email: safeText(dto.contact_info.email, ""),
      };

      const hasAnyRouters = routerList.some((s) => s.routers.length > 0);
      if (!hasAnyRouters && !copyRight) return fallbackFooter();

      return {
        kind: "rich",
        data: {
          rich: {
            contactInfo,
            routerList,
            copyRight,
          },
        },
      };
    }
  }
}

/** 映射路由列表 */
function mapRouterList(
  router_list: {
    list_label: string;
    routers: { label: string; url: string; target?: "_self" | "_blank" }[];
  }[]
) {
  return (router_list ?? [])
    .map((section) => {
      const listLabel = safeText(section?.list_label, "");

      const routers = (section?.routers ?? [])
        .map((r) => {
          const label = safeText(r?.label);
          const url = typeof r?.url === "string" ? r.url : "";
          const target = r?.target === "_blank" ? "_blank" : "_self";

          if (!label || !isHttpUrl(url)) return null;
          return { label, url, target } satisfies RichRouterItem;
        })
        .filter(isNotNull)
        .slice(0, MAX_LINKS);

      // section 沒 label 且也沒有效 routers → 丟掉
      if (!listLabel && routers.length === 0) return null;

      return { listLabel, routers };
    })
    .filter(isNotNull);
}

/** 保底 footer */
export function fallbackFooter(copyRight = "©"): FooterViewModel {
  return {
    kind: "single_line",
    data: { copyRight },
  };
}
