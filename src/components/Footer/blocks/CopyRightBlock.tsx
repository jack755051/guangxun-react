import { useCopyRight } from "@/hook/footer";
import type { ICopyRight } from "@/model/view-model/footer.view-model";

/* 聯絡方式區塊 */
export function CopyRightBlock(props: ICopyRight) {
  const { copyRightText } = useCopyRight();
  return <div>{copyRightText(props)}</div>;
}
