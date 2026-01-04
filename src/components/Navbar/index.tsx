import { Link, useLocation } from "react-router";
import { useNavItems } from "@/routes/hooks";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/routes";

/**
 * 導航項目組件（支持嵌套）
 */
function NavItemComponent({ item, level = 0 }: { item: NavItem; level?: number }) {
  const location = useLocation();
  const isActive = location.pathname === item.path;
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className={cn("relative", level > 0 && "ml-4")}>
      <Link
        to={item.path}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          isActive && "bg-primary text-primary-foreground",
          !isActive && "text-gray-700 dark:text-gray-300"
        )}
      >
        {item.icon && <i className={`lucide-${item.icon}`} />}
        <span>{item.label}</span>
      </Link>

      {hasChildren && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <NavItemComponent key={child.path} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * 主導航欄組件
 * 自動從路由配置生成
 */
export function Navbar() {
  const navItems = useNavItems();

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-1">
          {navItems.map((item) => (
            <NavItemComponent key={item.path} item={item} />
          ))}
        </div>
      </div>
    </nav>
  );
}
