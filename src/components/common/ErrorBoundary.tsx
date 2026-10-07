import { Component } from 'react'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (!this.state.hasError) return this.props.children
    if (this.props.fallback) return this.props.fallback

    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="relative backdrop-blur-md bg-black/[0.20] border border-white/[0.15] shadow-lg shadow-black/30 rounded-2xl overflow-hidden p-8 max-w-sm w-full text-center">
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
          <p className="text-white/80 mb-1 font-medium">Something went wrong</p>
          <p className="text-white/40 text-sm mb-5">The app hit an unexpected error.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/[0.15] text-white/70 hover:text-white text-sm transition-colors"
          >
            Reload page
          </button>
        </div>
      </div>
    )
  }
}
