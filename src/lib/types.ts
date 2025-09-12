// src/lib/types.ts
export interface Product {
  id: string;
  sku?: string;
  name: string;
  title?: string;
  description: string;
  category: string;
  price: number;
  cost?: number;
  prices?: {
    amazon?: number;
    meli?: number;
    shopee?: number;
  };
  stock: number;
  minStock: number;
  aging?: number;
}

export interface Stats {
  totalProducts: number;
  newProductsThisMonth: number;
  totalValue: number;
  monthlyGrowth: number;
  lowStockItems: number;
  outOfStockItems: number;
  revenueD1: number;
  revenueMTD: number;
  ordersD1: number;
  marginPct: number;
  ruptureCount: number;
  excessCount: number;
  salesSeries30d: Array<{ day: number; value: number }>;
  topProfitSkus: Array<{ sku: string; profit: number }>;
}