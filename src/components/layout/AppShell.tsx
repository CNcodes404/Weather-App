interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen">
      {/* pb-24 on mobile leaves room above the fixed bottom nav */}
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-6 max-w-4xl">
        {children}
      </main>
    </div>
  )
}
