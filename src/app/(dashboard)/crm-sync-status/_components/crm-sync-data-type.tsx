export type CrmSyncStatusItem = {
  _id: string;
  apartmentName: string;
  date: string;
  time: string;
  updatedListings: number;
  errors: number;
  status: "success" | "failed";
  thumbnail: string;
};
