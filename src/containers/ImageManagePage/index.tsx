import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { requestToken } from "../../configs/api";
import { cleanObject, getPublic, tryImageUrl } from "../../configs/help";
import { queryKeys } from "../../configs/query";
import { CopyOutlined, UploadOutlined } from "@ant-design/icons";
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
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { ColumnsType } from "antd/es/table";

export default function ImageManage() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paging, setPaging] = useState({
    totalDocs: 0,
    limit: 10,
  });
  const { data, refetch } = useQuery({
    queryKey: [queryKeys.get_feedback],
    queryFn: () =>
      requestToken({
        method: "GET",
        url: "/media",
        params: cleanObject({
          page: currentPage,
          pageSize: paging.limit,
        }),
      }),
    onSuccess(data: any) {
      const { docs, ...p } = data.data;
      setPaging({ ...p });
    },
  });
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
    } else refetch();
  }, [currentPage]);
  const columns: ColumnsType<any> = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (_: any, record: any, i) =>
        i + 1 + (currentPage - 1) * paging.limit,
    },
    {
      title: "Tên",
      dataIndex: "originalName",
      key: "originalName",
      render: (text) => <div className="">{text}</div>,
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (_: any, record: any) => (
        <Image src={getPublic(record?.path)} width={100} />
      ),
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
              navigator.clipboard.writeText(getPublic(record?.path));
              message.success("Sao chép thành công");
            }}
          >
            <CopyOutlined />
          </Button>
        </Space>
      ),
    },
  ];
  const uploadImage = async (options: any) => {
    const { onSuccess, onError, file } = options;
    const fmData = new FormData();
    fmData.append("file", file);

    try {
      await requestToken({
        method: "POST",
        url: "/media/upload",
        data: fmData,
        headers: { "content-type": "multipart/form-data" },
      });
      refetch();
    } catch (err) {
      const error = new Error("Some error");
      onError({ err });
    }
  };
  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <div>
      <div className="flex flex-row justify-between align-center">
        <h1 className="page-title">Quản lý file</h1>
        <Upload
          customRequest={uploadImage}
          fileList={fileList}
          onChange={onChange}
          maxCount={1}
          showUploadList={false}
        >
          <div className="flex justify-center items-center gap-[12px]">
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </div>
        </Upload>
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
    </div>
  );
}
