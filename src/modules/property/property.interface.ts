export interface IProperty {
  title: string;
  description: string;
  location: string;
  address?: string;
  rentPrice: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  image?: string;
  categoryId: string;
}

export interface IPropertyQuery {
  searchTerm?: string;
  location?: string;
  categoryId?: string;
  amenities?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
