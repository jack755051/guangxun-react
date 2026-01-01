import { type IRouter, type IRouterItem } from "@/model/view-model/footer.view-model";

/* 獨立出 Item 元件 */
function RouterItem({ data }: { data: IRouterItem }) {
  return (
    <li className="mb-2">
      <a
        href={data.link}
        title={data.alt}
        target={data.target}
        className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-2"
      >
        {data.icon && <i className={data.icon} />}
        <span>{data.label}</span>
      </a>
    </li>
  );
}

/* 路由列表區塊 */
export function RouterListBlock(props: IRouter) {
  return (
    <nav className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {props.title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {props.routers.map((group, pIdx) => (
          <div key={pIdx}>
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
              {group.routerListTitle}
            </h4>
            <ul className="space-y-1">
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
