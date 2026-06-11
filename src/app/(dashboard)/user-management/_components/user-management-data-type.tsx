
export interface AllUserApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: Meta;
  data: User[];
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  __v: number;

  verifiedForget?: boolean;
  gender?: string;
  location?: string;
  phoneNumber?: string;
  postalCode?: string;
  streetAddress?: string;
}