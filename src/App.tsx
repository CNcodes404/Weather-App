import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { TooltipProvider } from '@/components/ui/tooltip'
import { MobileNav } from '@/components/layout/MobileNav'
import { WeatherDashboard } from '@/pages/WeatherDashboard'

function App() {
  return (
    <TooltipProvider>
      <ErrorBoundary>
        <WeatherDashboard />
      </ErrorBoundary>
      <MobileNav />
    </TooltipProvider>
  )
}

export default App
