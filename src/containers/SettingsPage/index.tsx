import { Collapse } from "antd";
import React from "react";
import ConfigWeb from "./ConfigWeb";

const { Panel } = Collapse;

const SettingsPage: React.FC = () => {
  const onChange = (key: string | string[]) => {
    console.log(key);
  };
  return (
    <Collapse defaultActiveKey={["1"]} onChange={onChange}>
      <Panel
        header={<h2 className="select-none">Cài đặt tổng quan</h2>}
        key="1"
      >
        <ConfigWeb />
      </Panel>
      <Panel
        header={<h2 className="select-none">Cài đặt HomePage</h2>}
        key="2"
      ></Panel>
    </Collapse>
  );
};

export default SettingsPage;
