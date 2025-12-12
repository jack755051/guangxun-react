# 開發思考架構

## 過渡性架構設計：從簡易開發到 CMS 化

### 以 Footer 組件為例

## 核心設計理念

### 1. 渲染策略與數據映射

先用「風格/版型（variant）」決定渲染策略，再將資料映射成對應的 `FooterViewModel`（使用 union / discriminated union 模式）。

```typescript
// 使用 FooterCmsType 作為 ViewModel 的 discriminator
type FooterViewModel =
  | { type: 'simple'; data: SimpleFooterData }
  | { type: 'complex'; data: ComplexFooterData }
```

### 2. 為什麼必須有 `fallbackFooter`？

#### 數據流安全性保證

```text
CMS → FooterCmsDTO → mapper → UI
                       ↑
                  唯一安全回傳點
```

#### 關鍵原因

1. **防止 UI 崩潰**
   如果 mapper 回傳 `undefined`、`null` 或結構不完整的 ViewModel → UI 會直接崩潰

2. **存在目的**
   不管 CMS 傳來什麼數據（即使是無效或損壞的），都能回傳一個「100% 可渲染」的 `FooterViewModel`

3. **白話定義**
   > 當無法確定 CMS 數據是否可用時，提供一個最安全、最簡單、永遠能正常渲染的 footer

## Mapper 處理流程

完整的數據轉換管線包含四個階段：

### 1. Sanitize（清洗）

移除或修正無效數據，確保數據格式正確

### 2. Validate（驗證）

檢查數據是否符合業務規則與型別定義

### 3. Policy Limit（策略限制）

應用業務策略限制（如最大項目數、字數限制等）

### 4. Fallback（降級/保底輸出）

當前述步驟失敗時，使用 `fallbackFooter` 確保系統穩定性

## 設計優勢

- **型別安全**：使用 discriminated union 確保編譯時期的型別檢查
- **容錯性**：透過 fallback 機制保證 UI 永不崩潰
- **可維護性**：清晰的數據流向與轉換邏輯
- **擴展性**：易於新增新的 Footer 變體類型
