import type { ICopyRight } from "@/model/view-model/footer.view-model";

export function useCopyRight() {
  function copyRightText(data: ICopyRight): string {
    const currentYear = new Date().getFullYear();

    if (data.startYear && data.startYear < currentYear) {
      return `${data.startYear} - ${currentYear} &copy; ${data.companyName}`;
    }

    return `${currentYear} &copy; ${data.companyName}`;
  }

  return {
    copyRightText,
  };
}
