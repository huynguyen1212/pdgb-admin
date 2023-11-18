import {
  Button,
  Dropdown,
  Layout,
  Menu,
  MenuProps,
  message,
  theme,
} from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { pages } from "../../App";

const { Header, Footer } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

interface Props extends React.PropsWithChildren {}

export default function MyLayout(props: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const nav = useNavigate();
  // useEffect(() => {
  //   const isLogined = localStorage.getItem("token");
  //   if (!isLogined) {
  //     nav("/");
  //     message.error("Vui lòng đăng nhập lại.");
  //   }
  // }, []);
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <h1 className="text-white text-center p-[32px_12px_12px] text-lg">
          {collapsed ? "Admin" : "Admin"}
        </h1>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={pages || []}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: "Logout",
                  onClick: () => {
                    localStorage.removeItem("token");
                    nav("/");
                    message.error("Vui lòng đăng nhập lại.");
                  },
                },
              ],
            }}
            placement="bottomLeft"
          >
            <Button>Admin</Button>
          </Dropdown>
        </Header>
        <Content
          style={{ margin: "12px", background: "white", padding: "24px" }}
        >
          <Outlet />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          ©{new Date().getFullYear()} Created by HuyNQ{" "}
        </Footer>
      </Layout>
    </Layout>
  );
}
