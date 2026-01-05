/**
 * 路由系統入口
 * 統一導出路由配置、工具函數和 Hooks
 */

export { routesConfig } from "./routes.config";
export { flattenRoutes, generateNavItems, generateBreadcrumbs, findRouteMeta } from "./utils";
export { RouteRenderer } from "./RouteRenderer";
export type { RouteConfig, RouteMeta, FlatRoute, NavItem, BreadcrumbItem } from "./types";
