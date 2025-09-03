import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InlineAlertProps {
  type: 'allergy' | 'interaction' | 'duplicate' | 'info';
  message: string;
  className?: string;
}

export function InlineAlert({ type, message, className }: InlineAlertProps) {
  const getIcon = () => {
    switch (type) {
      case 'allergy':
        return <AlertTriangle className="h-4 w-4" />;
      case 'interaction':
        return <AlertCircle className="h-4 w-4" />;
      case 'duplicate':
        return <AlertCircle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'allergy':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'interaction':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'duplicate':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'info':
        return 'bg-info/10 text-info border-info/20';
      default:
        return 'bg-surface border-border';
    }
  };

  return (
    <div className={cn(
      "flex items-start gap-2 p-2 rounded-md border text-sm",
      getStyles(),
      className
    )}>
      {getIcon()}
      <span className="flex-1">{message}</span>
    </div>
  );
}