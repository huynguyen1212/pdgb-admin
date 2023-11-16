import { useQuery } from "@tanstack/react-query";
import { Button, Col, Form, Input, Row } from "antd";
import React from "react";
import { requestToken } from "../../configs/api";

const ConfigWeb: React.FC = () => {
  const { isLoading, data } = useQuery({
    queryFn: () => requestToken({ method: "GET", url: "/admin/config" }),
  });
  const onFinish = (value: object) => {
    console.log(value);
  };
  console.log("data", data?.data);

  const webConfig = [
    { label: "GA ID", key: "ga", value: "" },
    { label: "title", key: "title", value: data?.data["title"] || "" },
    { label: "Mô tả", key: "desc", value: data?.data["desc"] || "" },
    { label: "domain", key: "domain", value: data?.data["domain"] || "" },

    {
      label: "Số điện thoại",
      key: "phoneNumber",
      value: data?.data["phoneNumber"] || "",
    },
    { label: "Email", key: "email", value: data?.data["email"] || "" },
    { label: "Địa chỉ", key: "address", value: data?.data["address"] || "" },
    {
      label: "Link facebook",
      key: "facebook",
      value: data?.data["facebook"] || "",
    },
    {
      label: "Link twitter",
      key: "twitter",
      value: data?.data["twitter"] || "",
    },
    {
      label: "Link linkedin",
      key: "linkedin",
      value: data?.data["linkedin"] || "",
    },
  ];

  if (isLoading) {
    return <h5>Loading...</h5>;
  }

  return (
    <Form name="form_item_path" layout="vertical" onFinish={onFinish}>
      <Row gutter={12}>
        {webConfig.map((k, i) => (
          <Col span={12}>
            <Form.Item
              label={<div className="capitalize">{k.label}</div>}
              name={k.key}
              rules={[{ required: true }]}
            >
              <Input defaultValue={k.value} />
            </Form.Item>
          </Col>
        ))}
      </Row>

      <Button type="primary" htmlType="submit">
        Lưu cài đặt
      </Button>
    </Form>
  );
};

export default ConfigWeb;
