import React, { useEffect, useState } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Form, Input, Space, Row } from "antd";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Table, { ColumnsType } from "antd/es/table";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";

import { requestToken } from "../../configs/api";
import ModalDetailUser from "../ListUser/ModalDetailUser";

const DetailClub = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id: clubId } = useParams();
  const [sports, setSports] = useState<any>([]);
  const [itemActive, setItemActive] = useState<number>(0);
  const [isOpenModalDetail, setIsOpenModalDetail] = useState<boolean>(false);
  const [listUsers, setListUsers] = useState<any>([]);

  const { refetch } = useQuery({
    queryKey: ["detailClub"],
    queryFn: () => {
      return requestToken({
        method: "GET",
        url: `/api/cms/club/detail/${clubId}`,
      });
    },
    retry: false,
    onSuccess(res) {
      const {
        name,
        email,
        phone,
        created_at: createdAt,
        manager,
        sports_disciplines: sportsDisciplines,
        members,
      } = res.data.data;
      form.setFieldsValue({
        name,
        email,
        phone,
        createdAt: moment(createdAt).format("YYYY/MM/DD hh:mm:ss"),
        managerName: manager.name,
        managerEmail: manager.email,
      });
      setSports(sportsDisciplines);
      setListUsers(members);
    },
  });

  const handleOpenDetailUser = (id: number) => {
    setIsOpenModalDetail(true);
    setItemActive(id);
  };

  const handleCloseModal = () => {
    setIsOpenModalDetail(false);
    setItemActive(0);
  };

  const toLowerCaseNonAccentVietnamese = (str: string) => {
    str = str.trim();
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
  };

  const handleSearch = (value: any) => {
    if (value.keyword !== "") {
      const data = listUsers.filter(
        (item: any) =>
          toLowerCaseNonAccentVietnamese(item.name).indexOf(
            toLowerCaseNonAccentVietnamese(value.keyword.trim())
          ) > -1
      );
      setListUsers(data);
    } else {
      refetch();
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: "100px",
      render: (_: any, record: any, i) => i + 1,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text) => <div className="max-w-[300px]">{text}</div>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <div className="max-w-[300px]">{text}</div>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
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
            onClick={() => handleOpenDetailUser(record.id)}
          >
            <EyeOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div
        className="mt-2 mb-6 cursor-pointer"
        onClick={() => navigate("/clubs")}
      >
        <LeftOutlined className="mr-2" />
        <span>Quản lí club</span>
      </div>
      <Form form={form} name="form_club" layout="vertical">
        <Row gutter={[24, 0]}>
          <Col span={10}>
            <Form.Item
              label={<div className="capitalize font-[500]">Tên club</div>}
              name={"name"}
            >
              <Input disabled bordered={false} style={{ color: "#000000" }} />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={10}>
            <Form.Item
              label={
                <div className="capitalize font-[500]">Ngày thành lập</div>
              }
              name={"createdAt"}
            >
              <Input disabled bordered={false} style={{ color: "#000000" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<div className="capitalize font-[500]">Quản lí</div>}
              name={"managerName"}
            >
              <Input disabled bordered={false} style={{ color: "#000000" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<div className="capitalize font-[500]">Email</div>}
              name={"managerEmail"}
            >
              <Input disabled bordered={false} style={{ color: "#000000" }} />
            </Form.Item>
          </Col>
          <Col span={24} className="mt-2 mb-5">
            <Form.Item
              label={<div className="capitalize font-[500]">Các bộ môn</div>}
              name={"managerPhone"}
              className="mb-0"
            >
              <div className="flex">
                {sports.map((item: any) => (
                  <span className="px-3 py-1 border-solid	border-2 border-sky-500 mr-2 rounded-md">
                    {item.name}
                  </span>
                ))}
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <h3 className="mb-4">Thành viên</h3>
      <Form
        onFinish={(value) => {
          handleSearch(value);
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
      <Table columns={columns} dataSource={listUsers} pagination={false} />
      {isOpenModalDetail && (
        <ModalDetailUser
          id={itemActive}
          open={isOpenModalDetail}
          handleClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default DetailClub;
