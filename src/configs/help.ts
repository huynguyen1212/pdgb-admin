import { TImage, TImageNew } from "./type";

export const getPublic = (url: string) =>
  `${import.meta.env.VITE_API_URL}/${url}`;

export const tryImageUrl = (image: TImage | TImageNew) =>
  image?.path || "";

//
export function clampString(str: string, maxLength: number) {
  if (str?.length <= maxLength) {
    return str;
  }
  return str?.slice(0, maxLength) + "...";
}

export function cleanObject(obj: any) {
  Object.keys(obj).forEach((key) => {
    if (
      obj[key] === null ||
      obj[key] === undefined ||
      obj[key] === false ||
      Number.isNaN(obj[key]) ||
      obj[key] === ""
    ) {
      delete obj[key];
    }
  });
  return obj;
}
