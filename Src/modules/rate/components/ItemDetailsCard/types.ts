// Phase 8 – Rate Components
export interface ItemDetail {
  ITEMID?: string | number;
  TAGNO?: string | number;
  ITEMNAME?: string;
  SUBITEMNAME?: string;
  PCS?: number | string;
  GRSWT?: number | string;
  GrossAmount?: number | string;
  GSTAmount?: number | string;
  GrandTotal?: number | string;
  [key: string]: unknown;
}

export interface ItemDetailsCardProps {
  item: ItemDetail;
  index: number;
}
