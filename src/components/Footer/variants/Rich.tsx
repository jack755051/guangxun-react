import type { blockRich } from "@/model/view-model/footer.view-model";
import { CopyRightBlock } from "@/components/Footer/blocks/CopyRightBlock";
import { RouterListBlock } from "@/components/Footer/blocks/RouterListBlock";
import { ContactInfoBlock } from "@/components/Footer/blocks/ContactInfoBlock";

export function Rich(props: blockRich) {
  return (
    <footer className="rich__wrapper">
      {/* 聯絡方式區塊 */}
      <ContactInfoBlock info={props.contactInfo} />
      {/* 路由連結區塊 */}
      <RouterListBlock {...props} />
      {/* 版權區塊 */}
      <CopyRightBlock {...props} />
    </footer>
  );
}
