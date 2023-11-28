import { SearchOutlined, EyeOutlined, LeftOutlined } from "@ant-design/icons";
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
import { TNews } from "../../configs/type";
import { useParams, useNavigate } from "react-router-dom";
import FormDetail from "./Form";

const testData = [
  {
    id: "1",
    name: "Nguyễn Văn Sơn Zai",
    gender: 1,
    email: "son.nguyenngoc@amela.vn",
  },
];

interface IModalDetail {
  isOpen: boolean;
  id: string | number;
}

const DetailTeam = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ keyword: "" });
  const { id: clubId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [contentType, setContentType] = useState<any>();
  const [modalDetailStatus, setModalDetailStatus] = useState<IModalDetail>({
    isOpen: false,
    id: 0,
  });

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

  const handleOpenDetailTeam = (id: string) => {
    setModalDetailStatus({
      isOpen: true,
      id,
    });
  };

  const columns: ColumnsType<any> = [
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
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text) => <div className="max-w-[300px]">{text}</div>,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 200,
      render: (gender) => (
        <div className="max-w-[300px]">{gender === 1 ? "Nam" : "Nữ"}</div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];

  const handleCloseModal = () => {
    setModalDetailStatus({
      isOpen: false,
      id: 0,
    });
  };

  return (
    <div>
      <div
        className="mt-2 mb-6 cursor-pointer"
        onClick={() => navigate(`/clubs/${clubId}`)}
      >
        <LeftOutlined className="mr-2" />
        <span>Quản lí team</span>
      </div>
      <div className="flex flex-row justify-between align-center">
        <h1 className="page-title">Chi tiết teams</h1>
      </div>
      <FormDetail data={data} />
      <Divider />
      <div className="flex flex-row justify-between align-center mb-5">
        <h1 className="page-title">Danh sách thành viên</h1>
      </div>
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

export default DetailTeam;
