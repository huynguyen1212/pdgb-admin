import { UploadOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Select, Upload, UploadFile, UploadProps } from "antd";
import { useEffect, useState } from "react";
import { requestToken } from "../../configs/api";
import { getPublic } from "../../configs/help";
import { queryKeys } from "../../configs/query";
import { TImage } from "../../configs/type";

export default function UpLoadFileOrPick({
  onPick,
  initImg,
}: {
  initImg?: TImage;
  onPick: (img: TImage) => void;
}) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { data: imagesCdn, refetch: refetchImage } = useQuery({
    queryFn: () => requestToken({ method: "GET", url: "/media" }),
    queryKey: [queryKeys.get_images],
  });

  const [img, setImg] = useState<any>();

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

  useEffect(() => {
    if (img) {
      onPick(img);
    }
  }, [img]);

  useEffect(() => {
    if (initImg) {
      setImg(initImg);
    }
  }, [initImg]);

  return (
    <div>
      <Upload
        customRequest={uploadImage}
        fileList={fileList}
        onChange={onChange}
        maxCount={1}
        showUploadList={false}
      >
        <div className="flex justify-center items-center gap-[12px]">
          <Button icon={<UploadOutlined />}>Click to upload</Button> {" hoặc "}
          {imagesCdn && (
            <Select
              style={{ width: "500px" }}
              placeholder="chọn hình ảnh"
              onClick={(e) => {
                e.stopPropagation();
              }}
              onChange={(value, opt) => {
                const temp = (imagesCdn.data as any[]).find(
                  (i) => i._id === value
                );
                setImg(temp);
              }}
            >
              {imagesCdn?.data?.map((k: any, i: any) => (
                <Select.Option value={k._id}>
                  <div className="w-[100%]">{k?.originalName}</div>
                </Select.Option>
              ))}
            </Select>
          )}
        </div>
      </Upload>
      <div className="m-[8px_0] overflow-hidden">
        {img?._id ? (
          <img
            className="object-contain block m-[0_auto] max-w-[500px] max-h-[300px] w-full h-full border-[1px] border-solid border-[black]"
            src={getPublic(img.middlePath || img.smallPath || img.path)}
          />
        ) : (
          <p className="text-red-500">Chọn ảnh</p>
        )}
      </div>
    </div>
  );
}
