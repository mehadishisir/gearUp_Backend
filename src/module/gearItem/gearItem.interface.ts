export interface ICreateGearItem {
  name: string;
  description: string;
  brand: string;
  price: number;
  stock: number;
  images?: string[];
  categoryId: string;
}

export interface IGearFilters {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  brand?: string;
  available?: string;
  search?: string;
}