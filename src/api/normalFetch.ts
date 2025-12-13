import { ApiError } from "./client/error";
import { httpRequest } from "./client/http";

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: string;
};

export type NormalFetchOptions = Omit<Parameters<typeof httpRequest>[0], "path"> & {
  url: string; // path
};

export async function normalFetch<T>(options: NormalFetchOptions): Promise<ApiResponse<T>> {
  const { url, responseType = "json", ...rest } = options;

  const { data, status } = await httpRequest<unknown>({
    ...rest,
    path: url,
    responseType,
  });

  const isBinary = responseType === "blob" || responseType === "arrayBuffer";
  if (
    !isBinary &&
    data &&
    typeof data === "object" &&
    "success" in data &&
    data.success === false
  ) {
    throw new ApiError(status, "Business Error", data);
  }

  return data as ApiResponse<T>;
}
