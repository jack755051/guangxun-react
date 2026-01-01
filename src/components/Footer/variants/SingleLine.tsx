import { CopyRightBlock } from "@/components/Footer/blocks/CopyRightBlock.tsx";
import { type ICopyRight } from "@/model/view-model/footer.view-model";

export function SingleLine(props: ICopyRight) {
  return (
    <footer className="single__line__wrapper">
      <CopyRightBlock {...props} />
    </footer>
  );
}
