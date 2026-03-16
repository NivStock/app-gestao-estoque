import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Puzzle } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-4xl font-bold">Lasy AI</h1>
      <p className="text-xl text-muted-foreground">
        Pronto para criar algo incrível!
      </p>
      <Link href="/plugins">
        <Button variant="outline" className="gap-2">
          <Puzzle className="w-4 h-4" />
          Gerenciar Plugins
        </Button>
      </Link>
    </div>
  )
}
