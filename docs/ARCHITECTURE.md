# 組合式區塊架構（Compositional Block Architecture）

## 設計原則

本專案採用 **組合式區塊架構**，每個 ViewModel 都由多個原子區塊（Atomic Blocks）組合而成。

### 核心理念

1. **原子區塊（Atomic Blocks）**：定義最小可重用的數據單元
2. **組合式組裝**：每個 `kind` 自由選擇所需的區塊組合
3. **類型安全**：使用 TypeScript 的 Discriminated Union 保證類型推斷

---

## Footer 架構範例

### 原子區塊定義

```typescript
// 版權文字區塊
interface BlockCopyRight {
  copyRight: string;
}

// 路由連結區塊
interface BlockRouterList {
  routerList: RouterList[];
}

// 聯絡方式區塊
interface BlockContactInfo {
  contactInfo: RichContactInfo;
}
```

### 組合式 ViewModel

```typescript
// 單行版權：只需要版權區塊
interface FooterSingleLineVM extends FooterBaseVM<"single_line", BlockCopyRight> {}

// 連結版：版權 + 路由連結
interface FooterLinksVM extends FooterBaseVM<"links", BlockCopyRight & BlockRouterList> {}

// 豐富版：版權 + 聯絡方式 + 路由連結
interface FooterRichVM extends FooterBaseVM<"rich", BlockCopyRight & BlockContactInfo & BlockRouterList> {}
```

---

## Header 架構範例

### 原子區塊定義

```typescript
interface BlockLogo { logo: HeaderLogo }
interface BlockNav { nav: HeaderNavItem[] }
interface BlockAuth { auth: HeaderAuth }
interface BlockSearch { search: HeaderSearch }
```

### 組合式 ViewModel

```typescript
// 基礎版：Logo + 導航
interface HeaderLogoAndNavVM extends HeaderBaseVM<"logo_and_nav", BlockLogo & BlockNav> {}

// 帶認證：Logo + 導航 + 認證按鈕
interface HeaderWithAuthVM extends HeaderBaseVM<"with_auth", BlockLogo & BlockNav & BlockAuth> {}

// 帶搜尋：Logo + 導航 + 搜尋框
interface HeaderWithSearchVM extends HeaderBaseVM<"with_search", BlockLogo & BlockNav & BlockSearch> {}

// 完整版：所有區塊
interface HeaderFullVM extends HeaderBaseVM<"full", BlockLogo & BlockNav & BlockAuth & BlockSearch> {}
```

---

## 優勢分析

### ✅ 相比獨立型別設計

| 特性 | 獨立型別 | 組合式區塊 |
|-----|---------|-----------|
| 代碼重複 | 高（每個類型重複定義） | 低（區塊可重用） |
| 擴展性 | 差（新增類型需完整定義） | 優（組合現有區塊） |
| 語意清晰度 | 優 | 優 |

### ✅ 相比漸進式繼承設計

| 特性 | 漸進式繼承 | 組合式區塊 |
|-----|-----------|-----------|
| 彈性 | 差（強制繼承關係） | 優（自由組合） |
| 適用場景 | 功能疊加 | 區塊組合 |
| 類型推斷 | 需手動定義繼承鏈 | 天然支援 |

---

## 使用指南

### 何時使用組合式區塊？

✅ **適用場景：**
- CMS 可能回傳不同區塊組合的數據
- UI 組件需要靈活組合不同功能模組
- 未來需求可能新增新的區塊組合

❌ **不適用場景：**
- UI 結構完全不同的變體（建議使用獨立型別）
- 功能必須按順序疊加（考慮漸進式繼承）

### 新增區塊步驟

1. **定義原子區塊**
```typescript
interface BlockNewFeature {
  newFeature: NewFeatureData;
}
```

2. **組合到 ViewModel**
```typescript
interface MyNewVM extends BaseVM<"new_type", BlockA & BlockB & BlockNewFeature> {}
```

3. **更新 CMS DTO 和 Mapper**

4. **在 UI 組件中渲染新區塊**

---

## 最佳實踐

1. **命名規範**
   - 區塊介面：`Block[功能名稱]`
   - ViewModel：`[組件名稱][變體名稱]VM`

2. **區塊粒度**
   - 一個區塊應包含單一職責的數據
   - 避免區塊過大或過小

3. **類型安全**
   - 始終使用 Discriminated Union (`kind` 字段)
   - 善用 TypeScript 的類型推斷

4. **組件開發**
   - 優先抽離區塊組件（如 `<ContactInfoBlock />`）
   - 在主組件中組合區塊組件

---

## 未來擴展範例

### 新增「只有聯絡方式」的 Footer

```typescript
// 1. 區塊已存在，無需新增

// 2. 新增 ViewModel
interface FooterContactOnlyVM extends FooterBaseVM<"contact_only", BlockContactInfo> {}

// 3. 更新 Union Type
type FooterViewModel = ... | FooterContactOnlyVM;

// 4. 更新 CMS DTO
type FooterCmsType = ... | "contact_only";
```

就這麼簡單！
