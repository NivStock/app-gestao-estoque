'use client';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Product } from '@/lib/types';

interface ProductsTableProps {
  products: Product[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function getStockStatus(product: Product) {
  if (product.stock === 0) return { label: 'Zerado', variant: 'destructive' as const };
  if (product.stock <= product.minStock) return { label: 'Baixo', variant: 'secondary' as const };
  return { label: 'OK', variant: 'outline' as const };
}

export function ProductsTable({ products }: ProductsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Preço</TableHead>
            <TableHead className="text-right">Estoque</TableHead>
            <TableHead className="text-right">Mínimo</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const status = getStockStatus(product);
            return (
              <TableRow key={product.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {product.sku ?? product.id}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                <TableCell className="text-right font-medium">{product.stock}</TableCell>
                <TableCell className="text-right text-muted-foreground">{product.minStock}</TableCell>
                <TableCell>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
