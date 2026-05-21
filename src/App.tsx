import { TooltipProvider } from '@/components/ui/tooltip'
import { WeatherDashboard } from '@/pages/WeatherDashboard'

function App() {
  return (
    <TooltipProvider>
      <WeatherDashboard />
    </TooltipProvider>
  )
}

export default App
