export type CrmSyncStatusItem = {
  _id: string;
  onofficeId: number;
  apartmentName: string;
  date: string;
  time: string;
  livingArea: number;
  rentalStatus: string;
  status: "success" | "failed";
  thumbnail: string;
  slug: string;
};

export interface EstateImage {
  id: number;
  type: string;
  url: string;
  title: string;
}

export interface EstateItem {
  _id: string;
  onofficeId: number;
  objekttitel: string;
  slug: string;
  isActive: boolean;
  wohnflaeche: number;
  syncedAt: string;
  titleImage: EstateImage | null;
  images: EstateImage[];
  kaltmiete: number;
  warmmiete: number;
  kaufpreis: number;
  kaution: number;
  objektart: string;
  objekttyp: string;
  vermarktungsart: string;
  ort: string;
  plz: string;
  strasse: string;
  hausnummer: string;
  anzahl_zimmer: number;
  anzahl_schlafzimmer: number;
  anzahl_badezimmer: number;
  moebliert: string;
  objektbeschreibung?: string;
  lage?: string;
  ausstatt_beschr?: string;
  verfuegbar_ab?: string | null;
  verfuegbarAbText?: string;
  rentalStatusLabel?: string;
  price?: number | null;
  priceType?: string;
  priceLabel?: string;
  amenities?: Record<string, boolean>;
  whyChoose?: string[];
}

export interface EstatesApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: EstateItem[];
}
