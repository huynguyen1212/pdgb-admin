import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, Col, Form, Input, Modal, Row } from "antd";
import { requestToken } from "../../configs/api";

interface IProps {
  open: boolean;
  data: any;
  handleClose: () => void;
  handleAccept: () => void;
  handleReject: () => void;
}

const ModalDetailRequest = ({
  open,
  data,
  handleClose,
  handleAccept,
  handleReject,
}: IProps) => {
  const [form] = Form.useForm();
  const [sports, setSports] = useState<any>([]);

  useEffect(() => {
    if (open) {
      const {
        manager,
        club_name: clubName,
        number_of_members: member,
        created_at: createAt,
        sports_disciplines: sportsDisciplines,
      } = data;
      const {
        name: managerName,
        email: managerEmail,
        phone: managerPhone,
      } = manager;
      form.setFieldsValue({
        clubName,
        member,
        createdAt: moment(createAt).format("YYYY/MM/DD hh:mm:ss"),
        managerName,
        managerEmail,
        managerPhone,
      });
      setSports(sportsDisciplines);
    }
  }, [open]);

  return (
    <Modal
      title="Duyệt đơn tạo club"
      open={open}
      onCancel={handleClose}
      centered
      footer={[
        <>
          <Button key="submit" onClick={handleAccept} type="primary">
            Duyệt
          </Button>
          <Button key="submit" onClick={handleReject} danger>
            Từ chối
          </Button>
          <Button key="back" onClick={handleClose}>
            Đóng
          </Button>
        </>,
      ]}
    >
      <Form name="form_news" layout="vertical" form={form}>
        <h2>Thông tin club</h2>
        <Row gutter={[24, 0]}>
          <Col span={12}>
            <Form.Item
              label={<div className="capitalize font-[500]">Tên club</div>}
              name={"clubName"}
            >
              <Input disabled bordered={false} style={{ color: "#000000" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<div className="capitalize font-[500]">Số thành viên</div>}
              name={"member"}
            >
              <Input disabled bordered={false} style={{ color: "#000000" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <div className="capitalize font-[500]">Thời gian tạo club</div>
              }
              name={"createdAt"}
            >
              <Input disabled bordered={false} style={{ color: "#000000" }} />
            </Form.Item>
          </Col>
        </Row>
        <h2>Thông tin quản lí</h2>
        <Row gutter={[24, 0]}>
          <Col span={12}>
            <Form.Item
              label={<div className="capitalize font-[500]">Tên</div>}
              name={"managerName"}
            >
              <Input disabled bordered={false} style={{ color: "#000000" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<div className="capitalize font-[500]">Email</div>}
              name={"managerEmail"}
            >
              <Input disabled bordered={false} style={{ color: "#000000" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<div className="capitalize font-[500]">Số điện thoại</div>}
              name={"managerPhone"}
              className="mb-0"
            >
              <Input disabled bordered={false} style={{ color: "#000000" }} />
            </Form.Item>
          </Col>
          <Col span={24} className="mt-2 mb-5">
            <Form.Item
              label={<div className="capitalize font-[500]">Các bộ môn</div>}
              name={"managerPhone"}
              className="mb-0"
            >
              <div className="flex">
                {sports.map((item: any) => (
                  <span className="px-3 py-1 border-solid	border-2 border-sky-500 mr-2 rounded-md">
                    {item.name}
                  </span>
                ))}
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalDetailRequest;
