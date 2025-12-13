/**
 * 從瀏覽器的 document.cookie 字串中，安全地讀出某一個指定名稱的 Cookie 值
 * @param name
 * @returns
 */
export function getCookies(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}
