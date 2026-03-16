'use client';

import { useState } from 'react';
import { Plugin, PluginStatus } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings, RefreshCw, AlertCircle, CheckCircle2, Clock, WifiOff } from 'lucide-react';

interface PluginCardProps {
  plugin: Plugin;
  onToggle: (id: string, enabled: boolean) => void;
  onSave: (id: string, config: Record<string, string>) => void;
}

const statusConfig: Record<PluginStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
  connected: {
    label: 'Conectado',
    variant: 'default',
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  disconnected: {
    label: 'Desconectado',
    variant: 'secondary',
    icon: <WifiOff className="w-3 h-3" />,
  },
  error: {
    label: 'Erro',
    variant: 'destructive',
    icon: <AlertCircle className="w-3 h-3" />,
  },
  pending: {
    label: 'Pendente',
    variant: 'outline',
    icon: <Clock className="w-3 h-3" />,
  },
};

function formatLastSync(iso?: string): string {
  if (!iso) return '—';
  const date = new Date(iso);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function PluginCard({ plugin, onToggle, onSave }: PluginCardProps) {
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>(plugin.config ?? {});
  const status = statusConfig[plugin.status];

  function handleSave() {
    onSave(plugin.id, formValues);
    setOpen(false);
  }

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none" role="img" aria-label={plugin.name}>
                {plugin.icon}
              </span>
              <div>
                <p className="font-semibold leading-tight">{plugin.name}</p>
                <Badge variant={status.variant} className="mt-1 gap-1 text-xs">
                  {status.icon}
                  {status.label}
                </Badge>
              </div>
            </div>
            <Switch
              checked={plugin.enabled}
              onCheckedChange={(checked) => onToggle(plugin.id, checked)}
              aria-label={`${plugin.enabled ? 'Desativar' : 'Ativar'} ${plugin.name}`}
            />
          </div>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 gap-4">
          <p className="text-sm text-muted-foreground">{plugin.description}</p>

          {(plugin.lastSync || plugin.ordersCount !== undefined) && (
            <div className="text-xs text-muted-foreground space-y-0.5">
              {plugin.lastSync && (
                <div className="flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  Última sincronia: {formatLastSync(plugin.lastSync)}
                </div>
              )}
              {plugin.ordersCount !== undefined && (
                <div>Pedidos sincronizados: {plugin.ordersCount}</div>
              )}
            </div>
          )}

          <div className="mt-auto">
            <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => setOpen(true)}>
              <Settings className="w-4 h-4" />
              Configurar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span role="img" aria-label={plugin.name}>{plugin.icon}</span>
              Configurar {plugin.name}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {plugin.fields.map((field) => (
              <div key={field.key} className="grid gap-1.5">
                <Label htmlFor={field.key}>{field.label}</Label>
                {field.type === 'select' ? (
                  <Select
                    value={formValues[field.key] ?? ''}
                    onValueChange={(val) => setFormValues((prev) => ({ ...prev, [field.key]: val }))}
                  >
                    <SelectTrigger id={field.key}>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.key}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formValues[field.key] ?? ''}
                    onChange={(e) =>
                      setFormValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                  />
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
