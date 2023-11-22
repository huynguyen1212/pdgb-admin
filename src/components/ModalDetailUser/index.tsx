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
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import dayjs from "dayjs";
import { useState } from "react";
import slugify from "slugify";
import { requestToken } from "../../configs/api";
// import { getPublic } from "../../../configs/help";
// import { queryClient, queryKeys } from "../../../configs/query";

interface IProps {
  open: boolean;
  id: string | number;
  handleClose: () => void;
}

const DetailUser = (props: IProps) => {
  const [form] = Form.useForm();
  const { data, refetch } = useQuery({
    queryKey: ["detailTeam"],
    queryFn: () => {
      return requestToken({
        method: "GET",
        url: `/api/cms/teams/${props.id}`,
      });
    },
    retry: false,
    onSuccess(res) {
      form.setFieldsValue(res.data);
    },
  });

  useEffect(() => {}, []);

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
      <Form name="form_news" layout="vertical">
        <Row gutter={[24, 0]}>
          <Col span={12}>
            <Form.Item
              label={<div className="capitalize">Tên</div>}
              name={"title"}
            >
              <Input placeholder={"Tên"} disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<div className="capitalize">Ngày thành lập</div>}
              name={"createdAt"}
            >
              <Input placeholder={"Đường dẫn url"} disabled />
            </Form.Item>
          </Col>

          {/* <EditorView
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          /> */}
        </Row>
      </Form>
    </Modal>
  );
};

export default DetailUser;
