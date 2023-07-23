export interface IUom {
  id: number;
  uomName: string;
}
export interface IItem {
  id: number;
  itemName: string;
  uomId: number;
  uom: IUom;
  purchaseUomId: number;
  purchaseUom: IUom;
  category: string;
  itemType: ItemType;
  price: number;
  description: string;
}

enum ItemType {
  PRODUCT = "PRODUCT",
  MOULD = "MOULD",
  MATERIAL = "MATERIAL",
  SERVICE = "SERVICE",
}

export default ItemType;

export interface IPartner {
  id: number;
  partnerName: string;
  partnerAddress: string;
  partnerPhone: string;
  partnerEmail: string;
}

export interface ISaleOrder {
  id: number;
  customerId: number;
  discount: number;
  customer: IPartner;
}
