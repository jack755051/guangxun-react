## Model 架構

### 目錄結構

```
src/
├── model/
│   ├── dto/          # Data Transfer Objects - CMS 原始資料結構
│   │   └── cms.dto.ts
│   ├── domain/       # Domain Model - 業務邏輯模型 (可選)
│   ├── view-model/   # ViewModel - UI 顯示用的資料結構
│   │   └── common.view-model.ts
│   └── mappers/      # 資料轉換邏輯 (DTO → ViewModel)
│       └── footer.mapper.ts
```

### 各層說明

#### 1. DTO (Data Transfer Objects)

- **用途**：定義從 CMS/API 接收的原始資料結構
- **特點**：與後端 Schema 一致，不包含業務邏輯
- **範例**：`cms.dto.ts` - CMS 回傳的資料格式

#### 2. Domain (Domain Model)

- **用途**：核心業務邏輯模型
- **特點**：包含業務規則和驗證邏輯
- **使用時機**：當需要複雜的業務邏輯處理時

#### 3. ViewModel

- **用途**：為 UI 組件優化的資料結構
- **特點**：扁平化、易於渲染、包含 UI 需要的計算屬性
- **範例**：`common.view-model.ts` - 通用的 UI 資料模型

#### 4. Mappers

- **用途**：負責不同層級間的資料轉換
- **特點**：純函數，單一職責
- **範例**：`footer.mapper.ts` - 將 CMS DTO 轉換為 Footer ViewModel

### 資料流向

```
CMS/API Response (DTO)
        ↓
   [Mapper]
        ↓
   ViewModel
        ↓
   React Component
```

### 使用範例

```typescript
// 1. 定義 DTO
// dto/cms.dto.ts
export interface FooterDTO {
  contact_info: {
    phone: string;
    email: string;
  };
}

// 2. 定義 ViewModel
// view-model/common.view-model.ts
export interface FooterViewModel {
  phone: string;
  email: string;
}

// 3. 建立 Mapper
// mappers/footer.mapper.ts
export const mapFooterDTOToViewModel = (dto: FooterDTO): FooterViewModel => ({
  phone: dto.contact_info.phone,
  email: dto.contact_info.email,
});

// 4. 在組件中使用
// components/Footer.tsx
const footerData = mapFooterDTOToViewModel(cmsData);
```
