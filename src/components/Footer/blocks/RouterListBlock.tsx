import { type IRouter, type IRouterItem } from "@/model/view-model/footer.view-model";
import React from "react";

/* 獨立出 Item 元件 */
function RouterItem({ data }: { data: IRouterItem }) {
  return (
    <li>
      <a href={data.link} title={data.alt}>
        {data.icon && <i className={data.icon} />}
        <span>{data.label}</span>
      </a>
    </li>
  );
}

/* 路由列表區塊 */
export function RouterListBlock(props: IRouter) {
  return (
    <div className="router__list__container">
      <p className="router__list--title py-2 px-1">{props.title}</p>
      <div className="router__list--router-container">
        {props.routers.map((group, pIdx) => (
          <React.Fragment key={pIdx}>
            <p>{group.routerListTitle}</p>
            <ul>
              {group.routers.map((item) => (
                <RouterItem key={item.link} data={item} />
              ))}
            </ul>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
