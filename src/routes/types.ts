import type { ComponentType, LazyExoticComponent } from "react";

/**
 * 路由元數據 - 用於導航和麵包屑
 */
export interface RouteMeta {
  /** 顯示標題（用於導航和麵包屑） */
  title: string;
  /** 圖標名稱（lucide-react icon name） */
  icon?: string;
  /** 是否在導航欄中顯示 */
  showInNav?: boolean;
  /** 是否需要認證 */
  requiresAuth?: boolean;
  /** 自定義麵包屑標籤（如果與 title 不同） */
  breadcrumbLabel?: string;
  /** 是否在麵包屑中隱藏 */
  hideInBreadcrumb?: boolean;
}

/**
 * 路由配置
 */
export interface RouteConfig {
  /** 路由路徑 */
  path: string;
  /** 組件（支持 lazy loading） */
  component?: ComponentType | LazyExoticComponent<ComponentType>;
  /** 元數據 */
  meta?: RouteMeta;
  /** 子路由 */
  children?: RouteConfig[];
  /** 重定向 */
  redirect?: string;
  /** 索引路由（當訪問父路由時的默認子路由） */
  index?: boolean;
}

/**
 * 扁平化的路由（用於快速查找）
 */
export interface FlatRoute {
  /** 完整路徑 */
  fullPath: string;
  /** 路徑段（用於麵包屑） */
  pathSegments: string[];
  /** 元數據 */
  meta: RouteMeta;
  /** 父路由路徑 */
  parentPath?: string;
}

/**
 * 導航項目（用於 navbar）
 */
export interface NavItem {
  /** 標題 */
  label: string;
  /** 路徑 */
  path: string;
  /** 圖標 */
  icon?: string;
  /** 子項目 */
  children?: NavItem[];
}

/**
 * 麵包屑項目
 */
export interface BreadcrumbItem {
  /** 標籤 */
  label: string;
  /** 路徑 */
  path: string;
  /** 是否為當前頁面 */
  isCurrent?: boolean;
}
