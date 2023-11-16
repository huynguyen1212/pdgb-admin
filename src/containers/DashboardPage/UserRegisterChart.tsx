import { Line, LineConfig } from "@ant-design/plots";
import { useEffect, useState } from "react";

export default function UserRegisterChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    fetch(
      "https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json"
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };

  const config: LineConfig = {
    data,
    padding: "auto",
    xField: "Date",
    yField: "scales",
    xAxis: {
      tickCount: 5,
    },
  };

  return (
    <div className="mt-[24px] ml-[24px] w-full">
      <h3>Người dùng đăng ký mới</h3>
      <Line {...config} />
    </div>
  );
}
