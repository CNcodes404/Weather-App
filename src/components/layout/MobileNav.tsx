import { CloudSun, Map, Sparkles, Settings2 } from 'lucide-react'

type Tab = 'weather' | 'map' | 'ai' | 'settings'

const TABS: { key: Tab; label: string; icon: typeof CloudSun; target: string }[] = [
  { key: 'weather', label: 'Weather', icon: CloudSun, target: '#section-weather' },
  { key: 'map', label: 'Map', icon: Map, target: '#section-map' },
  { key: 'ai', label: 'AI', icon: Sparkles, target: '#section-ai' },
  { key: 'settings', label: 'Settings', icon: Settings2, target: '#section-settings' },
]

function scrollTo(id: string) {
  const el = document.querySelector(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="backdrop-blur-md bg-black/40 border-t border-white/10">
        <div className="flex">
          {TABS.map(({ key, label, icon: Icon, target }) => (
            <button
              key={key}
              onClick={() => scrollTo(target)}
              className="flex flex-1 flex-col items-center justify-center gap-1 py-3 min-h-[56px] text-white/50 hover:text-white transition-colors active:scale-95"
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
