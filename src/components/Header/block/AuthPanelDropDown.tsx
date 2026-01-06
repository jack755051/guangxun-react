import { cn } from "@/lib/utils";
import type { ElementType } from "react";

export type DropdownItemType = "normal" | "danger";

export type DropdownItem = {
  icon?: ElementType; // 使用 React 的 ElementType 來接受任何組件
  label: string;
  path?: string;
  type: DropdownItemType;
  onClick?: () => void;
  divider?: boolean; // 是否在此項目後顯示分隔線
};

interface DropdownProps {
  dropdownItems: DropdownItem[];
  className?: string;
  onItemClick?: (item: DropdownItem) => void;
}

export function AuthPanelDropDown({ className, dropdownItems, onItemClick }: DropdownProps) {
  // 根據 type 取得對應的樣式
  const getItemStyles = (type: DropdownItemType) => {
    const baseStyles = "flex items-center w-full text-left px-4 py-2 text-sm transition-colors";

    switch (type) {
      case "normal":
        return cn(baseStyles, "text-foreground/80 hover:bg-primary/10 hover:text-primary");
      case "danger":
        return cn(baseStyles, "text-red-400 hover:bg-red-500/10 hover:text-red-500");
      default:
        return baseStyles;
    }
  };

  const handleItemClick = (item: DropdownItem) => {
    // 執行項目自身的 onClick
    if (item.onClick) {
      item.onClick();
    }
    // 執行父層傳入的 onItemClick
    if (onItemClick) {
      onItemClick(item);
    }
  };

  return (
    <div
      className={cn(
        "mt-2 w-48 bg-[hsl(215,25%,22%)] rounded-lg shadow-xl shadow-primary/10 border border-primary/20 py-2 z-[100] pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-200",
        className
      )}
    >
      {dropdownItems.map((item, index) => (
        <div key={index}>
          {/* 統一使用 a 標籤，將 icon 和 label 放在同一個可點擊區域 */}
          <a
            href={item.path || "#"}
            className={getItemStyles(item.type)}
            onClick={(e) => {
              if (!item.path) {
                e.preventDefault(); // 如果沒有 path，阻止默認行為
              }
              handleItemClick(item);
            }}
          >
            {item.icon && (
              <item.icon className="mr-2 w-4 h-4" />
            )}
            <span>{item.label}</span>
          </a>

          {/* 分隔線 */}
          {item.divider && <div className="border-t border-primary/20 my-2" />}
        </div>
      ))}
    </div>
  );
}
