import { LogoBlock } from "@/components/Header/block/Logo.tsx";
import { NavBarBlock } from "@/components/Header/block/NavBar.tsx";
import { SearchBarBlock } from "@/components/Header/block/SearchBar.tsx";
import { AuthPanelBlock } from "@/components/Header/block/AuthPanel.tsx";
import type { HeaderViewModel } from "@/model/view-model/header.view-model.ts";

export function DefaultHeader(vm: HeaderViewModel) {
  return (
    <header className="sticky top-0 z-50 w-full bg-muted text-primary-foreground backdrop-blur-md border-b border-primary-foreground/10 shadow-lg shadow-primary/5">
      <div className="flex h-[7vh] px-10 py-3 items-center gap-4">
        <LogoBlock {...vm.data.logo} className="w-[10%]" />
        <NavBarBlock className="w-[55%]" items={vm.data.nav} />
        <div className="flex-1 flex items-center">
          {vm.data.search && <SearchBarBlock {...vm.data.search} />}
          {vm.data.auth && (
            <div className="ml-auto flex  w-[60%] justify-center">
              <AuthPanelBlock {...vm.data.auth} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
