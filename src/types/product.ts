export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  image: string;
  unit: string;
  categoryId: string;
  inStock: boolean;
  features?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  subcategories?: string[];
  discountText?: string;
  bannerImage?: string;
  itemCount?: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  color: string;
}

export interface ProductFilter {
  categoryId?: string;
  searchQuery?: string;
  inStockOnly?: boolean;
}
