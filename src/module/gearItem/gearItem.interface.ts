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
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  available?: string;

  page?: string;
  limit?: string;

  sortBy?: string;
  sortOrder?: "asc" | "desc";
}