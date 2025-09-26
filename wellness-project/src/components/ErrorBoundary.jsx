import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 bg-red-50 text-red-800 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">Something went wrong.</h2>
                    <p className="mb-4">We're sorry for the inconvenience. The error has been logged.</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition"
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
