import type { IAuth } from "@/model/view-model/header.view-model";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useDispatch, useSelector } from "react-redux";
import { toggleAuthDropdown, setAuthDropdownOpen } from "@/store/header/headerSlice";
import { selectIsAuthDropdownOpen } from "@/store/header/headerSelectors";
import { useEffect, useRef } from "react";
import { AuthPanelDropDown, type DropdownItem } from "./AuthPanelDropDown";
import { UserRoundIcon, SettingsIcon, LogOutIcon } from "lucide-react";

interface HeaderAuthProps extends IAuth {
  className?: Record<string, string>;
  onAvatarClick?: () => void; // 可選：自定義點擊事件
  dropdownItems?: DropdownItem[]; // 可選：自定義下拉選單項目
}

export function AuthPanelBlock({
  className,
  onAvatarClick,
  dropdownItems: customDropdownItems,
  ...props
}: HeaderAuthProps) {
  const dispatch = useDispatch();
  const isDropdownOpen = useSelector(selectIsAuthDropdownOpen);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 定義默認的下拉選單項目
  const defaultDropdownItems: DropdownItem[] = [
    {
      label: "個人檔案",
      icon: UserRoundIcon,
      path: "/profile",
      type: "normal",
    },
    {
      label: "設定",
      icon: SettingsIcon,
      path: "/settings",
      type: "normal",
      divider: true,
    },
    {
      label: "登出",
      icon: LogOutIcon,
      type: "danger",
      onClick: () => {
        // TODO: 實作登出邏輯
        dispatch(setAuthDropdownOpen(false));
      },
    },
  ];

  // 使用外部傳入的 dropdownItems，如果沒有則使用默認值
  const dropdownItems = customDropdownItems || defaultDropdownItems;

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
    <div
      ref={dropdownRef}
      className={cn(
        "relative flex items-center space-x-3 px-2",
        className?.header__authpanel_wrapper
      )}
    >
      {/* 歡迎詞 + 使用者名稱 */}
      <span className={cn("text-sm font-semibold", className?.header__authpanel__username)}>
        {props.textGroup.welcomeText}, {props.user.userName}
      </span>

      {/* 頭像 */}
      <Avatar
        className="hover:cursor-pointer w-10 h-10 rounded-full ring-2 ring-transparent hover:ring-primary transition-colors"
        onClick={handleAvatarClick}
      >
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

      {/* 下拉選單容器 - 使用 absolute 包裝確保不參與 flex 布局 */}
      <div className="absolute right-0 top-full pointer-events-none">
        {isDropdownOpen && <AuthPanelDropDown dropdownItems={dropdownItems} />}
      </div>
    </div>
  );
}
