import { UploadOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Upload,
} from "antd";

interface IProps {
  data: any;
}

const FormDetail = (props: IProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(props.data);
  }, []);

  return (
    <Form name="form_news" layout="vertical">
      <Row gutter={[24, 0]}>
        <Col span={8}>
          <Form.Item
            label={<div className="capitalize">Tên</div>}
            name={"title"}
          >
            <Input placeholder={"Tên"} disabled />
          </Form.Item>
        </Col>
        <Col span={2}></Col>
        <Col span={8}>
          <Form.Item
            label={<div className="capitalize">Ngày thành lập</div>}
            name={"createdAt"}
          >
            <Input placeholder={"Đường dẫn url"} disabled />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[24, 0]}>
        <Col span={8}>
          <Form.Item
            label={<div className="capitalize">Số thành viên</div>}
            name={"totalMembers"}
          >
            <Input placeholder={"Đường dẫn url"} disabled />
          </Form.Item>
        </Col>
        <Col span={2}></Col>
        <Col span={8}>
          <Form.Item
            label={<div className="capitalize">Bộ môn</div>}
            name={"type"}
          >
            <Input placeholder={"Đường dẫn url"} disabled />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FormDetail;
