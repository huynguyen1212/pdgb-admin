import React, { useEffect } from "react";
import moment from "moment";
import { Button, Col, Form, Input, Modal, Row } from "antd";

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

  useEffect(() => {
    if (open) {
      const {
        manager,
        club_name: clubName,
        number_of_members: member,
        created_at: createAt,
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
    }
  }, [open]);

  return (
    <Modal
      title="Duyệt đơn xóa club"
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
            >
              <Input disabled bordered={false} style={{ color: "#000000" }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalDetailRequest;
