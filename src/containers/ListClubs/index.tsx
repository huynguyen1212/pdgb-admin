import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
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
import { useNavigate } from "react-router-dom";

import { requestToken } from "../../configs/api";
import { cleanObject, getPublic, tryImageUrl } from "../../configs/help";
import { queryClient, queryKeys } from "../../configs/query";
import { NewsType, TNews } from "../../configs/type";
import ModalNews from "./ModalNews";
import { contentTags } from "./constants";

const testData = [
  {
    id: "1",
    createdAt: new Date(),
    name: "club 1",
  },
];

const ListClubs = () => {
  const [search, setSearch] = useState({ keyword: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [contentType, setContentType] = useState<any>();
  const navigate = useNavigate();
  const [paging, setPaging] = useState({
    totalDocs: 0,
    limit: 10,
    page: 1,
  });

  const { data, refetch } = useQuery({
    queryKey: ["listClub"],
    queryFn: () => {
      return requestToken({
        method: "GET",
        url: "/api/cms/club/list",
        params: cleanObject({
          page: currentPage,
          pageSize: paging.limit,
          ...search,
        }),
      });
    },
    retry: false,
    onSuccess(res) {
      const { data, ...p } = res.data;
      setPaging({
        totalDocs: data.length,
        limit: 10,
        page: currentPage,
      });
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

  const columns: ColumnsType<TNews> = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: "100px",
      render: (_: any, record: TNews, i) =>
        i + 1 + (currentPage - 1) * paging.limit,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "300px",
      render: (text) => (
        <div className="">{moment(text).format("YYYY/MM/DD hh:mm:ss")}</div>
      ),
    },
    {
      title: "Tên ",
      dataIndex: "name",
      key: "name",
      render: (text) => <div className="max-w-[300px]">{text}</div>,
    },
    {
      title: "Số thành viên",
      dataIndex: "number_of_members",
      key: "number_of_members",
      render: (text) => <div className="max-w-[300px]">{text}</div>,
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: "100px",
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="capitalize"
            type="primary"
            onClick={() => {
              navigate(`/club/${record.id}`);
            }}
          >
            <EyeOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-row justify-between align-center">
        <h1 className="page-title">Quản lý clubs</h1>
      </div>

      <Divider />

      <Form
        onFinish={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        className="w-full float-right"
      >
        <Row gutter={10}>
          <Col span={6}>
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
          <Col span={2}>
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
          dataSource={data?.data.data}
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
};

export default ListClubs;
