import type { blockLinks } from "@/model/view-model/footer.view-model";
import { CopyRightBlock } from "@/components/Footer/blocks/CopyRightBlock";
import { RouterListBlock } from "@/components/Footer/blocks/RouterListBlock";

export function Links(props: blockLinks) {
  return (
    <footer className="links__wrapper">
      {/* 路由連結區塊 */}
      <RouterListBlock {...props} />
      {/* 版權區塊 */}
      <CopyRightBlock {...props} />
    </footer>
  );
}
