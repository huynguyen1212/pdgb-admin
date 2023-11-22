import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
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
import { requestToken } from "../../../configs/api";
import { cleanObject, getPublic, tryImageUrl } from "../../../configs/help";
import { queryClient, queryKeys } from "../../../configs/query";
import { TNews } from "../../../configs/type";
// import DetailTeams from "./DetailTeams";
import { useParams, useNavigate } from "react-router-dom";

const testData = [
  {
    id: "1",
    createdAt: new Date(),
    name: "club 1",
    totalMembers: 50,
    type: "Bóng đá",
  },
];

interface IModalDetail {
  isOpen: boolean;
  id: string | number;
}

const ListTeams = () => {
  const [search, setSearch] = useState({ keyword: "" });
  const { id: clubId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [contentType, setContentType] = useState<any>();
  const navigate = useNavigate();

  const [paging, setPaging] = useState({
    totalDocs: 0,
    limit: 10,
    page: 1,
  });

  const { data, refetch } = useQuery({
    queryKey: ["listTeams"],
    queryFn: () => {
      return requestToken({
        method: "GET",
        url: `/api/cms/team/${clubId}`,
        params: cleanObject({
          page: currentPage,
          pageSize: paging.limit,
          ...search,
        }),
      });
    },
    retry: false,
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

  const columns: ColumnsType<TNews> = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: "100px",
      // sorter: true,
      render: (_: any, record: TNews, i) =>
        i + 1 + (currentPage - 1) * paging.limit,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "300px",
      render: (text) => (
        <div className="">{new Date(text).toLocaleString()}</div>
      ),
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text) => <div className="max-w-[300px]">{text}</div>,
    },
    {
      title: "Số thành viên",
      dataIndex: "totalMembers",
      key: "totalMembers",
      width: 200,
      render: (text) => <div className="max-w-[300px]">{text}</div>,
    },
    {
      title: "Bộ môn",
      dataIndex: "type",
      key: "type",
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
            onClick={() => navigate(`/club/${clubId}/team/${record.id}`)}
          >
            <EyeOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-row justify-between align-center mt-10">
        <h1 className="page-title">Danh sách đội nhóm</h1>
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
          dataSource={testData}
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

export default ListTeams;
