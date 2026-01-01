import type { blockRich } from "@/model/view-model/footer.view-model";
import { CopyRightBlock } from "@/components/Footer/blocks/CopyRightBlock";
import { RouterListBlock } from "@/components/Footer/blocks/RouterListBlock";
import { ContactInfoBlock } from "@/components/Footer/blocks/ContactInfoBlock";

export function Rich(props: blockRich) {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 聯絡方式區塊 */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h3>
            <ContactInfoBlock info={props.contactInfo} />
          </div>

          {/* 路由連結區塊 */}
          <div className="lg:col-span-3">
            <RouterListBlock {...props} />
          </div>
        </div>

        {/* 版權區塊 */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 text-center">
          <CopyRightBlock {...props} />
        </div>
      </div>
    </footer>
  );
}
