import { Suspense } from "react";
import { Routes, Route } from "react-router";
import type { RouteConfig } from "./types";

/**
 * 遞歸渲染路由配置
 * 這個組件在 React 環境中，可以正確使用 JSX
 */
function renderRoutes(routes: RouteConfig[]) {
  return routes.map((route) => {
    const Component = route.component;

    return (
      <Route
        key={route.path}
        path={route.path}
        index={route.index}
        element={
          Component ? (
            <Suspense fallback={<div>Loading...</div>}>
              <Component />
            </Suspense>
          ) : undefined
        }
      >
        {route.children && renderRoutes(route.children)}
      </Route>
    );
  });
}

/**
 * 路由渲染器組件
 * 用法：<RouteRenderer routes={routesConfig} />
 */
export function RouteRenderer({ routes }: { routes: RouteConfig[] }) {
  return <Routes>{renderRoutes(routes)}</Routes>;
}
