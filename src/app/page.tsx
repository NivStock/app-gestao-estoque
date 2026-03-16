import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold">Lasy AI</h1>
      <p className="text-xl text-muted-foreground">
        Pronto para criar algo incrível!
      </p>
      <Link
        href="/marketplace"
        className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        Plugin Marketplace
      </Link>
    </div>
  )
}