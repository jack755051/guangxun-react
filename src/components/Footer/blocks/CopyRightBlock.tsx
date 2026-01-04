import { useCopyRight } from "@/hook/footer";
import type { ICopyRight } from "@/model/view-model/footer.view-model";
import { cn } from "@/lib/utils.ts";

interface CopyRightBlockProps extends ICopyRight {
  className?: string; // 直接接受 className 字串
}

/* 版權區塊 */
export function CopyRightBlock({ className, ...props }: CopyRightBlockProps) {
  const { copyRightText } = useCopyRight();
  return (
    <div className={cn("text-sm text-gray-600 dark:text-gray-400", className)}>
      {copyRightText(props)}
    </div>
  );
}
