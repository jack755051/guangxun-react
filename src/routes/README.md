# 路由配置系統

類似 Angular 的集中式路由配置系統，用於 React Router。

## 功能

✅ 集中管理所有路由配置
✅ 自動生成 Navbar 導航
✅ 自動生成 Breadcrumb 麵包屑
✅ 支持嵌套路由
✅ 支持路由元數據（標題、圖標、權限等）
✅ 支持 Lazy Loading
✅ TypeScript 類型安全

---

## 文件結構

```
src/routes/
├── types.ts              # 類型定義
├── routes.config.ts      # 路由配置（⭐️ 主要編輯文件）
├── utils.ts              # 工具函數
├── hooks.ts              # React Hooks
├── index.ts              # 統一導出
└── README.md             # 使用說明
```

---

## 使用方法

### 1. 定義路由配置

在 `routes.config.ts` 中添加路由：

```typescript
export const routesConfig: RouteConfig[] = [
  {
    path: "/products",
    component: lazy(() => import("@/pages/Products")),
    meta: {
      title: "產品服務",
      icon: "Package",
      showInNav: true, // 是否在導航中顯示
    },
    children: [
      {
        path: ":id",
        component: lazy(() => import("@/pages/Products/Detail")),
        meta: {
          title: "產品詳情",
          showInNav: false, // 不顯示在導航中
          breadcrumbLabel: "詳情", // 自定義麵包屑標籤
        },
      },
    ],
  },
];
```

### 2. 在 App.tsx 中集成

```typescript
import { BrowserRouter, Routes, Route } from "react-router";
import { Suspense } from "react";
import { routesConfig } from "@/routes";
import { Navbar } from "@/components/Navbar";
import { Breadcrumb } from "@/components/Breadcrumb";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Breadcrumb />

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {routesConfig.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.component ? <route.component /> : null}
            >
              {route.children?.map((child) => (
                <Route
                  key={child.path}
                  path={child.path}
                  element={child.component ? <child.component /> : null}
                />
              ))}
            </Route>
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### 3. 使用 Hooks

```typescript
import { useNavItems, useBreadcrumbs, useCurrentRouteMeta } from "@/routes/hooks";

function MyComponent() {
  // 獲取導航項目
  const navItems = useNavItems();

  // 獲取當前麵包屑
  const breadcrumbs = useBreadcrumbs();

  // 獲取當前路由元數據
  const routeMeta = useCurrentRouteMeta();

  return (
    <div>
      <h1>{routeMeta?.title}</h1>
    </div>
  );
}
```

---

## 路由元數據（RouteMeta）

| 屬性               | 類型      | 說明                     |
| ------------------ | --------- | ------------------------ |
| `title`            | `string`  | 顯示標題（必需）         |
| `icon`             | `string`  | 圖標名稱（lucide-react） |
| `showInNav`        | `boolean` | 是否在導航欄顯示         |
| `requiresAuth`     | `boolean` | 是否需要認證             |
| `breadcrumbLabel`  | `string`  | 自定義麵包屑標籤         |
| `hideInBreadcrumb` | `boolean` | 是否在麵包屑中隱藏       |

---

## 示例

### 示例 1: 基本路由

```typescript
{
  path: "/about",
  component: lazy(() => import("@/pages/About")),
  meta: {
    title: "關於我們",
    icon: "Info",
    showInNav: true,
  },
}
```

### 示例 2: 嵌套路由

```typescript
{
  path: "/dashboard",
  component: lazy(() => import("@/pages/Dashboard")),
  meta: {
    title: "控制台",
    icon: "LayoutDashboard",
    showInNav: true,
    requiresAuth: true,
  },
  children: [
    {
      path: "analytics",
      component: lazy(() => import("@/pages/Dashboard/Analytics")),
      meta: {
        title: "數據分析",
        showInNav: true,
      },
    },
  ],
}
```

### 示例 3: 動態路由

```typescript
{
  path: "/products/:id",
  component: lazy(() => import("@/pages/Products/Detail")),
  meta: {
    title: "產品詳情",
    showInNav: false,
    breadcrumbLabel: "詳情",  // 顯示 "產品服務 / 詳情" 而不是 "產品服務 / 產品詳情"
  },
}
```

---

## 優勢

### vs 傳統 React Router 寫法

**傳統寫法：**

```tsx
// 路由分散在各處
<Routes>
  <Route path="/about" element={<About />} />
  <Route path="/products" element={<Products />} />
</Routes>

// 導航需要手動維護
<nav>
  <Link to="/about">關於我們</Link>
  <Link to="/products">產品服務</Link>
</nav>

// 麵包屑需要手動構建
```

**集中配置寫法：**

```tsx
// ✅ 路由集中管理
// routes.config.ts 中定義一次

// ✅ 導航自動生成
<Navbar />  // 自動從配置生成

// ✅ 麵包屑自動生成
<Breadcrumb />  // 自動根據當前路徑生成
```

---

## 進階用法

### 路由守衛（待實現）

```typescript
// 可以擴展為路由守衛
export function useRouteGuard() {
  const routeMeta = useCurrentRouteMeta();
  const isAuthenticated = useAuth();

  if (routeMeta?.requiresAuth && !isAuthenticated) {
    // 重定向到登入頁
  }
}
```

### 動態路由標題

```typescript
// 在組件中使用
useEffect(() => {
  const meta = useCurrentRouteMeta();
  document.title = meta?.title || "Default Title";
}, []);
```

---

## 與 Angular Router 對比

| 功能         | Angular | 本系統        |
| ------------ | ------- | ------------- |
| 集中配置     | ✅      | ✅            |
| 路由元數據   | ✅      | ✅            |
| 嵌套路由     | ✅      | ✅            |
| Lazy Loading | ✅      | ✅            |
| 路由守衛     | ✅      | ⚠️ 需手動實現 |
| 自動導航     | ❌      | ✅            |
| 自動麵包屑   | ❌      | ✅            |
