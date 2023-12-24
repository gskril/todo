import { Card } from '@/components/ui/card'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-slate-50 p-4">
      <Card className="mx-auto w-full max-w-96">{children}</Card>
    </div>
  )
}
