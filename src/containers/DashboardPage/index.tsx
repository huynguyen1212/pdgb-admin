import { useQuery } from "@tanstack/react-query";
import { Card, Col, Divider, Row, Statistic } from "antd";
import { requestToken } from "../../configs/api";
import SolveTaskChart from "./SolveTaskChart";
import UserRegisterChart from "./UserRegisterChart";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryFn: () => requestToken({ method: "GET", url: "/admin/dashboard" }),
  });

  if (isLoading) {
    return <h5>Loading...</h5>;
  }

  const k = [
    { label: "Số người dùng", value: data?.data?.user || 0 },
    { label: "Số dư ví", value: data?.data?.balance || 0 },
    { label: "Số tiền đã nạp", value: data?.data?.totalDeposit || 0 },
    { label: "Số lần truy cập", value: data?.data?.visit || 0 },
    { label: "Số lần giải rubik's", value: data?.data?.solveTask || 0 },
  ];

  return (
    <div>
      <h3>Tổng quan</h3>
      <Row gutter={16}>
        {k.map((a, i) => (
          <Col key={i} span={4}>
            <Card bordered={false}>
              <Statistic title={a.label} value={a.value || 0} />
            </Card>
          </Col>
        ))}
      </Row>
      <Divider />
      <Row>
        <Col span={12}>
          <UserRegisterChart />
        </Col>
        <Col span={12}>
          <SolveTaskChart />
        </Col>
      </Row>
    </div>
  );
}
