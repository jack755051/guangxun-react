/**
 * 替換 URL 中的參數佔位符
 * @example
 * replaceParams("/api/:userId/posts/:postId", { userId: "123", postId: "456" })
 * // => "/api/123/posts/456"
 */
export const replaceParams = (url: string, params: Record<string, string | number>): string => {
  return Object.entries(params).reduce((result, [key, value]) => {
    return result.replace(`:${key}`, String(value));
  }, url);
};

export enum APIURL {
  FOOTER = "/footer",
  // 示例：如果未來有帶參數的 API
  // USER_DETAIL = "/user/:userId",
  // POST_DETAIL = "/posts/:postId/comments/:commentId",
}