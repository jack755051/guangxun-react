import { Link } from "react-router";
import { useBreadcrumbs } from "@/routes/hooks";
import { cn } from "@/lib/utils";

/**
 * 麵包屑組件
 * 自動從路由配置和當前路徑生成
 */
export function Breadcrumb() {
  const breadcrumbs = useBreadcrumbs();

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="py-4 px-4">
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((item, index) => (
          <li key={item.path} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400" aria-hidden="true">
                /
              </span>
            )}

            {item.isCurrent ? (
              <span className="font-semibold text-gray-900 dark:text-white" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className={cn(
                  "text-gray-600 dark:text-gray-400",
                  "hover:text-primary hover:underline",
                  "transition-colors"
                )}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
