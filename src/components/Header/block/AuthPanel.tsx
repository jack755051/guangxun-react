import type { IAuth } from "@/model/view-model/header.view-model";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useDispatch, useSelector } from "react-redux";
import { toggleAuthDropdown, setAuthDropdownOpen } from "@/store/header/headerSlice";
import { selectIsAuthDropdownOpen } from "@/store/header/headerSelectors";
import { useEffect, useRef } from "react";

interface HeaderAuthProps extends IAuth {
  className?: Record<string, string>;
  onAvatarClick?: () => void; // 可選：自定義點擊事件
}

export function AuthPanelBlock({ className, onAvatarClick, ...props }: HeaderAuthProps) {
  const dispatch = useDispatch();
  const isDropdownOpen = useSelector(selectIsAuthDropdownOpen);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        dispatch(setAuthDropdownOpen(false));
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, dispatch]);

  const handleAvatarClick = () => {
    // 如果有自定義事件，優先執行
    if (onAvatarClick) {
      onAvatarClick();
    } else {
      // 否則切換下拉選單
      dispatch(toggleAuthDropdown());
    }
  };

  return (
    <div ref={dropdownRef} className={cn("relative flex items-center space-x-3 px-2", className?.header__authpanel_wrapper)}>
      {/* 歡迎詞 + 使用者名稱 */}
      <span className={cn("text-sm font-semibold", className?.header__authpanel__username)}>
        {props.textGroup.welcomeText}, {props.user.userName}
      </span>

      {/* 頭像 */}
      <Avatar className="hover:cursor-pointer w-10 h-10 rounded-full ring-0 hover:ring-2 hover:ring-primary transition-all" onClick={handleAvatarClick}>
        <AvatarImage
          src={props.user.avatar.imageUrl}
          className="w-full h-full rounded-full object-cover"
          width={40}
          height={40}
        />
        <AvatarFallback className="w-full h-full rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium">
          {props.user.avatar.fallbackText}
        </AvatarFallback>
      </Avatar>

      {/* 下拉選單 */}
      {isDropdownOpen && (
        <div className="absolute right-0 top-[calc(100%+12px)] w-48 bg-[hsl(215,25%,22%)] rounded-lg shadow-xl shadow-primary/10 border border-primary/20 py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
            <a
              href="/profile"
              className="block px-4 py-2 text-sm text-foreground/80 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              個人檔案
            </a>
            <a
              href="/settings"
              className="block px-4 py-2 text-sm text-foreground/80 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              設定
            </a>
            <div className="border-t border-primary/20 my-2" />
            <button
              onClick={() => {
                // TODO: 實作登出邏輯
                dispatch(setAuthDropdownOpen(false));
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-primary/10 hover:text-red-300 transition-colors"
            >
              登出
            </button>
          </div>
        )}
    </div>
  );
}
