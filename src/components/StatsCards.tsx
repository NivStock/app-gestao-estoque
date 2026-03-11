'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Stats } from '@/lib/types';

interface StatsCardsProps {
  stats: Stats;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total de Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProducts}</div>
          <p className="text-xs text-muted-foreground mt-1">
            +{stats.newProductsThisMonth} este mês
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Valor em Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            +{stats.monthlyGrowth}% vs. mês anterior
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Receita MTD</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.revenueMTD)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.ordersD1} pedidos hoje
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Alertas de Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">{stats.lowStockItems + stats.outOfStockItems}</div>
            {stats.outOfStockItems > 0 && (
              <Badge variant="destructive" className="text-xs">
                {stats.outOfStockItems} zerado
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.lowStockItems} abaixo do mínimo
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Receita D-1</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.revenueD1)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Margem: {stats.marginPct}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Ruptura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{stats.ruptureCount}</div>
          <p className="text-xs text-muted-foreground mt-1">SKUs sem estoque</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Excesso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.excessCount}</div>
          <p className="text-xs text-muted-foreground mt-1">SKUs com excesso</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Margem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.marginPct}%</div>
          <p className="text-xs text-muted-foreground mt-1">Margem bruta média</p>
        </CardContent>
      </Card>
    </div>
  );
}
