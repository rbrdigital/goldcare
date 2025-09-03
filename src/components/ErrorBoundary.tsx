import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('🚨 ErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 ErrorBoundary componentDidCatch:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      
      if (FallbackComponent) {
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <div className="max-w-md w-full space-y-4">
            <Alert className="border-danger">
              <AlertTriangle className="h-4 w-4 text-danger" />
              <AlertDescription className="text-fg">
                Something went wrong. The component encountered an error and couldn't render properly.
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-col gap-2 text-sm text-fg-muted">
              {this.state.error && (
                <details className="bg-surface border border-border rounded-md p-3">
                  <summary className="cursor-pointer font-medium">Error Details</summary>
                  <code className="block mt-2 text-xs whitespace-pre-wrap break-all">
                    {this.state.error.message}
                  </code>
                </details>
              )}
            </div>

            <Button 
              onClick={this.resetError}
              variant="default"
              className="w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;