// src/lib/mock-data.ts
import { Product } from '@/lib/types';

export const mockProducts: Product[] = [
  {
    id: 'prod-001',
    sku: 'PROD-001',
    name: 'Smartphone Samsung Galaxy A54 128GB',
    title: 'Smartphone Samsung Galaxy A54 128GB',
    description: 'Smartphone Android com 128GB de armazenamento',
    category: 'Eletrônicos',
    price: 1200,
    cost: 800,
    prices: { amazon: 1200, meli: 1150, shopee: 1100 },
    stock: 15,
    minStock: 5,
    aging: 25
  },
  {
    id: 'prod-002',
    sku: 'PROD-002',
    name: 'Fone de Ouvido Bluetooth JBL Tune 510BT',
    title: 'Fone de Ouvido Bluetooth JBL Tune 510BT',
    description: 'Fone de ouvido sem fio com cancelamento de ruído',
    category: 'Áudio',
    price: 180,
    cost: 120,
    prices: { amazon: 180, meli: 175, shopee: 160 },
    stock: 2,
    minStock: 10,
    aging: 75
  },
  {
    id: 'prod-003',
    sku: 'PROD-003',
    name: 'Carregador Portátil Anker PowerCore 10000mAh',
    title: 'Carregador Portátil Anker PowerCore 10000mAh',
    description: 'Power bank com capacidade de 10000mAh',
    category: 'Acessórios',
    price: 140,
    cost: 80,
    prices: { amazon: 140, meli: 135, shopee: 130 },
    stock: 45,
    minStock: 15,
    aging: 10
  },
  {
    id: 'prod-004',
    name: 'Notebook Dell Inspiron 15',
    description: 'Notebook para uso profissional com 8GB RAM',
    category: 'Informática',
    price: 2500,
    stock: 8,
    minStock: 3
  },
  {
    id: 'prod-005',
    name: 'Mouse Gamer Logitech G502',
    description: 'Mouse gamer com sensor óptico de alta precisão',
    category: 'Periféricos',
    price: 350,
    stock: 0,
    minStock: 5
  }
];

export const mockStats = {
  totalProducts: mockProducts.length,
  newProductsThisMonth: 3,
  totalValue: mockProducts.reduce((sum, product) => sum + (product.price * product.stock), 0),
  monthlyGrowth: 12.5,
  lowStockItems: mockProducts.filter(p => p.stock > 0 && p.stock <= p.minStock).length,
  outOfStockItems: mockProducts.filter(p => p.stock === 0).length,
  revenueD1: 12500,
  revenueMTD: 188000,
  ordersD1: 92,
  marginPct: 23.4,
  ruptureCount: 6,
  excessCount: 12,
  salesSeries30d: [
    // pares dia-valor para gráfico
    { day: 1, value: 5200 }, { day: 2, value: 6100 }, { day: 3, value: 4900 },
    { day: 4, value: 7800 }, { day: 5, value: 6600 }, { day: 6, value: 7100 },
    { day: 7, value: 8400 }, { day: 8, value: 7200 }, { day: 9, value: 6800 },
    { day: 10, value: 8100 }, { day: 11, value: 7500 }, { day: 12, value: 6900 },
    { day: 13, value: 8300 }, { day: 14, value: 7700 }, { day: 15, value: 8600 },
    { day: 16, value: 7400 }, { day: 17, value: 6700 }, { day: 18, value: 8200 },
    { day: 19, value: 7800 }, { day: 20, value: 7300 }, { day: 21, value: 8500 },
    { day: 22, value: 7600 }, { day: 23, value: 6500 }, { day: 24, value: 8000 },
    { day: 25, value: 7900 }, { day: 26, value: 7100 }, { day: 27, value: 8400 },
    { day: 28, value: 7200 }, { day: 29, value: 6800 }, { day: 30, value: 8300 }
  ],
  topProfitSkus: [
    { sku: 'PROD-001', profit: 3200 },
    { sku: 'PROD-003', profit: 1900 },
    { sku: 'PROD-002', profit: 1100 }
  ]
};