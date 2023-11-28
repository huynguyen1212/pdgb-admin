export interface TTag {
  deleted: boolean;
  _id: string;
  name: string;
}

export interface TNews {
  id: string;
  name: string;
  createdAt: Date;
}

export interface TImage {
  _id: string;
  path: string;
  smallPath: string;
  middlePath: string;
  bigPath: string;
  size: number;
  mimeType: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface TCompetition {
  _id: string;
  display_status: string;
  run_status: string;
  type: string;
  addition_content: string;
  image: any;
  wca: any;
  name: string;
  registration_open: string;
  registration_close: string;
  start_date: string;
  end_date: string;
  event_ids: any[];
}

export interface TProduct {
  _id: string;
  name: string;
  slug: string;
  producer: string;
  code: string;
  madein: string;
  description: string;
  mechanism: string;
  thumb: TImageNew;
  imgs: TImageNew[];
  type: TProductType;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: 0;
}

export interface TImageNew {
  _id: string;
  originalName: string;
  path: string;
  size: number;
  mimeType: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface TProductType {
  _id: string;
  name: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export enum NewsType {
  CONTENT,
  PROJECT,
  SERVICE
}
