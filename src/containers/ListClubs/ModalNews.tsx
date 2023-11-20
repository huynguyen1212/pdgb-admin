import { UploadOutlined } from "@ant-design/icons";
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
import { useState, useEffect } from "react";
import slugify from "slugify";
import TextEditer from "../../components/Editer";
import { requestToken } from "../../configs/api";
import { getPublic } from "../../configs/help";
import { queryClient, queryKeys } from "../../configs/query";
import { contentTags } from "./constants";
import { NewsType } from "../../configs/type";
const { TextArea } = Input;

export default function ModalNews(props: any) {
  const { newsType, isEdit } = props;
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [img, setImg] = useState<any>();
  const [content, setContent] = useState("<h1>Nội dung</h1>");
  const [contentEn, setContentEn] = useState("<h1>Content</h1>");

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

  useEffect(() => {
    if (isEdit) {
      const { record: news } = props;
      setContent(news.content);
      setContentEn(news?.translation?.content?.en);
      setImg(news?.thumb);
      form.setFieldValue("title", news.title);
      form.setFieldValue("shortDesc", news.shortDesc);
      form.setFieldValue("shortDesc_en", news?.translation?.shortDesc?.en);
      form.setFieldValue("title_en", news?.translation?.title?.en);
      form.setFieldValue("slug", news?.slug);
      form.setFieldValue("tags", news.tags);
      form.setFieldValue("status", news.status);
      form.setFieldValue("date", dayjs(new Date(news.date)));
    }
  }, [props.record, isEdit]);

  return (
    <Modal {...props} okButtonProps={{ htmlType: "submit", form: "form_news" }}>
      <Form
        name="form_news"
        form={form}
        layout="vertical"
        onFinish={async (data) => {
          try {
            if (img?._id) {
              let dataToSend = {
                thumb: img?._id,
                title: data?.title,
                slug: data?.slug,
                content: content,
                status: data?.status,
                date: new Date(data.date).toISOString(),
                tags: data?.tags,
                shortDesc: data?.shortDesc,
                translation: {
                  title: {
                    vi: data?.title,
                    en: data?.title_en,
                  },
                  shortDesc: {
                    vi: data?.shortDesc,
                    en: data?.shortDesc_en,
                  },
                  content: {
                    vi: content,
                    en: contentEn,
                  },
                },
              };
              if (isEdit)
                await requestToken({
                  method: "PUT",
                  url: `/news/${props?.record?._id}`,
                  data: dataToSend,
                });
              else
                await requestToken({
                  method: "POST",
                  url: "/news",
                  data: dataToSend,
                });
              message.success("Cập nhật thành công");
              await queryClient.invalidateQueries(
                newsType === NewsType.SERVICE
                  ? [queryKeys.get_news_service]
                  : newsType === NewsType.CONTENT
                  ? [queryKeys.get_news_content]
                  : [queryKeys.get_news_project]
              );
              props.onCancel && props.onCancel();
            }
          } catch (error: any) {
            message.error(error.response.data.message || "Thất bại");
          }
        }}
      >
        <Row gutter={[24, 0]}>
          <Col span={12}>
            <Form.Item
              label={<div className="capitalize">Tiêu đề</div>}
              name={"title"}
              rules={[{ required: true, message: "Vui lòng điền tiêu đề!" }]}
            >
              <Input
                placeholder={"Tiêu đề"}
                onChange={(e) => {
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
              label={<div className="capitalize">Tiêu đề (Tiếng Anh)</div>}
              name={"title_en"}
              rules={[{ required: true, message: "Vui lòng điền tiêu đề!" }]}
            >
              <Input placeholder={"Tiêu đề"} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<div className="capitalize">Đường dẫn slug</div>}
              name={"slug"}
              rules={[{ required: true, message: "Vui lòng điền slug!" }]}
            >
              <Input
                prefix={`${import.meta.env.VITE_USER_URL}/blogs/`}
                placeholder={"Đường dẫn url"}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<div className="capitalize">Trạng thái </div>}
              name={"status"}
              rules={[
                { required: true, message: "Vui lòng chọn trạng thái !" },
              ]}
            >
              <Select placeholder="Select a option and change input text above">
                <Select.Option value="draft">Bản nháp</Select.Option>
                <Select.Option value="public">Công khai</Select.Option>
                <Select.Option value="hidden">Ẩn</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<div className="capitalize">Tags</div>}
              name={"tags"}
              rules={[{ required: true, message: "Vui lòng chọn tag!" }]}
            >
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Tags..."
                options={contentTags}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label={<div className="capitalize">Thời gian</div>}
              name={"date"}
              rules={[{ required: true, message: "Vui lòng chọn thời gian !" }]}
              initialValue={dayjs(new Date())}
            >
              <DatePicker
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
              <div>
                <Upload
                  customRequest={uploadImage}
                  fileList={fileList}
                  onChange={onChange}
                  maxCount={1}
                  showUploadList={false}
                >
                  <div className="flex justify-center items-center gap-[12px]">
                    <Button icon={<UploadOutlined />}>Click to upload</Button>{" "}
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
              </div>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={<div className="capitalize">Mô tả</div>}
              name={"shortDesc"}
              rules={[{ required: true, message: "Vui lòng điền mô tả!" }]}
            >
              <TextArea rows={3} placeholder={"Mô tả"} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={<div className="capitalize">Mô tả (Tiếng Anh)</div>}
              name={"shortDesc_en"}
              rules={[{ required: true, message: "Vui lòng điền mô tả!" }]}
            >
              <TextArea rows={3} placeholder={"Mô tả (Tiếng Anh)"} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label={<div className="capitalize">Nội dung</div>}>
              <TextEditer
                data={content}
                onChange={(event: any, editor: any) => {
                  setContent(editor.getData());
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={<div className="capitalize">Nội dung (Tiếng Anh)</div>}
            >
              <TextEditer
                data={contentEn}
                onChange={(event: any, editor: any) => {
                  setContentEn(editor.getData());
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
