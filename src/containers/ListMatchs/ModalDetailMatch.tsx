import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, Col, Form, Input, Modal, Row } from "antd";
import Table, { ColumnsType } from "antd/es/table";

interface IProps {
  open: boolean;
  data: any;
  handleClose: () => void;
}

const ModalDetailMatch = (props: IProps) => {
  const [form] = Form.useForm();
  const { open, data, handleClose } = props;
  const [status, setStatus] = useState<number>(0);
  const [teamOne, setTeamOne] = useState<any>([]);
  const [teamTwo, setTeamTwo] = useState<any>([]);

  useEffect(() => {
    if (open) {
      const {
        creator_member: member,
        sports_discipline: sport,
        venue,
        match_date: date,
        match_time: time,
        status_name: statusName,
        status,
        team_ones: teamOne,
        team_twos: teamTwo,
      } = data;
      form.setFieldsValue({
        name: member.name,
        email: member.email,
        venue,
        time: `${date} ${time}`,
        sport: sport.name,
        statusName,
      });
      setStatus(status);
      setTeamOne(teamOne);
      setTeamTwo(teamTwo);
    }
  }, [open]);

  const renderStatusColor = (value: number) => {
    let color = "";
    switch (value) {
      case 1:
        color = "rgb(34 197 94)";
        break;
      case 2:
        color = "rgb(14 165 233)";
        break;
      case 3:
        color = "rgb(239 68 68)";
        break;
      case 5:
        color = "rgb(139 92 246)";
        break;
      default:
        color = "rgb(34 197 94)";
    }
    return color;
  };

  const columns: ColumnsType<any> = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: "100px",
      render: (_: any, record: any, i) => i + 1,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text) => <div className="max-w-[300px]">{text}</div>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <div className="max-w-[300px]">{text}</div>,
    },
  ];

  return (
    <Modal
      title="Thông tin chi tiết trận đấu"
      open={open}
      onCancel={handleClose}
      centered
      footer={[
        <Button key="back" onClick={handleClose}>
          Đóng
        </Button>,
      ]}
      width={1000}
    >
      <div
        className="overflow-y-auto overflow-x-hidden"
        style={{ maxHeight: "600px" }}
      >
        <Form name="form_match" layout="vertical" form={form} className="mt-10">
          <Row gutter={[24, 0]}>
            <Col span={12}>
              <Form.Item
                label={<div className="capitalize font-[500]">Người tạo</div>}
                name={"name"}
              >
                <Input disabled bordered={false} style={{ color: "#000000" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<div className="capitalize font-[500]">Email</div>}
                name={"email"}
              >
                <Input disabled bordered={false} style={{ color: "#000000" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<div className="capitalize font-[500]">Địa điểm</div>}
                name={"venue"}
              >
                <Input disabled bordered={false} style={{ color: "#000000" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <div className="capitalize font-[500]">Thời gian diễn ra</div>
                }
                name={"time"}
              >
                <Input disabled bordered={false} style={{ color: "#000000" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<div className="capitalize font-[500]">Bộ môn</div>}
                name={"sport"}
              >
                <Input disabled bordered={false} style={{ color: "#000000" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<div className="capitalize font-[500]">Trạng thái</div>}
                name={"statusName"}
              >
                <Input
                  disabled
                  bordered={false}
                  style={{ color: renderStatusColor(status) }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div className="mb-10">
          <h3 className="mt-5">Danh sách đội 1</h3>
          <Table columns={columns} dataSource={teamOne} pagination={false} />
          <h3 className="mt-5">Danh sách đội 2</h3>
          <Table columns={columns} dataSource={teamTwo} pagination={false} />
        </div>
      </div>
    </Modal>
  );
};

export default ModalDetailMatch;
