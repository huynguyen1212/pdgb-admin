import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../../configs/api";

const LoginPage: React.FC = () => {
  const { isLoading, mutateAsync } = useMutation({
    mutationFn: (data) =>
      request({ method: "POST", url: "/admin/login", data: data }),
    onError(error: any, variables, context) {
      message.error(error?.response?.data?.message || "Thất bại");
    },
    onSuccess(data, variables, context) {
      message.success("Thành công");
    },
  });
  const nav = useNavigate();

  const onFinish = async (values: any) => {
    // const { data } = await mutateAsync(values);
    // localStorage.setItem("token", data?.token);
    nav("/clubs");
    // message.success("Đăng nhập thành công.");
  };

  return (
    <Form
      name="normal_login"
      className="max-w-[350px] mr-auto ml-auto mt-[300px]"
      onFinish={onFinish}
    >
      <h1 className="text-center">Admin Login</h1>
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Vui lòng điền tên tài khoản!" }]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Vui lòng điền mật khẩu!" }]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full">
          {isLoading ? "Loading..." : "Log in"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginPage;
