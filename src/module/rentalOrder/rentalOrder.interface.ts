export interface IRentalOrderItem {
  gearItemId: string;
  quantity: number;
}

export interface ICreateRentalOrder {
  startDate: string;
  endDate: string;
  items: IRentalOrderItem[];
}