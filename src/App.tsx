import { TooltipProvider } from '@/components/ui/tooltip'
import { MobileNav } from '@/components/layout/MobileNav'
import { WeatherDashboard } from '@/pages/WeatherDashboard'

function App() {
  return (
    <TooltipProvider>
      <WeatherDashboard />
      <MobileNav />
    </TooltipProvider>
  )
}

export default App
