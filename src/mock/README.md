# Footer Mock Data Testing Guide

## 🎯 Quick Start

目前數據流架構已完成：

```
Mock Data → API → Redux Store → Selector → ViewModel → Component
```

## 📝 如何測試不同的 Footer 變體

打開 `src/mock/footer.ts`，修改第 81 行：

```typescript
// 測試 Single Line 版本
export const mockFooterData: FooterCmsDTO = mockFooterSingleLine;

// 測試 Links 版本（當前）
export const mockFooterData: FooterCmsDTO = mockFooterLinks;

// 測試 Rich 版本（包含聯絡資訊）
export const mockFooterData: FooterCmsDTO = mockFooterRich;
```

儲存後，重新整理瀏覽器即可看到不同的 Footer 樣式。

## 🔄 數據流說明

### 1. Mock Data (開發階段)
- 位置：`src/mock/footer.ts`
- 三種預設數據：`mockFooterSingleLine`, `mockFooterLinks`, `mockFooterRich`
- 模擬 500ms API 延遲

### 2. API Service
- 位置：`src/api/footer.api.ts`
- 開發環境：自動使用 mock 數據
- 生產環境：調用真實 API `/footer`

### 3. Redux Store
- 位置：`src/store/footer/`
- `footerSlice.ts` - 定義 state 和 reducer
- `footerSelectors.ts` - DTO → ViewModel 轉換

### 4. Mapper
- 位置：`src/model/mappers/footer.mapper.ts`
- 將 CMS DTO 映射為組件使用的 ViewModel

### 5. Component
- 位置：`src/components/Footer/`
- `Footer.tsx` - 主入口
- `variants/` - 三種佈局變體
- `blocks/` - 可重用的區塊組件

## 🧪 測試清單

- [x] Single Line - 最簡單的版權聲明
- [x] Links - 包含導航連結
- [x] Rich - 包含聯絡資訊 + 導航連結

## 🚀 接下來的步驟

### 當 CMS 後端準備好時：

1. **修改環境變數** (或直接修改 `footer.api.ts`)
   ```typescript
   const USE_MOCK = false; // 改為 false
   ```

2. **確認 API 端點**
   - 檢查 `src/api/url.ts` 中的 `APIURL.FOOTER`
   - 默認為 `/footer`

3. **測試真實 API**
   - 後端應返回與 `FooterCmsDTO` 相同格式的 JSON

### 調整樣式（可選）

目前已有基本 Tailwind 樣式，如需調整：
- **Block 層級**：`src/components/Footer/blocks/*.tsx`
- **Variant 層級**：`src/components/Footer/variants/*.tsx`

## 📊 當前使用的 Variant

當前 mock 數據使用：**Links** (包含三個導航區塊)

可以看到：
- 關於我們 (關於我們、團隊介紹、聯絡我們)
- 產品服務 (產品列表、解決方案、定價方案)
- 資源中心 (部落格、文件、API)
