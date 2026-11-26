import React, { Component } from 'react';

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#0A0816] text-[#F5F3FF] flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-2xl border border-[#4C4585]/60 bg-[#15122B] p-6 text-center space-y-4">
            <h1 className="text-lg font-bold">Something went wrong</h1>
            <p className="text-xs text-[#A9A4C8]">
              An unexpected error interrupted this screen. Reload to restore your workspace cleanly.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#5EEAD4] text-xs font-bold text-[#0A0816] cursor-pointer"
            >
              Reload OverThink
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
