

export interface BlogsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: PaginationMeta;
  data: Blog[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  thumbnail: string;
  excerpt: string;
  content?: string;
  description?: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}













// export interface Blog {
//   _id: string;
//   title: string;
//   thumbnail: string;
//   description: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// export interface BlogsResponse {
//   statusCode: number;
//   success: boolean;
//   message: string; 
//   meta: {
//     page: number;
//     limit: number;
//     total: number;
//   };
//   data: Blog[];
// }

// export interface BlogResponse {
//   statusCode: number;
//   success: boolean;
//   message: string;
//   data: Blog;
// }