import { useState, useEffect, useCallback } from 'react';
import { Product, Category, Banner, ProductFilter } from '../types';
import { productService } from '../services';

export function useProducts(initialFilter?: ProductFilter) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (filter?: ProductFilter) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProducts(filter);
      setProducts(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      productService.getProducts(initialFilter),
      productService.getCategories(),
      productService.getBanners(),
    ])
      .then(([prodData, catData, bannerData]) => {
        if (isMounted) {
          setProducts(prodData);
          setCategories(catData);
          setBanners(bannerData);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || 'Failed to load catalog data');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [initialFilter]);

  return {
    products,
    categories,
    banners,
    loading,
    error,
    refetch: fetchProducts,
  };
}
