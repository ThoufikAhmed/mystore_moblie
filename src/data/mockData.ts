export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

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

export interface CartItem {
  product: Product;
  quantity: number;
}

export const categories: Category[] = [
  { id: 'c1', name: 'Grocery', icon: 'nutrition-outline', color: '#fef2f2' }, // red-50
  { id: 'c2', name: 'Vegetables', icon: 'leaf-outline', color: '#f0fdf4' }, // green-50
  { id: 'c3', name: 'Fruits', icon: 'aperture-outline', color: '#fffbeb' }, // yellow-50
  { id: 'c4', name: 'Beverages', icon: 'water-outline', color: '#eff6ff' }, // blue-50
  { id: 'c5', name: 'Household', icon: 'home-outline', color: '#f5f3ff' }, // violet-50
  { id: 'c6', name: 'Personal Care', icon: 'body-outline', color: '#fdf2f8' }, // pink-50
];

export const products: Product[] = [
  {
    id: 'p1',
    name: 'India Gate Basmati Rice (Classic)',
    description: 'Premium quality basmati rice with extra long grains. Aged to perfection for the best aroma and taste.',
    price: 650,
    originalPrice: 700,
    discount: 7,
    rating: 4.8,
    reviews: 1240,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    unit: '10 KG',
    categoryId: 'c1',
    inStock: true,
    features: ['Extra Long Grain', 'Aged for 2 Years', 'Aromatic'],
  },
  {
    id: 'p2',
    name: 'Fortune Sunlite Refined Sunflower Oil',
    description: 'Light and healthy cooking oil that is easy to digest and rich in vitamins.',
    price: 135,
    originalPrice: 150,
    discount: 10,
    rating: 4.6,
    reviews: 856,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80',
    unit: '1 Ltr',
    categoryId: 'c1',
    inStock: true,
    features: ['Rich in Vitamins', 'Light on Stomach'],
  },
  {
    id: 'p3',
    name: 'Farm Fresh Tomatoes',
    description: 'Directly sourced from farms, our tomatoes are juicy and perfect for daily cooking.',
    price: 45,
    originalPrice: 60,
    discount: 25,
    rating: 4.5,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80',
    unit: '1 KG',
    categoryId: 'c2',
    inStock: true,
    features: ['Farm Fresh', 'Pesticide Free'],
  },
  {
    id: 'p4',
    name: 'Organic Bananas (Robusta)',
    description: 'Sweet and healthy organic bananas, naturally ripened.',
    price: 60,
    originalPrice: 75,
    discount: 20,
    rating: 4.7,
    reviews: 320,
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&q=80',
    unit: '1 Dozen',
    categoryId: 'c3',
    inStock: true,
    features: ['Organic', 'Naturally Ripened'],
  },
  {
    id: 'p5',
    name: 'Tata Tea Premium',
    description: 'India\'s chai, made from carefully selected tea leaves for a strong and refreshing cup.',
    price: 240,
    originalPrice: 260,
    discount: 8,
    rating: 4.9,
    reviews: 4500,
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400&q=80',
    unit: '500g',
    categoryId: 'c4',
    inStock: true,
    features: ['Strong Aroma', 'Handpicked Leaves'],
  },
  {
    id: 'p6',
    name: 'Surf Excel Easy Wash Detergent Powder',
    description: 'Removes tough stains easily and leaves clothes smelling fresh.',
    price: 180,
    originalPrice: 200,
    discount: 10,
    rating: 4.8,
    reviews: 1890,
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&q=80',
    unit: '1.5 KG',
    categoryId: 'c5',
    inStock: true,
    features: ['Stain Removal', 'Fresh Fragrance'],
  }
];

export const userProfile = {
  name: 'Thoufik Ahmed',
  email: 'thoufik@example.com',
  phone: '+91 9876543210',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
  addresses: [
    {
      id: 'a1',
      label: 'Home',
      name: 'Thoufik Ahmed',
      street: '123, 5th Cross, BTM Layout',
      area: 'BTM Layout Phase 1',
      city: 'Bangalore',
      state: 'Karnataka',
      pin: '560029',
      isDefault: true,
    }
  ]
};

export const banners = [
  { id: 'b1', title: 'Fresh Products Delivered', subtitle: 'To Your Doorstep', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80', color: '#16a34a' },
  { id: 'b2', title: 'Monsoon Sale!', subtitle: 'Up to 50% OFF', image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80', color: '#ea580c' },
];
