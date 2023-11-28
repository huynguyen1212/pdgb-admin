import React from "react";
import { Route, Routes } from "react-router-dom";

import MyLayout from "./components/Layout";
import LoginPage from "./containers/LoginPage";
import NewsPage from "./containers/ListClubs";
import RequestCreateClubsPage from "./containers/RequestCreateClub";
import RequestDeleteClubsPage from "./containers/RequestDeleteClub";
import DetailClub from "./containers/DetailClub";
import ListUsers from "./containers/ListUser";
import ListMatchs from "./containers/ListMatchs";

interface IPageRouter {
  label: string;
  key: string;
  component?: React.ReactNode;
  children?: IPageRouter[];
}

const PageRouter: IPageRouter[] = [
  {
    label: "Clubs",
    key: "clubs",
    component: <NewsPage />,
  },
  {
    label: "Detail club",
    key: "clubs/:id",
    component: <DetailClub />,
  },
  {
    label: "Request Create clubs",
    key: "request-create-clubs",
    component: <RequestCreateClubsPage />,
  },
  {
    label: "Request delete clubs",
    key: "request-delete-clubs",
    component: <RequestDeleteClubsPage />,
  },
  {
    label: "Quản lý Clubs",
    key: "clubs",
    component: <NewsPage />,
  },
  {
    label: "Matchs",
    key: "matchs",
    component: <ListMatchs />,
  },
  {
    label: "Users",
    key: "users",
    component: <ListUsers />,
  },
];

const App: React.FC = () => {
  return (
    <Routes>
      <Route path={`/`} element={<LoginPage />} />;
      <Route element={<MyLayout />}>
        {PageRouter.map((k, i) => {
          if (k?.children && k?.children?.length > 0) {
            return k.children?.map((l, j) => (
              <Route key={l.key} path={`${l.key}`} element={l?.component} />
            ));
          }
          return <Route key={k.key} path={`${k.key}`} element={k?.component} />;
        })}
      </Route>
      <Route path={`*`} element={<h1>404</h1>} />
    </Routes>
  );
};

export default App;
