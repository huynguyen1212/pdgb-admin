import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, Col, Form, Input, Modal, Row } from "antd";
import { requestToken } from "../../configs/api";

interface IProps {
  open: boolean;
  id: string | number;
  handleClose: () => void;
}

const ModalDetailUser = (props: IProps) => {
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState<string>("");
  const { data, refetch } = useQuery({
    queryKey: ["detailUser"],
    queryFn: () => {
      return requestToken({
        method: "GET",
        url: `/api/cms/member/detail/${props.id}`,
      });
    },
    retry: false,
    onSuccess(res) {
      const { name, email, phone, created_at: createdAt } = res.data.data;
      console.log(name, email, phone, createdAt);
      form.setFieldsValue({
        name,
        email,
        phone,
        createdAt: moment(res.data.data).format("YYYY/MM/DD hh:mm:ss"),
      });
    },
  });

  const randomAvatar = () => {
    const randomNumber = (Number(props.id) % 10) + 1;
    return `avatar${randomNumber}`;
  };

  useEffect(() => {
    if (props.open) {
      setAvatar(randomAvatar());
    } else {
      setAvatar("");
    }
  }, [props.open]);

  return (
    <Modal
      title="Thông tin chi tiết"
      open={props.open}
      onCancel={props.handleClose}
      centered
      footer={[
        <Button key="back" onClick={props.handleClose}>
          Close
        </Button>,
      ]}
    >
      <div className="flex justify-center mb-10">
        <img
          src={`src/assets/images/avatar/${avatar}.jpg`}
          alt=""
          className="w-60 h-60 object-cover rounded-full border-black	border-2 border-solid"
        />
      </div>

      <Form name="form_news" layout="vertical" form={form}>
        <Row gutter={[24, 0]}>
          <Col span={12}>
            <Form.Item
              label={<div className="capitalize font-[500]">Tên</div>}
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
              label={<div className="capitalize font-[500]">Số điện thoại</div>}
              name={"phone"}
            >
              <Input disabled bordered={false} style={{ color: "#000000" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <div className="capitalize font-[500]">Ngày tạo tài khoản</div>
              }
              name={"createdAt"}
            >
              <Input disabled bordered={false} style={{ color: "#000000" }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalDetailUser;
