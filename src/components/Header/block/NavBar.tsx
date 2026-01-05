import { cn } from "@/lib/utils.ts";
import type { INavItem } from "@/model/view-model/header.view-model.ts";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@radix-ui/react-navigation-menu";

interface NavBarBlockProps {
  items: INavItem[];
  className?: string;
}

export function NavBarBlock({ items, className }: NavBarBlockProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <NavigationMenu>
        <NavigationMenuList className="flex gap-2">
          {items.map((item, index) => (
            <NavigationMenuItem
              key={item.label}
              className="animate-in fade-in slide-in-from-top-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* 有子項目：顯示下拉選單 */}
              {item.children && item.children.length > 0 ? (
                <>
                  <NavigationMenuTrigger className="group relative flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-300 rounded-md hover:bg-primary/10 data-[state=open]:bg-primary/10 data-[state=open]:text-primary overflow-hidden">
                    {/* 背景光暈效果 */}
                    <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 animate-shimmer" />

                    {/* 底部高亮線 */}
                    <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full group-data-[state=open]:w-full" />

                    <span className="relative z-10">{item.label}</span>
                    <svg
                      className="relative z-10 w-4 h-4 transition-transform duration-300 group-data-[state=open]:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="absolute left-0 top-full mt-2 w-48 bg-[hsl(215,25%,22%)] rounded-lg shadow-xl shadow-primary/5 border border-primary/20 py-2 animate-in fade-in slide-in-from-top-2 duration-300 backdrop-blur-sm">
                    <ul className="flex flex-col">
                      {item.children.map((child, childIndex) => (
                        <li
                          key={child.label}
                          className="animate-in fade-in slide-in-from-left-1"
                          style={{ animationDelay: `${childIndex * 30}ms` }}
                        >
                          <NavigationMenuLink
                            href={child.url}
                            className="group relative block px-4 py-2 text-sm text-foreground/80 hover:text-primary transition-all duration-200 overflow-hidden"
                          >
                            {/* 左側高亮條 */}
                            <span className="absolute left-0 top-0 h-full w-[2px] bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-200" />

                            {/* 背景效果 */}
                            <span className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                            <span className="relative z-10 flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors duration-200" />
                              {child.label}
                            </span>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                /* 無子項目：直接顯示連結 */
                <NavigationMenuLink
                  href={item.url}
                  className="group relative block px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-300 rounded-md hover:bg-primary/10 overflow-hidden"
                >
                  {/* 背景光暈效果 */}
                  <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 animate-shimmer" />

                  {/* 底部高亮線 */}
                  <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />

                  <span className="relative z-10">{item.label}</span>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
