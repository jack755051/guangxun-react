import type { HeaderViewModel } from "@/model/view-model/header.view-model.ts";
import { DefaultHeader } from "@/components/Header/variants/DefaultHeader.tsx";

export function Header(vm: HeaderViewModel) {
  return <DefaultHeader {...vm.data} />;
}
