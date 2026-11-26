import { Product, Category, Banner, ProductFilter } from '../types';
import { products, categories, banners } from '../data/mockData';

export const productService = {
  /**
   * Fetches all products, with optional filtering.
   */
  async getProducts(filter?: ProductFilter): Promise<Product[]> {
    let result = [...products];

    if (filter?.categoryId) {
      result = result.filter((p) => p.categoryId === filter.categoryId);
    }

    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (filter?.inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    return result;
  },

  /**
   * Fetches a single product by ID.
   */
  async getProductById(id: string): Promise<Product | undefined> {
    return products.find((p) => p.id === id);
  },

  /**
   * Fetches all product categories.
   */
  async getCategories(): Promise<Category[]> {
    return categories;
  },

  /**
   * Fetches promotional home banners.
   */
  async getBanners(): Promise<Banner[]> {
    return banners;
  },
};
