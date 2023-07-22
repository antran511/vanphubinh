import { Breadcrumb } from "../breadcrumb";
import { Menu } from "../menu";
import { PropsWithChildren } from "react";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="layout">
      <Menu />
      <div className="content">
        <Breadcrumb />
        <div>{children}</div>
      </div>
    </div>
  );
};
