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
import ModalDetailRequest from "./ModalDetailRequest";

const ListClubs = () => {
  const [search, setSearch] = useState({ keyword: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpenModalDetail, setIsOpenModalDetail] = useState<boolean>(false);
  const [requestActive, setRequestActive] = useState<any>(null);
  const navigate = useNavigate();
  const [paging, setPaging] = useState({
    totalDocs: 0,
    limit: 10,
    page: 1,
  });

  const { data, refetch } = useQuery({
    queryKey: ["listCreateRequest"],
    queryFn: () => {
      return requestToken({
        method: "GET",
        url: "/api/cms/request/list-create?status=1",
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
  }, [currentPage]);

  useEffect(() => {
    if (didMount.current) {
      if (currentPage === 1) {
        refetch();
      } else {
        setCurrentPage(1);
      }
    }
  }, [search]);

  const handlOpenModalRequestDetail = (data: any) => {
    setIsOpenModalDetail(true);
    setRequestActive(data);
  };

  const handleCloseModalRequestDetail = () => {
    setIsOpenModalDetail(false);
    setRequestActive(null);
  };

  const handleAccept = async () => {
    try {
      const res = await requestToken({
        method: "POST",
        url: `/api/cms/request/review-registration/${requestActive.id}`,
        data: {
          status: 2,
        },
      });
      if (res) {
        message.success("Duyệt đơn tạo club thành công");
        handleCloseModalRequestDetail();
        refetch();
      }
    } catch (err) {
      message.error("Duyệt đơn tạo club thất bại");
    }
  };

  const handleReject = async () => {
    try {
      const res = await requestToken({
        method: "POST",
        url: `/api/cms/request/review-registration/${requestActive.id}`,
        data: {
          status: 3,
        },
      });
      if (res) {
        message.success("Từ chối duyệt club thành công");
        handleCloseModalRequestDetail();
        refetch();
      }
    } catch (err) {
      message.error("Từ chối duyệt club thất bại");
    }
  };

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
      dataIndex: "created_at",
      key: "created_at",
      width: "300px",
      render: (text) => (
        <div className="">{moment(text).format("YYYY/MM/DD hh:mm:ss")}</div>
      ),
    },
    {
      title: "Tên club",
      dataIndex: "club_name",
      key: "club_name",
      render: (text) => <div className="max-w-[300px]">{text}</div>,
    },
    {
      title: "Số thành viên",
      dataIndex: "number_of_members",
      key: "number_of_members",
      render: (text) => <div className="max-w-[300px]">{text}</div>,
    },
    {
      title: "Quản lí",
      render: (record) => (
        <div className="max-w-[300px]">{record.manager.name}</div>
      ),
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
            onClick={() => handlOpenModalRequestDetail(record)}
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
        <h1 className="page-title">Yêu cầu tạo clubs</h1>
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
      {isOpenModalDetail && (
        <ModalDetailRequest
          open={isOpenModalDetail}
          data={requestActive}
          handleClose={handleCloseModalRequestDetail}
          handleAccept={handleAccept}
          handleReject={handleReject}
        />
      )}
    </div>
  );
};

export default ListClubs;
