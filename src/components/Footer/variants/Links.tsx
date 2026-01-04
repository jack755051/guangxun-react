import type { blockLinks } from "@/model/view-model/footer.view-model";
import { CopyRightBlock } from "@/components/Footer/blocks/CopyRightBlock";
import { RouterListBlock } from "@/components/Footer/blocks/RouterListBlock";

export function Links(props: blockLinks) {
  return (
    <footer className="flex justify-center bg-background px-10">
      <div className="container flex flex-col py-4">
        {/* 路由連結區塊 */}
        <RouterListBlock
          {...props}
          className={{
            nav: "space-y-6",
            title: "text-xl mb-6",
            grid: "gap-8",
            group: "space-y-2",
            groupTitle: "text-md text-gray-600",
            list: "space-y-2 text-gray-400",
          }}
        />
        {/* 版權區塊 */}
        <div className="border-t border-gray-200 dark:border-gray-700 py-2 text-center">
          <CopyRightBlock {...props} />
        </div>
      </div>
    </footer>
  );
}
