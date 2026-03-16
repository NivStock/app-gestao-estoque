'use client';

import { useState } from 'react';
import { plugins as initialPlugins, Plugin } from '@/lib/plugins';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Star, Package, ExternalLink, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MarketplacePage() {
  const [pluginList, setPluginList] = useState<Plugin[]>(initialPlugins);
  const [search, setSearch] = useState('');

  const filtered = pluginList.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  function toggleInstall(id: string) {
    setPluginList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, installed: !p.installed } : p))
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Plugin Marketplace</h1>
          <p className="text-muted-foreground mt-1">
            Discover and install plugins to extend your workflow.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search plugins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Plugin grid */}
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">No plugins found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((plugin) => (
              <Card key={plugin.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-tight">{plugin.name}</CardTitle>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {plugin.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">by {plugin.author}</p>
                </CardHeader>
                <CardContent className="flex-1 pb-3">
                  <CardDescription className="text-sm leading-relaxed">
                    {plugin.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {plugin.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between pt-0 gap-2">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {plugin.stars !== undefined && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {plugin.stars >= 1000
                          ? `${(plugin.stars / 1000).toFixed(1)}k`
                          : plugin.stars}
                      </span>
                    )}
                    {plugin.npmPackage && (
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {plugin.npmPackage}
                      </span>
                    )}
                    {plugin.website && (
                      <a
                        href={plugin.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-foreground"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Website
                      </a>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant={plugin.installed ? 'outline' : 'default'}
                    onClick={() => toggleInstall(plugin.id)}
                    className="shrink-0"
                  >
                    {plugin.installed ? 'Uninstall' : 'Install'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
