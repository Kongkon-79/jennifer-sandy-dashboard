

export interface AllInquiryApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: Meta;
  data: Inquiry[];
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
}

export interface Inquiry {
  _id: string;
  user: User;
  onOfficeId: Office;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
  createdAt: string;
  status: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

export interface Office {
  _id: string;
  objekttitel: string;
}