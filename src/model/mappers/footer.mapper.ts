import { MAX_LINKS } from "../domain/footer.policy";
import { isHttpUrl, safeText } from "../domain/guards/primitives.guard";
import type { FooterCmsDTO } from "../dto/cms.dto";
import type { FooterViewModel, IRouterItem, IRouterList } from "../view-model/footer.view-model";
import { isNotNull } from "./_shared/type-guards";

/** 映射FooterCmsDTO到FooterViewModel */
export function mapFooterCmsToViewModel(dto: FooterCmsDTO): FooterViewModel {
  switch (dto.type) {
    case "single_line":
      return {
        kind: "single_line",
        data: {
          companyName: safeText(dto.label, "©"),
        },
      };
    case "links": {
      const companyName = safeText(dto.copy_right, "©");
      const routers = mapRouterList(dto.router_list);

      const hasAnyRouters = routers.some((s) => s.routers.length > 0);
      if (!hasAnyRouters && !companyName) return fallbackFooter();

      return {
        kind: "links",
        data: {
          companyName,
          title: "Links",
          routers,
        },
      };
    }
    case "rich": {
      const companyName = safeText(dto.copy_right, "©");
      const routers = mapRouterList(dto.router_list);

      const contactInfo = {
        tel: (dto.contact_info.tel ?? []).map((t) => safeText(t)).filter(Boolean).join(", "),
        fax: (dto.contact_info.fax ?? []).map((f) => safeText(f)).filter(Boolean).join(", "),
        address: safeText(dto.contact_info.address, ""),
        email: safeText(dto.contact_info.email, ""),
      };

      const hasAnyRouters = routers.some((s) => s.routers.length > 0);
      if (!hasAnyRouters && !companyName) return fallbackFooter();

      return {
        kind: "rich",
        data: {
          companyName,
          title: "Links",
          routers,
          contactInfo,
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
): IRouterList[] {
  return (router_list ?? [])
    .map((section) => {
      const routerListTitle = safeText(section?.list_label, "");

      const routers = (section?.routers ?? [])
        .map((r) => {
          const label = safeText(r?.label);
          const link = typeof r?.url === "string" ? r.url : "";
          const target = r?.target === "_blank" ? "_blank" : "_self";
          const alt = label;

          if (!label || !isHttpUrl(link)) return null;
          return { label, link, target, alt } satisfies IRouterItem;
        })
        .filter(isNotNull)
        .slice(0, MAX_LINKS);

      // section 沒 label 且也沒有效 routers → 丟掉
      if (!routerListTitle && routers.length === 0) return null;

      return { routerListTitle, routers };
    })
    .filter(isNotNull);
}

/** 保底 footer */
export function fallbackFooter(companyName = "©"): FooterViewModel {
  return {
    kind: "single_line",
    data: { companyName },
  };
}
