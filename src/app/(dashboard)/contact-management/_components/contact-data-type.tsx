export interface ContactApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: ContactItem[];
}

export interface ContactItem {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
  createdAt: string;  // or Date if you convert it
  updatedAt: string;  // or Date if you convert it
  __v: number;
}
