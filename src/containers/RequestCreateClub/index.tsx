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

interface INewsPage {
  type: NewsType;
}

export default function RequestCreateClubsPage() {
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
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <div className="max-w-[300px]">{text}</div>,
    },
  ];

  return (
    <div>
      <div className="flex flex-row justify-between align-center">
        <h1 className="page-title">Danh sách tạo club chờ duyệt</h1>
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
    </div>
  );
}
