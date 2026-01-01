import type { ContactItem, IContactInfoBase } from "@/model/view-model/footer.view-model";

function ContactInfoItem({ label, value }: { label: string; value: string | ContactItem[] }) {
  const renderValue = () => {
    if (Array.isArray(value)) {
      return (
        <ul className="space-y-1 mt-1">
          {value.map((item, i) => (
            <li key={i} className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{item.label}:</span>{" "}
              <span>{item.value}</span>
            </li>
          ))}
        </ul>
      );
    }
    return <span className="text-gray-700 dark:text-gray-300">{value}</span>;
  };

  return (
    <div className="mb-3">
      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1">
        {label}
      </p>
      {renderValue()}
    </div>
  );
}

/* 聯絡方式區塊 */
export function ContactInfoBlock({ info }: { info: IContactInfoBase }) {
  return (
    <div className="space-y-2">
      {Object.entries(info).map(([key, value]) => (
        <ContactInfoItem key={key} label={key} value={value} />
      ))}
    </div>
  );
}