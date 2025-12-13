import type { FooterViewModel } from "@/model/view-model/footer.view-model";

export function Footer(vm: FooterViewModel) {
  switch (vm.kind) {
    case "single_line":
      return <footer>{vm.data.copyRight}</footer>;
    case "links":
      return <footer>{/* render vm.data.links */}</footer>;
    case "rich":
      return <footer>{/* render vm.data.rich */}</footer>;
  }
}
