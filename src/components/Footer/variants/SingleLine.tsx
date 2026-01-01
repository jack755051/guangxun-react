import { CopyRightBlock } from "@/components/Footer/blocks/CopyRightBlock";
import { type ICopyRight } from "@/model/view-model/footer.view-model";

export function SingleLine(props: ICopyRight) {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 text-center">
        <CopyRightBlock {...props} />
      </div>
    </footer>
  );
}
