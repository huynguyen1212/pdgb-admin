import {
  AuditOutlined,
  FolderOpenOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import MyLayout from "./components/Layout";
import LoginPage from "./containers/LoginPage";
import NewsPage from "./containers/NewsPage";
import { NewsType } from "./configs/type";
import ImageManagePage from "./containers/ImageManagePage";
import AccountPage from "./containers/AccountPage";

type MenuItem = {
  label: React.ReactNode;
  key: React.Key;
  icon?: React.ReactNode;
  children?: MenuItem[];
  componnent?: React.ReactNode;
  isnavbar?: boolean;
};

export const pages: MenuItem[] = [
  {
    label: <Link to={"/clubs"}>Quản lý Clubs</Link>,
    key: "clubs",
    icon: <AuditOutlined />,
    componnent: <NewsPage type={NewsType.CONTENT} />,
    isnavbar: true,
  },
  {
    label: <Link to={"/matchs"}>Quản lý Matchs</Link>,
    key: "matchs",
    icon: <FolderOpenOutlined />,
    componnent: <ImageManagePage />,
    isnavbar: true,
  },
  {
    label: <Link to={"/account"}>Quản lý tài khoản</Link>,
    key: "account",
    icon: <UserOutlined />,
    componnent: <AccountPage />,
    isnavbar: true,
  },
];

const App: React.FC = () => {
  return (
    <Routes>
      <Route path={`/`} element={<LoginPage />} />;
      <Route element={<MyLayout />}>
        {pages.map((k, i) => {
          if (k?.children && k?.children?.length > 0) {
            return k.children?.map((l, j) => (
              <Route key={l.key} path={`${l.key}`} element={l.componnent} />
            ));
          }
          return <Route key={k.key} path={`${k.key}`} element={k.componnent} />;
        })}
      </Route>
      <Route path={`*`} element={<h1>404</h1>} />
    </Routes>
  );
};

export default App;
