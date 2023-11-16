import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { requestToken } from "../../configs/api";
import { cleanObject } from "../../configs/help";
import { queryClient, queryKeys } from "../../configs/query";
import Table, { ColumnsType } from "antd/es/table";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Space,
  message,
} from "antd";

export default function AccountPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [paging, setPaging] = useState({
    totalDocs: 0,
    limit: 10,
  });
  const { data, refetch } = useQuery({
    queryKey: [queryKeys.get_account],
    queryFn: () =>
      requestToken({
        method: "GET",
        url: "/admin",
        params: cleanObject({
          page: currentPage,
          pageSize: paging.limit,
        }),
      }),
    onSuccess(data) {
      const { docs, ...p } = data.data;
      setPaging({ ...p });
    },
  });
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
    } else refetch({ exact: true });
  }, [currentPage]);
  const [isOpen, toggleModal] = useState(false);
  const [form] = Form.useForm();
  const columns: ColumnsType<any> = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (_: any, record: any, i) =>
        i + 1 + (currentPage - 1) * paging.limit,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (
        <div className="">{new Date(text).toLocaleString()}</div>
      ),
    },
    {
      title: "Tên tài khoản",
      dataIndex: "username",
      key: "username",
      render: (text) => <div className="">{text}</div>,
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="capitalize"
            type="primary"
            danger
            onClick={(e) => {
              e.preventDefault();
              Modal.confirm({
                title: "Xóa tài khoản admin",
                content: <div>Tên tài khoản: {record?.username}</div>,
                onOk: async () => {
                  try {
                    await requestToken({
                      method: "DELETE",
                      url: `/admin/${record?._id}`,
                    });
                    message.success("Xóa thành công");
                    await queryClient.invalidateQueries([
                      queryKeys.get_account,
                    ]);
                  } catch (error: any) {
                    console.log(error);
                    message.error(error.response.data.message || "Thất bại");
                  }
                },
                okButtonProps: { danger: true },
                style: { width: "200px" },
                rootClassName: "ccc",
              });
            }}
          >
            delete
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <div>
      <div className="flex flex-row justify-between align-center">
        <h1 className="page-title">Quản lý tài khoản admin</h1>
        <Button
          type="primary"
          onClick={(e) => {
            e.preventDefault();
            toggleModal(true);
          }}
        >
          Thêm mới
        </Button>
      </div>
      <Divider />

      <div>
        <Table
          columns={columns}
          dataSource={data?.data.docs}
          pagination={{
            current: currentPage,
            total: paging.totalDocs,
            pageSize: paging.limit,
            onChange(page, pageSize) {
              setCurrentPage(page);
            },
          }}
        />
      </div>
      {isOpen && (
        <Modal
          okButtonProps={{ htmlType: "submit", form: "form_create" }}
          title={<h2 className="mb-[32px] underline">Thêm mới tài khoản</h2>}
          open={isOpen}
          onCancel={() => {
            toggleModal(false);
          }}
        >
          <Form
            name="form_create"
            form={form}
            layout="vertical"
            onFinish={async (data: any) => {
              try {
                await requestToken({
                  method: "POST",
                  url: "/admin",
                  data,
                });
                message.success("Cập nhật thành công");
                await queryClient.invalidateQueries([queryKeys.get_account]);
                toggleModal(false);
              } catch (error: any) {
                console.log(error);

                message.error(error?.response?.data?.message || "Thất bại");
              }
            }}
          >
            <Row gutter={[24, 0]}>
              <Col span={24}>
                {" "}
                <Form.Item
                  label={<div className="capitalize">Tên tài khoản</div>}
                  name="username"
                  rules={[
                    { required: true, message: "Vui lòng điền tên tài khoản!" },
                  ]}
                >
                  <Input placeholder="Username" />
                </Form.Item>
              </Col>
              <Col span={24}>
                {" "}
                <Form.Item
                  label={<div className="capitalize">Mật khẩu</div>}
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng điền mật khẩu!" },
                  ]}
                >
                  <Input type="password" placeholder="Password" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      )}
    </div>
  );
}
