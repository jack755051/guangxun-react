import { useCopyRight } from "@/hook/footer";
import type { ICopyRight } from "@/model/view-model/footer.view-model";

/* 版權區塊 */
export function CopyRightBlock(props: ICopyRight) {
  const { copyRightText } = useCopyRight();
  return (
    <div className="text-sm text-gray-600 dark:text-gray-400">
      {copyRightText(props)}
    </div>
  );
}
