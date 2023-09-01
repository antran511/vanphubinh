export interface IUom {
  id: number;
  uomName: string;
}
export enum ProductionOrderStatus {
  NEW = "NEW",
  WAITING = "WAITING",
  MANUFACTURING = "MANUFACTURING",
  PAUSED = "PAUSED",
  FINISHED = "FINISHED",
  CANCELLED = "CANCELLED",
}

export enum SaleOrderStatus {
  QUOTE = "QUOTE",
  SALE_ORDER = "SALE_ORDER",
  CANCELLED = "CANCELLED",
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

export enum ItemType {
  PRODUCT = "PRODUCT",
  MOULD = "MOULD",
  MATERIAL = "MATERIAL",
  FILM = "FILM",
  SERVICE = "SERVICE",
}

export default { ProductionOrderStatus, ItemType, SaleOrderStatus };
export interface IPartner {
  id: number;
  partnerName: string;
  partnerAddress: string;
  partnerPhone: string;
  partnerEmail: string;
}

export interface ISaleOrder {
  id: string;
  customerId: number;
  discount: number;
  customer: IPartner;
  createdAt: string;
  saleOrderLines: ISaleOrderLine[];
  status: SaleOrderStatus;
}
export interface IProductionOrder {
  id: string;
  saleOrderId: string;
  saleOrderLineId: string;
  itemId: number;
  item: IItem;
  quantity: number;
  finishedQuantity: number;
  finishedUomId: number;
  finishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deadline: string;
  status: ProductionOrderStatus;
  saleOrder: ISaleOrder;
}

export interface ISaleOrderLine {
  id: string;
  saleOrderId: string;
  itemId: number;
  quantity: number;
  finishedQuantity: number;
  unitPrice: number;
  taxRate: number;
  toDeliverAt: Date;
  note: string;
  item: IItem;
  productionOrder: IProductionOrder;
}
export interface IStockLocation {
  id: number;
  locationName: string;
  parentStockLocationId: number;
  childStockLocations: IStockLocation[];
}
export interface IInventoryLevel {
  id: number;
  itemId: number;
  item: IItem;
  locationId: number;
  location: IStockLocation;
  stockedQuantity: number;
  reservedQuantity: number;
  incomingQuantity: number;
}
