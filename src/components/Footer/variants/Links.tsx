import type { blockLinks } from "@/model/view-model/footer.view-model";
import { CopyRightBlock } from "@/components/Footer/blocks/CopyRightBlock";
import { RouterListBlock } from "@/components/Footer/blocks/RouterListBlock";

export function Links(props: blockLinks) {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* 路由連結區塊 */}
        <RouterListBlock {...props} />
        {/* 版權區塊 */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 text-center">
          <CopyRightBlock {...props} />
        </div>
      </div>
    </footer>
  );
}
