import { LogoBlock } from "@/components/Header/block/Logo.tsx";
import { NavBarBlock } from "@/components/Header/block/NavBar.tsx";
import { SearchBarBlock } from "@/components/Header/block/SearchBar.tsx";
import { AuthPanelBlock } from "@/components/Header/block/AuthPanel.tsx";
import type { HeaderViewModel } from "@/model/view-model/header.view-model.ts";

export function DefaultHeader(vm: HeaderViewModel) {
  return (
    <div className="flex w-full">
      <LogoBlock {...vm.logo} />
      <NavBarBlock {...vm.nav} />
      {vm.search && <SearchBarBlock {...vm.search} />}
      {vm.auth && <AuthPanelBlock {...vm.auth} />}
    </div>
  );
}
