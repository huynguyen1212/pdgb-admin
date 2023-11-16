import { SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Col,
  Divider,
  Form,
  Image,
  Input,
  message,
  Modal,
  Row,
  Space,
  Table,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { requestToken } from "../../configs/api";
import {
  clampString,
  cleanObject,
  getPublic,
  tryImageUrl,
} from "../../configs/help";
import { queryClient, queryKeys } from "../../configs/query";
import ModalNews from "./ModalCreate";
import ModalNewsUpdate from "./ModalUpdate";

export interface TTag {
  deleted: boolean;
  _id: string;
  name: string;
}

export interface TNews {
  _id: string;
  title: string;
  slug: string;
  content: string;
  status: string;
  date: Date;
  image: TImage;
  tags: TTag[];
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface TImage {
  _id: string;
  path: string;
  smallPath: string;
  middlePath: string;
  bigPath: string;
  size: number;
  mimeType: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export default function NewsPage() {
  const [search, setSearch] = useState({ keyword: "" });

  const [paging, setPaging] = useState({
    totalDocs: 0,
    limit: 10,
    page: 1,
  });

  const { data, refetch } = useQuery({
    queryKey: [queryKeys.get_news_content],
    queryFn: () =>
      requestToken({
        method: "GET",
        url: "/news",
        params: cleanObject({
          page: paging.page,
          pageSize: paging.limit,
          ...search,
        }),
      }),
    onSuccess(data) {
      const { docs, ...p } = data.data;
      setPaging({ ...p });
    },
  });

  const onSearch = async (values: any) => {
    await refetch({ exact: true });
  };

  const [modal, setModal] = useState<{ open: boolean; title?: string }>({
    open: false,
    title: "",
  });

  const [modalUpdate, setModalUpdate] = useState<{
    open: boolean;
    title?: string;
    record: any;
  }>({
    open: false,
    record: undefined,
  });

  const columns: ColumnsType<TNews> = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (_: any, record: TNews, i) =>
        i + 1 + (paging.page - 1) * paging.limit,
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (_: any, record: TNews) => (
        <Image src={getPublic(tryImageUrl(record.image))} />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <div className="max-w-[300px]">{text}</div>,
    },

    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      render: (text) => (
        <div className="max-w-[400px]">{clampString(text, 100)}</div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "100px",
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
            onClick={() => {
              setModalUpdate({ open: true, record });
            }}
          >
            edit
          </Button>
          <Button
            className="capitalize"
            type="primary"
            danger
            onClick={(e) => {
              e.preventDefault();
              Modal.confirm({
                title: "Xóa bài viết",
                content: <div>Tiêu đề: {record.title}</div>,
                onOk: async () => {
                  try {
                    await requestToken({
                      method: "DELETE",
                      url: `/news/${record?._id}`,
                    });
                    message.success("Xóa thành công");
                    await queryClient.invalidateQueries([queryKeys.get_news_content]);
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
      <Form onFinish={onSearch} className="w-full">
        <Row gutter={20}>
          <Col span={20}>
            <Form.Item name="keyword">
              <Input
                placeholder="keyword"
                value={search?.keyword}
                onChange={(e) => {
                  e.preventDefault();
                  setSearch({ keyword: e.target.value });
                }}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              <Button className="w-full" type="primary" htmlType="submit">
                <SearchOutlined /> Tìm kiếm
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Divider />
      <div className="flex flex-row justify-end">
        <Button
          type="primary"
          onClick={(e) => {
            e.preventDefault();
            setModal({ open: true, title: "Thêm mới tin tức" });
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
            current: paging.page,
            total: paging.totalDocs,
            pageSize: paging.limit,
            onChange(page, pageSize) {
              setPaging({ ...paging, limit: pageSize, page: page });
            },
          }}
        />
      </div>

      {modal.open && (
        <ModalNews
          title={<h2 className="mb-[32px] underline">Thêm mới bài viết</h2>}
          open={modal.open}
          rootClassName="modal-news"
          onCancel={() => {
            setModal({ open: false });
          }}
          getContainer={false}
        />
      )}

      {modalUpdate.open && (
        <ModalNewsUpdate
          title={<h2 className="mb-[32px] underline">Cập nhật bài viết</h2>}
          open={modalUpdate.open}
          rootClassName="modal-news"
          onCancel={() => {
            setModalUpdate({ open: false, record: undefined });
          }}
          getContainer={false}
          record={modalUpdate.record}
        />
      )}
    </div>
  );
}
