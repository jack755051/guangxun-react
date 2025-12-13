# Cookie / CSRF / Access Token / Bearer / JWT 關係整理

> 本文件目的：  
> **釐清 Cookie、CSRF、Access Token、Bearer、JWT 各自的角色，以及它們之間的關係與分工。**

---

## 一、先給最重要的結論（一句話版）

> **Cookie / Access Token / JWT：驗證「你是誰」**  
> **Bearer：告訴後端「token 是怎麼帶來的」**  
> **CSRF：驗證「這個請求是不是你真的自己送的」**

它們不是重複，而是在解決「不同層次的安全問題」。

---

## 二、後端在乎的三個核心問題

每一個 HTTP request，後端其實只在判斷這三件事：

1. **你是誰？（身份驗證 / Authentication）**
2. **這個請求是不是你本人主動送的？（CSRF / 意圖驗證）**
3. **這個請求是怎麼被帶過來的？（自動 or 主動）**

下面的每一個名詞，都對應其中一個問題。

---

## 三、Cookie 是什麼？（身份的一種）

### 角色

- **身份驗證**
- 通常搭配 server-side session

### 特性

- 瀏覽器 **自動帶上**
- 後端看到 cookie 就認得你
- 前端 JS 不一定能讀（HttpOnly）

### 問題

- 因為「自動送出」，容易被 **CSRF 攻擊**

### 常見用途

- 傳統網站
- SSR
- 使用者登入狀態

---

## 四、Access Token 是什麼？（另一種身份）

### 角色

- **身份驗證**
- 通常用於 API / SPA / Mobile App

### 特性

- **不會自動送**
- 必須由前端主動加入 request
- 常放在 Header

```http
Authorization: Bearer <access_token>
```

### 銀行比喻（理解 Access Token 的關鍵）

把 Access Token 想成：你本人親手拿在手上、主動遞給銀行櫃檯的證件。

對比前一節提到的 Cookie：

- **Cookie**
  - 像是你一走進銀行，櫃檯就「自動認得你」
  - 不需要你主動出示任何東西
  - 對應到瀏覽器「自動帶上 cookie」
- **Access Token**
  - 是你「決定要不要出示證件」
  - 並且「親手交給櫃員」
  - 對應到前端程式主動把 token 放進 Header

這個差異帶來兩個非常重要的結果：

1. **Access Token 不容易被濫用**
   - 壞人無法要求銀行「自動替你遞證件」
   - 因為證件不會自己跑到櫃檯
2. **Access Token 幾乎不會有 CSRF 問題**
   - CSRF 的前提是「瀏覽器會自動幫你送請求」
   - Access Token 不符合這個前提

### 問題

- 如果被 **XSS** 偷走，攻擊者可以直接使用
- 需要妥善保管（通常存在 memory 或 secure storage）

### 常見用途

- RESTful API
- SPA（Single Page Application）
- Mobile App

---

## 五、Bearer 是什麼？（傳遞方式的聲明）

### 角色

- **告訴後端這個 token 是怎麼帶來的**
- 不是驗證方式，而是一種「協議規範」

### 特性

```http
Authorization: Bearer <token>
```

- `Bearer` 只是一個關鍵字
- 意思是：「我持有這個 token，請驗證它」
- 後端看到 `Bearer`，就知道要用什麼方式解析 token

### 常見誤解

**誤解**：Bearer 是一種加密方式
**正確**：Bearer 只是 HTTP Header 的一種格式約定

---

## 六、JWT 是什麼？（Token 的實作方式）

### 角色

- **Access Token 的一種實作格式**
- 是一種「自包含」的 token

### 特性

- 結構：`header.payload.signature`
- 可以在不查詢資料庫的情況下驗證
- 內含使用者資訊（claims）

### 範例

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### 問題

- **無法主動撤銷**（除非搭配黑名單機制）
- 一旦發出，在過期前都有效
- payload 可以被解碼（所以不能放敏感資訊）

### 常見用途

- 微服務架構
- 無狀態 API
- 分散式系統

---

## 七、CSRF 是什麼？（攻擊手法與防禦）

### 角色

- **驗證「這個請求是不是使用者本人主動送的」**
- 不是身份驗證，而是「意圖驗證」

### 攻擊原理

1. 你已登入銀行網站（有 cookie）
2. 你不小心點了惡意網站的連結
3. 惡意網站偷偷對銀行發送請求
4. **瀏覽器自動帶上你的 cookie**
5. 銀行以為是你本人操作

### 防禦方式

#### CSRF Token

```html
<form>
  <input type="hidden" name="csrf_token" value="random_token_123" />
</form>
```

- 伺服器產生一個隨機 token
- 放在表單中
- 提交時一起驗證

#### SameSite Cookie

```http
Set-Cookie: sessionId=abc123; SameSite=Strict
```

- `Strict`：完全不允許跨站請求帶 cookie
- `Lax`：只允許安全的跨站請求（如 GET）

### 為什麼 Access Token 不需要 CSRF？

- Access Token 需要前端「主動」放進 Header
- 惡意網站無法控制你的 JS code
- 所以無法偷偷送出帶有 token 的請求

---

## 八、總結：它們之間的關係

| 名詞 | 解決的問題 | 層次 |
|------|-----------|------|
| **Cookie** | 你是誰（自動帶上） | 身份驗證 |
| **Access Token** | 你是誰（主動帶上） | 身份驗證 |
| **JWT** | Access Token 的實作方式 | 技術細節 |
| **Bearer** | 告訴後端 token 怎麼帶來的 | 傳輸協議 |
| **CSRF** | 這個請求是不是你本人送的 | 意圖驗證 |

### 實務組合

#### 傳統網站（SSR）

```text
Cookie + CSRF Token
```

#### 現代 SPA

```text
Access Token (JWT) + Bearer + 存在 memory
```

#### 混合方式（常見）

```text
Refresh Token (HttpOnly Cookie)
+ Access Token (JWT in memory)
+ CSRF Token (for refresh endpoint)
```

---

## 九、實務建議

### 如果你在做 SPA / API

1. 使用 **JWT** 作為 Access Token
2. 放在 **Authorization: Bearer** header
3. **不要**存在 localStorage（有 XSS 風險）
4. 存在 **memory** 或 **sessionStorage**
5. 搭配 **Refresh Token**（放 HttpOnly cookie）

### 如果你在做傳統網站

1. 使用 **Cookie** + **Session**
2. 必須加上 **CSRF Token**
3. 設定 **SameSite=Strict** 或 **Lax**
4. 設定 **HttpOnly** 和 **Secure**

### 如果你要最高安全性

```text
Access Token (短效，5-15分鐘)
+ Refresh Token (長效，HttpOnly Cookie)
+ CSRF Token (保護 refresh endpoint)
+ SameSite Cookie
```

---

## 十、常見錯誤理解

### 錯誤 1

> "JWT 就是 Bearer token"

**正確**：JWT 是 token 的內容格式，Bearer 是傳遞方式的聲明

### 錯誤 2

> "用了 HTTPS 就不需要 CSRF 防護"

**正確**：HTTPS 防止竊聽，但不防止 CSRF（因為 cookie 還是會自動送出）

### 錯誤 3

> "Access Token 放 localStorage 很安全"

**正確**：localStorage 可以被 XSS 攻擊讀取，應該放 memory

### 錯誤 4

> "Cookie 就是 session"

**正確**：Cookie 是儲存機制，Session 是伺服器端的狀態管理

---

## 參考資源

- [RFC 6750 - Bearer Token Usage](https://tools.ietf.org/html/rfc6750)
- [RFC 7519 - JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519)
- [OWASP - CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [MDN - HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
