import {
  AuditOutlined,
  FolderOpenOutlined,
  UserOutlined,
  PullRequestOutlined,
  DeleteOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
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
import { Outlet, useNavigate, Link } from "react-router-dom";

import NewsPage from "../../containers/ListClubs";
import ImageManagePage from "../../containers/ImageManagePage";
import AccountPage from "../../containers/AccountPage";
const { Header, Footer } = Layout;

type MenuItem = {
  label: React.ReactNode;
  key: React.Key;
  icon?: React.ReactNode;
  children?: MenuItem[];
  componnent?: React.ReactNode;
  isnavbar?: boolean;
};

const pages: MenuItem[] = [
  {
    label: <Link to={"/clubs"}>Quản lý Clubs</Link>,
    key: "clubs",
    icon: <AuditOutlined />,
    componnent: <NewsPage />,
    isnavbar: true,
  },
  {
    label: "Requests",
    key: "requests",
    icon: <PullRequestOutlined />,
    componnent: <NewsPage />,
    children: [
      {
        label: <Link to={"/request-create-clubs"}>Tạo club</Link>,
        key: "request-create-clubs",
        icon: <AppstoreAddOutlined />,
        componnent: <NewsPage />,
      },
      {
        label: <Link to={"/request-delete-clubs"}>Xóa club</Link>,
        key: "request-delete-clubs",
        icon: <DeleteOutlined />,
        componnent: <NewsPage />,
      },
    ],
  },
  {
    label: <Link to={"/matchs"}>Quản lý Matchs</Link>,
    key: "matchs",
    icon: <FolderOpenOutlined />,
    componnent: <ImageManagePage />,
    isnavbar: true,
  },
  {
    label: <Link to={"/users"}>Quản lý tài khoản</Link>,
    key: "users",
    icon: <UserOutlined />,
    componnent: <AccountPage />,
    isnavbar: true,
  },
];

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
