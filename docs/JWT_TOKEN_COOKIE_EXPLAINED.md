# JWT、Access Token、Cookie 完整拆解

## 核心結論

```
JWT ≠ Access Token ≠ Cookie
```

- **JWT** 是一種「資料格式」
- **Access Token** 是一種「用途 / 身分憑證角色」
- **Cookie** 是一種「傳輸與儲存方式」

它們在不同層級，所以名字才會重疊但不衝突。

---

## 一、Token 這個詞的本質

**token** 這個字本身，只代表一件事：

> 「一段可以代表某個身分或權限的字串」

它沒有規定：
- 長什麼樣
- 放哪裡
- 用來幹嘛

所以才會出現很多種「token」。

---

## 二、Access Token（角色 / 用途）

### 定義

```
Access Token = 用來「代表使用者身分，存取受保護資源」的憑證
```

關鍵是**用途**，不是格式。

### Access Token 需要具備什麼？

- 能讓後端知道「你是誰」
- 能判斷是否過期
- 能驗證是否被竄改

### Access Token 沒有規定

- 一定要是 JWT
- 一定要長怎樣
- 一定要放哪

👉 **Access Token 是「角色」**

---

## 三、JWT（格式 / 表現方式）

### 全名

**JSON Web Token**

### JWT 是什麼？

> 一種把資料包進字串裡的「格式規範」

它規定：
- 怎麼編碼（Base64）
- 資料放哪（payload）
- 怎麼驗證沒被改（signature）

### JWT 裡通常會放

```json
{
  "sub": "user_123",
  "exp": 1712345678,
  "scope": ["user"]
}
```

### 關鍵點（非常重要）

JWT 本身「不等於」Access Token

而是：

```
JWT「常常被用來當」Access Token
```

---

## 四、為什麼會覺得「JWT 本身就是 token」？

因為在實務上，大家常常這樣用：

```
Access Token（用途）
└── 用 JWT（格式）來實作
```

然後就開始口語上亂講：
- 「JWT token」
- 「傳 JWT 當 token」

👉 這是業界語言不嚴謹造成的混亂

---

## 五、Cookie（傳輸 / 儲存機制）

### Cookie 不是 token

Cookie 是：

> 瀏覽器幫你保存並自動傳送資料的一種機制

### 它可以裝

- Session ID
- JWT
- CSRF token
- 任何字串

### Cookie 解決的是

- 資料放哪
- 要不要自動送

### 而不是

- 資料代表什麼身分

---

## 六、三者的層級關係（關鍵）

```
Access Token  ←（用途 / 角色）
    ↑
   JWT         ←（格式 / 表現）
    ↑
 Cookie / Header / Memory ←（存放與傳輸方式）
```

---

## 七、常見的三種組合

### 1️⃣ 傳統網站（Session Cookie）

- Cookie 裡放：`SESSION_ID`
- Access Token：❌（沒有這個概念）
- JWT：❌

👉 身分資料存在後端

---

### 2️⃣ SPA + API（Bearer + JWT）

- Access Token：✅
- 格式：JWT
- 傳輸：`Authorization: Bearer <JWT>`
- Cookie：❌（或只用來放 CSRF）

👉 身分資料存在 token 裡

---

### 3️⃣ Cookie + JWT（混合型）

- Cookie 裡放：JWT
- JWT 當 Access Token
- 瀏覽器自動送
- 需要 CSRF

👉 很多「演進中的系統」會長這樣

---

## 八、為什麼不能只用 JWT 就好？

因為 JWT 只解決一件事：

> 「我怎麼把身分資料包進一段字串」

但它不解決：
- 放哪裡？
- 會不會自動送？
- 要不要防 CSRF？
- 要不要後端存狀態？

這些才是 cookie / access token / bearer 在解的問題。

---

## 九、一句話定錨（請記住）

```
JWT 是「長相」
Access Token 是「用途」
Cookie 是「載具」
```

換句話說：

> **JWT 不是令牌的「身分」，只是令牌的「長相」**
> **Access Token 才是令牌在系統裡的角色**
> **Cookie 和 Bearer 則決定「這個令牌怎麼被帶出去」**

當你看到「JWT token」，腦中自動翻譯成：

> 「一個用 JWT 格式實作的 Access Token」

---

## 十、實務應用

### 完整流程範例

```javascript
// 1. 登入取得 JWT (格式)
const response = await login({ username, password });
const jwt = response.data.token; // 這是一個 JWT

// 2. JWT 被用作 Access Token (用途)
// 3. 透過 Cookie 傳輸 (載具)
document.cookie = `token=${jwt}; HttpOnly; Secure`;

// 或者透過 Header 傳輸
headers: {
  'Authorization': `Bearer ${jwt}`
}
```

### 層級對照

| 層級 | 概念 | 實務範例 |
|------|------|----------|
| 用途 | Access Token | 代表使用者身分的憑證 |
| 格式 | JWT | `eyJhbGci...` |
| 載具 | Cookie / Header | `Cookie: token=xxx` 或 `Authorization: Bearer xxx` |

---

## 總結

理解這三個概念的關鍵在於：

1. 它們處於不同的抽象層級
2. 它們可以組合使用
3. 不要被口語化的「JWT token」混淆
4. 永遠問自己：這個 token 是「用途」還是「格式」還是「載具」？
