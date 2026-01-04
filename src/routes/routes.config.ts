import { lazy } from "react";
import type { RouteConfig } from "./types";

/**
 * 集中式路由配置
 * 用於：
 * 1. React Router 路由定義
 * 2. Navbar 導航生成
 * 3. Breadcrumb 麵包屑生成
 */
export const routesConfig: RouteConfig[] = [
  {
    path: "/",
    component: lazy(() => import("@/pages/Home")),
    meta: {
      title: "首頁",
      icon: "Home",
      showInNav: true,
    },
  },
  {
    path: "/about",
    component: lazy(() => import("@/pages/About")),
    meta: {
      title: "關於我們",
      icon: "Info",
      showInNav: true,
    },
    children: [
      {
        path: "history",
        component: lazy(() => import("@/pages/About/History")),
        meta: {
          title: "公司歷程",
          showInNav: true,
        },
      },
    ],
  },
  {
    path: "/products",
    component: lazy(() => import("@/pages/Products")),
    meta: {
      title: "產品服務",
      icon: "Package",
      showInNav: true,
    },
    children: [
      {
        path: ":id",
        component: lazy(() => import("@/pages/Products/Detail")),
        meta: {
          title: "產品詳情",
          showInNav: false,
          breadcrumbLabel: "詳情",
        },
      },
    ],
  },
];
