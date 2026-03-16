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

export type PluginStatus = 'connected' | 'disconnected' | 'error' | 'pending';

export interface PluginField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'select';
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  category: 'marketplace' | 'erp' | 'logistics' | 'analytics' | 'payment';
  icon: string;
  status: PluginStatus;
  enabled: boolean;
  config?: Record<string, string>;
  fields: PluginField[];
  docsUrl?: string;
  lastSync?: string;
  ordersCount?: number;
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