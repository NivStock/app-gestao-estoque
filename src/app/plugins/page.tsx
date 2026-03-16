'use client';

import { useState, useMemo } from 'react';
import { Plugin } from '@/lib/types';
import { mockPlugins, pluginCategoryLabels } from '@/lib/mock-plugins';
import { PluginCard } from '@/components/plugins/PluginCard';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Puzzle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const ALL_CATEGORY = 'all';

export default function PluginsPage() {
  const [plugins, setPlugins] = useState<Plugin[]>(mockPlugins);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(mockPlugins.map((p) => p.category)));
    return cats;
  }, []);

  const filtered = useMemo(() => {
    return plugins.filter((p) => {
      const matchesSearch =
        search.trim() === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === ALL_CATEGORY || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [plugins, search, activeCategory]);

  const connectedCount = plugins.filter((p) => p.status === 'connected').length;
  const enabledCount = plugins.filter((p) => p.enabled).length;
  const errorCount = plugins.filter((p) => p.status === 'error').length;

  function handleToggle(id: string, enabled: boolean) {
    setPlugins((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              enabled,
              status: enabled ? (p.status === 'disconnected' ? 'pending' : p.status) : 'disconnected',
            }
          : p
      )
    );
  }

  function handleSave(id: string, config: Record<string, string>) {
    setPlugins((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              config,
              status: Object.values(config).some((v) => v.trim() !== '') ? 'connected' : 'disconnected',
              enabled: Object.values(config).some((v) => v.trim() !== '') ? true : p.enabled,
              lastSync: Object.values(config).some((v) => v.trim() !== '')
                ? new Date().toISOString()
                : p.lastSync,
            }
          : p
      )
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <Puzzle className="w-6 h-6 text-primary shrink-0" />
          <div>
            <h1 className="text-xl font-bold leading-tight">Gerenciar Plugins</h1>
            <p className="text-sm text-muted-foreground">
              Conecte marketplaces, ERPs e serviços ao seu estoque
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stats row */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
            <span className="font-medium">{plugins.length}</span>
            <span className="text-muted-foreground">plugins disponíveis</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
            <span className="font-medium text-green-600">{connectedCount}</span>
            <span className="text-muted-foreground">conectados</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
            <span className="font-medium">{enabledCount}</span>
            <span className="text-muted-foreground">ativos</span>
          </div>
          {errorCount > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm">
              <span className="font-medium text-destructive">{errorCount}</span>
              <span className="text-muted-foreground">com erro</span>
            </div>
          )}
        </div>

        {/* Search + category filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar plugin..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={activeCategory === ALL_CATEGORY ? 'default' : 'outline'}
              className="cursor-pointer px-3 py-1 text-sm"
              onClick={() => setActiveCategory(ALL_CATEGORY)}
            >
              Todos
            </Badge>
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={activeCategory === cat ? 'default' : 'outline'}
                className="cursor-pointer px-3 py-1 text-sm"
                onClick={() => setActiveCategory(cat)}
              >
                {pluginCategoryLabels[cat] ?? cat}
              </Badge>
            ))}
          </div>
        </div>

        {/* Plugin grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
            <Puzzle className="w-10 h-10 opacity-30" />
            <p className="text-sm">Nenhum plugin encontrado.</p>
          </div>
        ) : (
          <>
            {activeCategory === ALL_CATEGORY
              ? categories.map((cat) => {
                  const catPlugins = filtered.filter((p) => p.category === cat);
                  if (catPlugins.length === 0) return null;
                  return (
                    <section key={cat} className="space-y-3">
                      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        {pluginCategoryLabels[cat] ?? cat}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {catPlugins.map((plugin) => (
                          <PluginCard
                            key={plugin.id}
                            plugin={plugin}
                            onToggle={handleToggle}
                            onSave={handleSave}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })
              : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((plugin) => (
                    <PluginCard
                      key={plugin.id}
                      plugin={plugin}
                      onToggle={handleToggle}
                      onSave={handleSave}
                    />
                  ))}
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}
