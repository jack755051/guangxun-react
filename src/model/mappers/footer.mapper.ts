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
      const contactInfo = mapContactInfo(dto.contact_info);

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

/** 驗證 URL（支持相對路徑和絕對路徑） */
function isValidUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;

  // 相對路徑（以 / 開頭）
  if (url.startsWith("/")) return true;

  // 絕對路徑（http:// 或 https://）
  if (isHttpUrl(url)) return true;

  return false;
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

          // 修改：支持相對路徑和絕對路徑
          if (!label || !isValidUrl(link)) return null;
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

/**
 * 映射聯絡資訊
 * 支持兩種格式：
 * 1. 字串：{ email: "support@example.com" }
 * 2. 物件陣列：{ tel: [{ label: "台北總公司", value: "09xxxxx" }] }
 */
function mapContactInfo(
  contactInfoDto: Record<string, string | { label: string; value: string }[]>
): Record<string, string | { label: string; value: string }[]> {
  const result: Record<string, string | { label: string; value: string }[]> = {};

  Object.entries(contactInfoDto).forEach(([key, value]) => {
    // 格式 1: 字串（直接使用）
    if (typeof value === "string") {
      const cleanValue = safeText(value, "");
      if (cleanValue) {
        result[key] = cleanValue;
      }
      return;
    }

    // 格式 2: 物件陣列（過濾並保留有效項目）
    if (Array.isArray(value)) {
      const cleanedArray = value
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const label = safeText(item.label, "");
          const val = safeText(item.value, "");
          if (!label || !val) return null;
          return { label, value: val };
        })
        .filter(isNotNull);

      if (cleanedArray.length > 0) {
        result[key] = cleanedArray;
      }
    }
  });

  return result;
}

/** 保底 footer */
export function fallbackFooter(companyName = "©"): FooterViewModel {
  return {
    kind: "single_line",
    data: { companyName },
  };
}
