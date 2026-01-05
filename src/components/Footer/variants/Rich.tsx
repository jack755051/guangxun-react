import type { blockRich } from "@/model/view-model/footer.view-model";
import { CopyRightBlock } from "@/components/Footer/blocks/CopyRightBlock";
import { RouterListBlock } from "@/components/Footer/blocks/RouterListBlock";
import { ContactInfoBlock } from "@/components/Footer/blocks/ContactInfoBlock";

export function Rich(props: blockRich) {
  return (
    <footer className="flex flex-col w-full bg-background px-10">
      <div className="flex py-6">
        {/* 聯絡方式區塊 */}
        <div className="w-[50%]">
          <ContactInfoBlock
            {...props.contactInfo}
            className={{
              wrapper: "grid grid-cols-2 gap-4",
              title: "text-xl mb-6 text-primary-foreground",
              value: "text-sm text-primary-foreground",
              label: "text-sm text-primary",
              listItem: "flex space-x-2 text-primary-foreground",
              listItemLabel: "text-sm text-primary-foreground",
              listItemValue: "text-xs text-primary-foreground",
            }}
          />
        </div>
        {/* 路由連結區塊 */}
        <div className="flex-1">
          <RouterListBlock
            {...props}
            className={{
              nav: "space-y-6",
              title: "text-xl mb-6 text-primary-foreground",
              grid: "gap-8",
              group: "space-y-2",
              groupTitle: "text-md text-primary",
              list: "space-y-2 text-secondary-foreground ",
            }}
          />
        </div>
      </div>
      {/* 版權區塊 */}
      <div className="border-t border-gray-200 dark:border-gray-700 py-2 text-center ">
        <CopyRightBlock {...props} />
      </div>
    </footer>
  );
}
