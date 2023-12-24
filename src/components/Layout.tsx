export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-slate-50 p-4">
      <div className="boder-slate-200 mx-auto h-fit w-full max-w-96 rounded-lg border-2 bg-white p-2 shadow-sm">
        {children}
      </div>
    </div>
  )
}
