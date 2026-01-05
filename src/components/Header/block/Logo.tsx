import type { ILogo } from "@/model/view-model/header.view-model.ts";
import { cn } from "@/lib/utils.ts";

interface HeaderLogoProps extends ILogo {
  className?: string;
}

export function LogoBlock({ url, alt, className }: HeaderLogoProps) {
  return (
    <div className={cn("header__logo h-full", className)}>
      <img src={url} alt={alt} className="w-full h-full object-contain" />
    </div>
  );
}
