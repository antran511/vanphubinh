import {
  IconHome,
  IconHistogram,
  IconLive,
  IconSetting,
  IconSemiLogo,
  IconMenu,
} from "@douyinfe/semi-icons";
import { Layout, Nav, Avatar, Button, SideSheet } from "@douyinfe/semi-ui";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

export const MainLayout: React.FC = ({ children }) => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const [visible, setVisible] = useState(false);
  const change = () => {
    setVisible(!visible);
  };

  const { Sider, Content, Header } = Layout;
  return (
    <Layout style={{ height: "100vh" }}>
      {!isDesktopOrLaptop ? (
        <Header style={{ backgroundColor: "var(--semi-color-bg-1)" }}>
          <div>
            <Nav mode="horizontal" defaultSelectedKeys={["Home"]}>
              <Nav.Header>
                <Button
                  icon={<IconMenu />}
                  aria-label="Screenshot"
                  onClick={change}
                />
              </Nav.Header>
              <Nav.Footer>
                <Avatar color="orange" size="small">
                  YJ
                </Avatar>
              </Nav.Footer>
            </Nav>
          </div>
          <SideSheet
            visible={visible}
            onCancel={change}
            size="small"
            placement="left"
            bodyStyle={{ padding: 0 }}
            headerStyle={{ display: "none" }}
            width={300}
          >
            <Nav
              defaultSelectedKeys={["Home"]}
              style={{ width: "100%", height: "100%" }}
              items={[
                {
                  itemKey: "Home",
                  text: "Home",
                  icon: <IconHome size="large" />,
                },
                {
                  itemKey: "Histogram",
                  text: "Histogram",
                  icon: <IconHistogram size="large" />,
                },
                {
                  itemKey: "Live",
                  text: "Live",
                  icon: <IconLive size="large" />,
                },
                {
                  itemKey: "Setting",
                  text: "Setting",
                  icon: <IconSetting size="large" />,
                },
              ]}
            >
              <Nav.Header
                style={{
                  paddingTop: "0.75rem",
                  paddingBottom: "0.5rem",
                }}
                logo={<IconSemiLogo style={{ fontSize: 36 }} />}
                text="Vạn Phú Bình"
              ></Nav.Header>
            </Nav>
          </SideSheet>
        </Header>
      ) : (
        <Sider style={{ backgroundColor: "var(--semi-color-bg-1)" }}>
          <Nav
            defaultSelectedKeys={["Home"]}
            style={{ maxWidth: 220, height: "100%" }}
            items={[
              {
                itemKey: "Home",
                text: "Home",
                icon: <IconHome size="large" />,
              },
              {
                itemKey: "Histogram",
                text: "Histogram",
                icon: <IconHistogram size="large" />,
              },
              {
                itemKey: "Live",
                text: "Live",
                icon: <IconLive size="large" />,
              },
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
      )}

      <Content>{children}</Content>
    </Layout>
  );
};
