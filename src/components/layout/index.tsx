import {
  IconBell,
  IconHelpCircle,
  IconHome,
  IconHistogram,
  IconLive,
  IconSetting,
  IconSemiLogo,
} from "@douyinfe/semi-icons";
import { Layout, Nav, Avatar, Typography } from "@douyinfe/semi-ui";
import { PropsWithChildren } from "react";
import { useMediaQuery } from "react-responsive";

export const MainLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  if (!isDesktopOrLaptop) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Typography>
          Trang web này chưa dùng được trên màn hình cỡ nhỏ
        </Typography>
      </div>
    );
  }
  const { Sider, Content } = Layout;
  return (
    <Layout style={{ height: "100vh" }}>
      <Sider style={{ backgroundColor: "var(--semi-color-bg-1)" }}>
        <Nav
          defaultSelectedKeys={["Home"]}
          style={{ height: "100%" }}
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
        >
          <Nav.Header
            style={{
              paddingTop: "1.35rem",
              paddingBottom: "1.35rem",
            }}
            logo={<IconSemiLogo style={{ fontSize: 36 }} />}
            text="Vạn Phú Bình"
          ></Nav.Header>
          <Nav.Footer>
            <Nav.Item>
              <Avatar color="orange" size="small">
                YJ
              </Avatar>
            </Nav.Item>
          </Nav.Footer>
        </Nav>
      </Sider>
      <Content>{children}</Content>
    </Layout>
  );
};
