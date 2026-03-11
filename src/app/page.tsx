import { mockProducts, mockStats } from '@/lib/mock-data';
import { StatsCards } from '@/components/StatsCards';
import { ProductsTable } from '@/components/ProductsTable';
import { SalesChart } from '@/components/SalesChart';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Estoque</h1>
          <p className="text-muted-foreground mt-1">Visão geral do inventário e vendas</p>
        </div>

        <div className="space-y-8">
          <StatsCards stats={mockStats} />

          <SalesChart data={mockStats.salesSeries30d} />

          <div>
            <h2 className="text-xl font-semibold mb-4">Produtos</h2>
            <ProductsTable products={mockProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}
