import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="grid min-h-screen place-items-center bg-canvas px-6">
        <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 text-center">
          <p className="font-display text-lg font-semibold text-ink">This page failed to load</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {this.state.error.message || 'An unexpected error stopped the admin console.'}
          </p>
          <button
            type="button"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-[#0066FF] px-5 text-sm font-semibold text-white hover:bg-[#FF7A00]"
            onClick={() => {
              this.setState({ error: null })
              window.location.assign('/dashboard')
            }}
          >
            Reload dashboard
          </button>
        </div>
      </div>
    )
  }
}
