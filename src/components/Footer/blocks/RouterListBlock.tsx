import { type IRouter, type IRouterItem } from "@/model/view-model/footer.view-model";
import { cn } from "@/lib/utils";

interface RouterBlockProps extends IRouter {
  className?: Record<string, string>;
}

/* 獨立出 Item 元件 */
function RouterItem({ data }: { data: IRouterItem }) {
  return (
    <li className="mb-2">
      <a
        href={data.link}
        title={data.alt}
        target={data.target}
        rel={data.target === "_blank" ? "noopener noreferrer" : undefined}
        className="link-base"
      >
        {data.icon && <i className={`${data.icon} mr-2`} />}
        {data.label}
      </a>
    </li>
  );
}

/* 路由列表區塊 */
export function RouterListBlock({ className, ...props }: RouterBlockProps) {
  return (
    <nav className={cn("flex flex-col", className?.nav)}>
      {props.title && (
        <h3 className={cn("text-lg font-semibold text-gray-900 dark:text-white", className?.title)}>
          {props.title}
        </h3>
      )}
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className?.grid)}>
        {props.routers.map((group, pIdx) => (
          <div key={pIdx} className={cn(className?.group)}>
            <h4 className={cn("font-semibold mb-3 px-3", className?.groupTitle)}>
              {group.routerListTitle}
            </h4>
            <ul className={cn("space-y-1", className?.list)}>
              {group.routers.map((item) => (
                <RouterItem key={item.link} data={item} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
