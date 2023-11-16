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
  Select,
  Space,
  Table,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useRef, useState } from "react";
import { requestToken } from "../../configs/api";
import { cleanObject, getPublic, tryImageUrl } from "../../configs/help";
import { queryClient, queryKeys } from "../../configs/query";
import { NewsType, TNews } from "../../configs/type";
import ModalNews from "./ModalNews";
import { contentTags } from "./constants";

interface INewsPage {
  type: NewsType;
}

export default function NewsPage({ type }: INewsPage) {
  const [search, setSearch] = useState({ keyword: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [contentType, setContentType] = useState<any>();
  const [paging, setPaging] = useState({
    totalDocs: 0,
    limit: 10,
    page: 1,
  });

  const { data, refetch } = useQuery({
    queryKey: ["newsAll"],
    queryFn: () => {
      return requestToken({
        method: "GET",
        url: "/news",
        params: cleanObject({
          page: currentPage,
          pageSize: paging.limit,
          ...search,
        }),
      });
    },
    onSuccess(data) {
      const { docs, ...p } = data.data;
      setPaging({ ...p });
    },
  });

  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
    } else refetch();
  }, [currentPage, contentType]);

  useEffect(() => {
    if (didMount.current) {
      if (currentPage === 1) {
        refetch();
      } else {
        setCurrentPage(1);
      }
    }
  }, [search]);

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
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (_: any, record: TNews) => (
        <Image src={getPublic(tryImageUrl(record?.thumb))} width={150} />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <div className="max-w-[300px]">{text}</div>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "100px",
      render(value, record, index) {
        return (
          <Select
            onChange={async (val) => {
              try {
                await requestToken({
                  method: "PUT",
                  url: `/news/${record?._id}`,
                  data: { status: val },
                });
                message.success("Cập nhật thành công");
                await queryClient.invalidateQueries(
                  type === NewsType.CONTENT
                    ? [queryKeys.get_news_content]
                    : type === NewsType.PROJECT
                    ? [queryKeys.get_news_project]
                    : [queryKeys.get_news_service]
                );
              } catch (error) {
                message.error("Cập nhật Thất bại");
                console.log("error", error);
              }
            }}
            defaultValue={record.status}
            style={{ width: 100 }}
            options={[
              { label: "draft", value: "draft" },
              { label: "public", value: "public" },
              { label: "hidden", value: "hidden" },
            ]}
          />
        );
      },
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
                    await queryClient.invalidateQueries(
                      type === NewsType.CONTENT
                        ? [queryKeys.get_news_content]
                        : type === NewsType.PROJECT
                        ? [queryKeys.get_news_project]
                        : [queryKeys.get_news_service]
                    );
                  } catch (error: any) {
                    console.log(error);
                    message.error(error?.response?.data?.message || "Thất bại");
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
        <h1 className="page-title">
          Quản lý{" "}
          {type === NewsType.CONTENT
            ? "bài viết"
            : type === NewsType.PROJECT
            ? "dự án"
            : "dịch vụ"}
        </h1>
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

      <Form
        onFinish={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        className="w-full"
      >
        <Row gutter={20}>
          <Col span={20}>
            <Form.Item name="keyword">
              <Input
                placeholder="keyword"
                onChange={(e) => {
                  e.preventDefault();
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

      {type === NewsType.CONTENT && (
        <>
          <div className="flex flex-row justify-between align-center">
            <div style={{ width: 300 }}>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Tất cả"
                value={contentType}
                onChange={async (value: string, opt) => {
                  setContentType(value);
                  setCurrentPage(1);
                }}
                options={contentTags}
              />
            </div>
          </div>
          <Divider />
        </>
      )}

      <div>
        <Table
          columns={columns}
          dataSource={data?.data?.docs}
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

      {modal.open && (
        <ModalNews
          newsType={type}
          title={
            <h2 className="mb-[32px] underline">
              {type === NewsType.CONTENT
                ? "Thêm mới bài viết"
                : type === NewsType.PROJECT
                ? "Thêm mới dự án"
                : "Thêm mới dịch vụ"}
            </h2>
          }
          open={modal.open}
          rootClassName="modal-news"
          onCancel={() => {
            setModal({ open: false });
          }}
          getContainer={false}
          isEdit={false}
        />
      )}

      {modalUpdate.open && (
        <ModalNews
          newsType={type}
          title={
            <h2 className="mb-[32px] underline">
              {type === NewsType.CONTENT
                ? "Cập nhật bài viết"
                : type === NewsType.PROJECT
                ? "Cập nhật dự án"
                : "Cập nhật dịch vụ"}
            </h2>
          }
          open={modalUpdate.open}
          rootClassName="modal-news"
          onCancel={() => {
            setModalUpdate({ open: false, record: undefined });
          }}
          getContainer={false}
          record={modalUpdate.record}
          isEdit={true}
        />
      )}
    </div>
  );
}
