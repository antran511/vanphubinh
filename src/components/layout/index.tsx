import {
  IconBell,
  IconHelpCircle,
  IconHome,
  IconHistogram,
  IconLive,
  IconSetting,
} from "@douyinfe/semi-icons";
import { Layout, Nav, Button, Breadcrumb, Avatar } from "@douyinfe/semi-ui";
import { PropsWithChildren } from "react";

export const MainLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { Header, Sider, Content } = Layout;
  return (
    <Layout style={{ height: "100vh" }}>
      <Sider style={{ backgroundColor: "var(--semi-color-bg-1)" }}>
        <Nav
          defaultSelectedKeys={["Home"]}
          style={{ maxWidth: 220, height: "100%" }}
          items={[
            { itemKey: "Home", text: "Home", icon: <IconHome size="large" /> },
            {
              itemKey: "Histogram",
              text: "Histogram",
              icon: <IconHistogram size="large" />,
            },
            { itemKey: "Live", text: "Live", icon: <IconLive size="large" /> },
            {
              itemKey: "Setting",
              text: "Setting",
              icon: <IconSetting size="large" />,
            },
          ]}
          header={{
            logo: (
              <img src="//lf1-cdn-tos.bytescm.com/obj/ttfe/ies/semi/webcast_logo.svg" />
            ),
            text: "Webcast",
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ backgroundColor: "var(--semi-color-bg-1)" }}>
          <Nav
            mode="horizontal"
            footer={
              <>
                <Button
                  theme="borderless"
                  icon={<IconBell size="large" />}
                  style={{
                    color: "var(--semi-color-text-2)",
                    marginRight: "12px",
                  }}
                />
                <Button
                  theme="borderless"
                  icon={<IconHelpCircle size="large" />}
                  style={{
                    color: "var(--semi-color-text-2)",
                    marginRight: "12px",
                  }}
                />
                <Avatar color="orange" size="small">
                  YJ
                </Avatar>
              </>
            }
          ></Nav>
        </Header>
        <Content>
          <Breadcrumb
            style={{
              marginBottom: "24px",
            }}
            routes={["Home", "Page Section", "Pagge Ssection", "Detail"]}
          />
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
