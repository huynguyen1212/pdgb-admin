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
import { cleanObject } from "../../configs/help";
import { TNews } from "../../configs/type";

const ListMatchs = () => {
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
        url: "/api/cms/match/list",
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

  const columns: ColumnsType<any> = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: "100px",
      render: (_: any, record: TNews, i) =>
        i + 1 + (currentPage - 1) * paging.limit,
    },
    {
      title: "Người tạo",
      dataIndex: "createdMember",
      key: "createdMember",
      width: "200px",
      render: (_, record) => (
        <div className="">{record?.creator_member?.name || ""}</div>
      ),
    },
    {
      title: "Bộ môn",
      dataIndex: "sportType",
      key: "sportType",
      width: "100px",
      render: (_, record) => (
        <div className="">{record?.sports_discipline?.name || ""}</div>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
      width: "250px",
      render: (_, record) => (
        <div className="max-w-[300px]">
          {`${record.match_date} ${record.match_time}` || ""}
        </div>
      ),
    },
    {
      title: "Địa điểm",
      dataIndex: "venue",
      key: "venue",
      render: (text) => <div className="max-w-[300px]">{text}</div>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text) => <div className="max-w-[300px]">{text}</div>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status_name",
      width: "100px",
      key: "status_name",
      render: (_, record) => {
        let className = "";
        switch (record.status) {
          case 1:
            className = "bg-green-500";
            break;
          case 2:
            className = "bg-red-500";
            break;
          case 3:
            className = "bg-zinc-600";
            break;
          default:
            className = "bg-green-500";
        }
        return (
          <div
            className={`max-w-[300px] text-center p-1 rounded-md text-white ${className}`}
          >
            {record.status_name}
          </div>
        );
      },
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
              navigate(`/clubs/${record.id}`);
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
        <h1 className="page-title">Quản lý matchs</h1>
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

export default ListMatchs;
