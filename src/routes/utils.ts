import type { RouteConfig, FlatRoute, NavItem, BreadcrumbItem } from "./types";

/**
 * 扁平化路由配置（用於快速查找）
 */
export function flattenRoutes(
  routes: RouteConfig[],
  parentPath = "",
  parentSegments: string[] = []
): FlatRoute[] {
  const result: FlatRoute[] = [];

  routes.forEach((route) => {
    const fullPath = route.path.startsWith("/")
      ? route.path
      : `${parentPath}/${route.path}`.replace(/\/+/g, "/");

    const pathSegments = [...parentSegments, route.path.replace(/^\//, "")];

    if (route.meta) {
      result.push({
        fullPath,
        pathSegments,
        meta: route.meta,
        parentPath: parentPath || undefined,
      });
    }

    if (route.children) {
      result.push(...flattenRoutes(route.children, fullPath, pathSegments));
    }
  });

  return result;
}

/**
 * 根據路由配置生成導航項目
 */
export function generateNavItems(routes: RouteConfig[], parentPath = ""): NavItem[] {
  return routes
    .filter((route) => route.meta?.showInNav)
    .map((route) => {
      const fullPath = route.path.startsWith("/")
        ? route.path
        : `${parentPath}/${route.path}`.replace(/\/+/g, "/");

      const navItem: NavItem = {
        label: route.meta!.title,
        path: fullPath,
        icon: route.meta!.icon,
      };

      if (route.children) {
        const childItems = generateNavItems(route.children, fullPath);
        if (childItems.length > 0) {
          navItem.children = childItems;
        }
      }

      return navItem;
    });
}

/**
 * 根據當前路徑生成麵包屑
 */
export function generateBreadcrumbs(
  currentPath: string,
  flatRoutes: FlatRoute[]
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];

  // 找到當前路由
  const currentRoute = flatRoutes.find((r) => r.fullPath === currentPath);
  if (!currentRoute) {
    return breadcrumbs;
  }

  // 構建麵包屑路徑
  const segments = currentPath.split("/").filter(Boolean);
  let accumulatedPath = "";

  segments.forEach((segment, index) => {
    accumulatedPath += `/${segment}`;
    const route = flatRoutes.find((r) => r.fullPath === accumulatedPath);

    if (route && !route.meta.hideInBreadcrumb) {
      breadcrumbs.push({
        label: route.meta.breadcrumbLabel || route.meta.title,
        path: accumulatedPath,
        isCurrent: index === segments.length - 1,
      });
    }
  });

  return breadcrumbs;
}

/**
 * 查找路由元數據
 */
export function findRouteMeta(path: string, flatRoutes: FlatRoute[]) {
  return flatRoutes.find((r) => r.fullPath === path)?.meta;
}
