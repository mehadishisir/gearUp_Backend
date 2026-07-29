export interface ICreateReview {
  rentalOrderId: string;
  gearItemId: string;
  rating: number;
  comment?: string;
}