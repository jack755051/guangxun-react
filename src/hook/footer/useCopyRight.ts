import type { ICopyRight } from "@/model/view-model/footer.view-model";

export function useCopyRight() {
  function copyRightText(data: ICopyRight): string {
    const currentYear = new Date().getFullYear();
    const copyrightSymbol = "\u00A9"; // © 符號的 Unicode

    if (data.startYear && data.startYear < currentYear) {
      return `${data.startYear} - ${currentYear} ${copyrightSymbol} ${data.companyName}`;
    }

    return `${currentYear} ${copyrightSymbol} ${data.companyName}`;
  }

  return {
    copyRightText,
  };
}
