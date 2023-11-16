import { UploadOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Upload,
} from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import dayjs from "dayjs";
import { useState } from "react";
import slugify from "slugify";
import TextEditer from "../../components/Editer";
import { requestToken } from "../../configs/api";
import { getPublic } from "../../configs/help";
import { queryClient, queryKeys } from "../../configs/query";

export default function ModalNews(props: any) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [img, setImg] = useState<any>();
  const [content, setContent] = useState("<h1>Tiêu đề</h1>");

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadImage = async (options: any) => {
    const { onSuccess, onError, file } = options;
    const fmData = new FormData();
    fmData.append("file", file);

    try {
      const res = await requestToken({
        method: "POST",
        url: "/media/upload",
        data: fmData,
        headers: { "content-type": "multipart/form-data" },
      });
      onSuccess("Ok");
      setImg(res.data);
    } catch (err) {
      const error = new Error("Some error");
      onError({ err });
    }
  };

  const [form] = Form.useForm();
  const { data: imagesCdn, refetch: refetchImage } = useQuery({
    queryFn: () => requestToken({ method: "GET", url: "/media/images" }),
    queryKey: [queryKeys.get_images],
  });

  const { data: tagCdn, refetch: refetchTag } = useQuery({
    queryFn: () => requestToken({ method: "GET", url: "/news/tag" }),
    queryKey: [queryKeys.get_tags],
  });

  return (
    <Modal {...props} okButtonProps={{ htmlType: "submit", form: "form_news" }}>
      <Form
        name="form_news"
        form={form}
        layout="vertical"
        onFinish={async (data) => {
          try {
            if (img?._id) {
              await requestToken({
                method: "POST",
                url: "/news",
                data: {
                  imageId: img?._id,
                  title: data?.title,
                  slug: data?.slug,
                  content: content,
                  status: data.status,
                  date: new Date(data.date).toISOString(),
                  tags: data.tags,
                },
              });
              message.success("Thêm thành công");
              await queryClient.invalidateQueries([queryKeys.get_news_content]);
              props.onCancel && props.onCancel();
            }
          } catch (error: any) {
            console.log(error);

            message.error(error.response.data.message || "Thất bại");
          }
        }}
      >
        <Row gutter={[24, 0]}>
          <Col span={12}>
            <Form.Item
              label={<div className="capitalize">Tiêu đề</div>}
              name={"title"}
              rules={[{ required: true }]}
            >
              <Input
                placeholder={"Tiêu đề"}
                onChange={(e) => {
                  console.log(e.target.value);

                  form.setFieldValue(
                    "slug",
                    slugify(e.target.value).toLowerCase().trim()
                  );
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<div className="capitalize">Đường dẫn slug</div>}
              name={"slug"}
              rules={[{ required: true }]}
            >
              <Input
                prefix={"https://cubing.asia/news/"}
                placeholder={"Đường dẫn url"}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<div className="capitalize">Trạng thái </div>}
              name={"status"}
              rules={[{ required: true }]}
            >
              <Select placeholder="Select a option and change input text above">
                <Select.Option value="draft">draft</Select.Option>
                <Select.Option value="public">public</Select.Option>
                <Select.Option value="hidden">hidden</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<div className="capitalize">Tags</div>}
              name={"tags"}
              rules={[{ required: true }]}
            >
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Tags..."
                onChange={async (value: string, opt) => {
                  console.log(`selected Tags ${value}`, opt);
                }}
                // onSelect={async (value, opt) => {
                //   console.log(value, opt);
                //   if (!opt.value) {
                //     try {
                //       await requestToken({
                //         method: "POST",
                //         url: "/news/tag",
                //         data: {
                //           name: value,
                //         },
                //       });
                //       message.success("Thêm thành công");
                //       await refetchTag();
                //     } catch (error) {
                //       message.error("Thất bại");
                //     }
                //   }
                // }}
                options={tagCdn?.data.map((k: any) => ({
                  value: k._id,
                  label: k.name,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label={<div className="capitalize">Thời gian</div>}
              name={"date"}
              rules={[{ required: true }]}
              initialValue={dayjs(new Date())}
            >
              <DatePicker
                // defaultValue={}
                format={"DD/MM/YYYY"}
              />
            </Form.Item>
          </Col>
          <Col span={20}>
            <Form.Item
              label={<div className="capitalize">Ảnh bìa</div>}
              name={"image"}
              required
            >
              <Upload
                customRequest={uploadImage}
                fileList={fileList}
                onChange={onChange}
                maxCount={1}
                showUploadList={false}
              >
                <div className="flex justify-center items-center gap-[12px]">
                  <Button icon={<UploadOutlined />}>Click to upload</Button>{" "}
                  {" hoặc "}
                  {imagesCdn && (
                    <Select
                      style={{ width: "500px" }}
                      placeholder="chọn hình ảnh"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      onChange={(value, opt) => {
                        console.log(`selected `, value);
                        const temp = (imagesCdn.data as any[]).find(
                          (i) => i._id === value
                        );
                        setImg(temp);
                      }}
                    >
                      {imagesCdn.data.map((k: any, i: any) => (
                        <Select.Option value={k._id}>
                          <div className="w-[100%]">{k?.originalName}</div>
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </div>
              </Upload>
              <div className="m-[12px_0] overflow-hidden">
                {img?._id ? (
                  <img
                    className="object-cover max-w-[500px] max-h-[300px]"
                    src={getPublic(img.path)}
                  />
                ) : (
                  <p className="text-red-500">Chọn ảnh</p>
                )}
              </div>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={<div className="capitalize">Nội dung</div>}>
              <TextEditer
                data={"<h1>Tiêu đề</h1>"}
                onChange={(event: any, editor: any) => {
                  setContent(editor.getData());
                }}
              />
            </Form.Item>
          </Col>

          {/* <EditorView
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          /> */}
        </Row>
      </Form>
    </Modal>
  );
}
