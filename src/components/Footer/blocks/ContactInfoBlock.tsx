import type { ContactItem, IContactInfoBase } from "@/model/view-model/footer.view-model";

function ContactInfoItem({ label, value }: { label: string; value: string | ContactItem[] }) {
  // 邏輯封裝：如果是陣列就跑迴圈，如果是字串就直接顯示
  const renderValue = () => {
    if (Array.isArray(value)) {
      return (
        <ul className="contact-item__sub-list">
          {value.map((item, i) => (
            <li key={i}>
              <span className="sub-label">{item.label}：</span>
              <span className="sub-value">{item.value}</span>
            </li>
          ))}
        </ul>
      );
    }
    return <span className="contact-item__value">{value}</span>;
  };

  return (
    <div className="contact-item">
      <p className="contact-item__title">{label}</p>
      {renderValue()}
    </div>
  );
}

/* 聯絡方式區塊 */
export function ContactInfoBlock({ info }: { info: IContactInfoBase }) {
  return (
    <div className="contact-info-block">
      {Object.entries(info).map(([key, value]) => (
        // 將每一種類型的聯絡資訊抽成 Item
        <ContactInfoItem key={key} label={key} value={value} />
      ))}
    </div>
  );
}