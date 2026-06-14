
export interface LandlordSubmission {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  propertyAddress: string;
  propertyType: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface LandlordSubmissionsApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: LandlordSubmission[];
}