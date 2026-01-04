import { CopyRightBlock } from "@/components/Footer/blocks/CopyRightBlock";
import { type ICopyRight } from "@/model/view-model/footer.view-model";

export function SingleLine(props: ICopyRight) {
  return (
    <footer className="flex px-10">
      <div className="container mx-auto py-4 text-center">
        <CopyRightBlock {...props} />
      </div>
    </footer>
  );
}
