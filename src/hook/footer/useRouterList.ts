import type { IRouter } from "@/model/view-model/footer.view-model";

export function useRouterList() {
  function getRouters(): IRouter[] {
    return [];
  }

  return {
    getRouters,
  };
}
