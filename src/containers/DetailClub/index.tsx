import React, { useEffect, useState } from "react";
import { Segmented } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import ListTeams from "./teams";
import ListUsers from "./users";

const DetailClub = () => {
  const [activeTab, setActiveTab] = useState<number | string>(0);
  const navigate = useNavigate();
  useEffect(() => {
    setActiveTab("Teams");
  }, []);

  const handleChangeActiveTab = (tab: number | string) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div
        className="mt-2 mb-6 cursor-pointer"
        onClick={() => navigate("/clubs")}
      >
        <LeftOutlined className="mr-2" />
        <span>Quản lí club</span>
      </div>
      <Segmented
        options={["Teams", "Users"]}
        value={activeTab}
        onChange={handleChangeActiveTab}
        size="large"
      />
      {activeTab === "Teams" && <ListTeams />}
      {activeTab === "Users" && <ListUsers />}
    </>
  );
};

export default DetailClub;
