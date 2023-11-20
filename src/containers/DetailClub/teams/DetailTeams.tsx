import { UploadOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
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
import TextEditer from "../../../components/Editer";
import { requestToken } from "../../../configs/api";
import { getPublic } from "../../../configs/help";
import { queryClient, queryKeys } from "../../../configs/query";

const DetailTeams = (props: any) => {
  return (
    <Modal {...props} okButtonProps={{ htmlType: "submit", form: "form_news" }}>
      <Form name="form_news" layout="vertical">
        <Row gutter={[24, 0]}>
          <Col span={12}>
            <Form.Item
              label={<div className="capitalize">Tiêu đề</div>}
              name={"title"}
              rules={[{ required: true }]}
            >
              <Input
                placeholder={"Tiêu đề"}
                onChange={(e) => {
                  // form.setFieldValue(
                  //   "slug",
                  //   slugify(e.target.value).toLowerCase().trim()
                  // );
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<div className="capitalize">Đường dẫn slug</div>}
              name={"slug"}
              rules={[{ required: true }]}
            >
              <Input
                prefix={"https://cubing.asia/news/"}
                placeholder={"Đường dẫn url"}
              />
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

export default DetailTeams;
