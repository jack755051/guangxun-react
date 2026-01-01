import type { FooterViewModel } from "@/model/view-model/footer.view-model";
import { SingleLine } from "@/components/Footer/variants/SingleLine";
import { Links } from "@/components/Footer/variants/Links";
import { Rich } from "@/components/Footer/variants/Rich";

export function Footer(vm: FooterViewModel) {
  switch (vm.kind) {
    case "single_line":
      return <SingleLine {...vm.data} />;
    case "links":
      return <Links {...vm.data} />;
    case "rich":
      return <Rich {...vm.data} />;
  }
}
