export interface Blog {
  _id: string;
  title: string;
  thembnail: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BlogsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: Blog[];
}

export interface BlogResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Blog;
}