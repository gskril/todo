export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-50 min-h-svh p-4 flex w-full justify-center items-center">
      <div className="bg-white max-w-96 mx-auto border-2 boder-slate-200 rounded-lg p-2 w-full h-fit shadow-sm">
        {children}
      </div>
    </div>
  )
}
