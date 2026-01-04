import { useMemo } from "react";
import { useLocation } from "react-router";
import { routesConfig } from "./routes.config";
import { flattenRoutes, generateNavItems, generateBreadcrumbs } from "./utils";
import type { NavItem, BreadcrumbItem, FlatRoute } from "./types";

/**
 * 獲取扁平化的路由列表
 */
export function useFlatRoutes(): FlatRoute[] {
  return useMemo(() => flattenRoutes(routesConfig), []);
}

/**
 * 獲取導航項目（用於 Navbar）
 */
export function useNavItems(): NavItem[] {
  return useMemo(() => generateNavItems(routesConfig), []);
}

/**
 * 獲取當前頁面的麵包屑
 */
export function useBreadcrumbs(): BreadcrumbItem[] {
  const location = useLocation();
  const flatRoutes = useFlatRoutes();

  return useMemo(
    () => generateBreadcrumbs(location.pathname, flatRoutes),
    [location.pathname, flatRoutes]
  );
}

/**
 * 獲取當前路由的元數據
 */
export function useCurrentRouteMeta() {
  const location = useLocation();
  const flatRoutes = useFlatRoutes();

  return useMemo(() => {
    return flatRoutes.find((r) => r.fullPath === location.pathname)?.meta;
  }, [location.pathname, flatRoutes]);
}
