import type { ContactItem, IContactInfo } from "@/model/view-model/footer.view-model";
import { cn } from "@/lib/utils";

interface ContactInfoBlockProps extends IContactInfo {
  className?: Record<string, string>;
}

interface ContactInfoItemProps {
  label: string;
  value: string | ContactItem[];
  className?: Record<string, string>;
}

function ContactInfoItem({ label, value, className }: ContactInfoItemProps) {
  const renderValue = () => {
    if (Array.isArray(value)) {
      const validItems = value.filter((item) => item.label && item.value);
      if (validItems.length === 0) return null;

      return (
        <ul className={cn("space-y-1 mt-1", className?.list)}>
          {validItems.map((item, i) => (
            <li key={i} className={cn(className?.listItem)}>
              <span className={cn("text-gray-600", className?.listItemLabel)}>{item.label}:</span>{" "}
              <span className={cn("text-gray-400", className?.listItemValue)}>{item.value}</span>
            </li>
          ))}
        </ul>
      );
    }

    if (!value || (typeof value === "string" && value.trim() === "")) return null;
    return <span className={cn("text-gray-600", className?.value)}>{value}</span>;
  };

  return (
    <div className={cn("mb-3", className?.item)}>
      <p className={cn("text-sm font-semibold text-gray-800 uppercase", className?.label)}>
        {label}
      </p>
      {renderValue()}
    </div>
  );
}

/* 聯絡方式區塊 */
export function ContactInfoBlock({ title, info, className }: ContactInfoBlockProps) {
  const hasContent = info && Object.keys(info).length > 0;

  return (
    <div className={cn("space-y-4", className?.container)}>
      {title && (
        <h3 className={cn("text-lg font-semibold text-gray-900 dark:text-white", className?.title)}>
          {title}
        </h3>
      )}
      {hasContent && (
        <div className={cn("space-y-2", className?.wrapper)}>
          {Object.entries(info).map(([key, value]) => (
            <ContactInfoItem key={key} label={key} value={value} className={className} />
          ))}
        </div>
      )}
    </div>
  );
}
