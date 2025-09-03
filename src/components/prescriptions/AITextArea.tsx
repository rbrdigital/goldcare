import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';

interface AITextAreaProps {
  value: string;
  onChange: (value: string) => void;
  onParse?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const GHOST_COMPLETIONS = {
  'azith': 'azithromycin 500 mg PO once daily x 3 days',
  'amox': 'amoxicillin–clavulanate 875/125 mg PO BID x 10 days',
  'ibuprofen': 'ibuprofen 400 mg PO TID x 5 days',
  'prednis': 'prednisone taper 40mg 5d, 20mg 5d, 10mg 5d',
  'metform': 'metformin 500 mg PO BID long-term'
};

const HINTS = [
  "Try: azithromycin 500 mg PO once daily x 3 days",
  "Try: amoxicillin 875 BID x10d",
  "Try: ibuprofen 400 TID x5d",
  "Try: prednisone taper 40mg 5d, 20mg 5d, 10mg 5d"
];

export function AITextArea({ 
  value, 
  onChange, 
  onParse,
  placeholder = "Type prescription here (e.g., Amoxicillin 875 BID x10d)",
  className 
}: AITextAreaProps) {
  const [ghostText, setGhostText] = useState('');
  const [currentHint, setCurrentHint] = useState(0);
  const [isParsing, setIsParsing] = useState(false);

  // Rotate hints every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHint(prev => (prev + 1) % HINTS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Generate ghost text based on input
  const updateGhostText = useCallback((input: string) => {
    const lowerInput = input.toLowerCase().trim();
    if (!lowerInput) {
      setGhostText('');
      return;
    }

    for (const [key, completion] of Object.entries(GHOST_COMPLETIONS)) {
      if (key.startsWith(lowerInput) && lowerInput.length >= 3) {
        setGhostText(completion);
        return;
      }
    }
    setGhostText('');
  }, []);

  // Debounced parsing trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value.trim() && onParse) {
        setIsParsing(true);
        setTimeout(() => {
          onParse(value);
          setIsParsing(false);
        }, 200); // Simulate AI thinking
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, onParse]);

  const handleChange = (newValue: string) => {
    onChange(newValue);
    updateGhostText(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && ghostText && value.length < ghostText.length) {
      e.preventDefault();
      handleChange(ghostText);
      setGhostText('');
    } else if (e.key === 'Enter' && ghostText && value.length < ghostText.length) {
      e.preventDefault();
      handleChange(ghostText);
      setGhostText('');
    } else if (e.key === 'Escape') {
      setGhostText('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <AutosizeTextarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-md border border-border bg-surface px-3 py-2 text-base placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed resize-none",
            className
          )}
          minRows={3}
          maxRows={6}
          data-autosize
        />
        
        {/* Ghost text overlay */}
        {ghostText && value.length < ghostText.length && (
          <div className="absolute inset-0 px-3 py-2 pointer-events-none text-base text-fg-muted/50 whitespace-pre-wrap">
            <span className="invisible">{value}</span>
            <span>{ghostText.slice(value.length)}</span>
          </div>
        )}
      </div>

      {/* Parsing indicator */}
      {isParsing && (
        <div className="h-1 bg-surface rounded-full overflow-hidden">
          <div className="h-full bg-primary/30 animate-pulse" />
        </div>
      )}

      {/* Hint text */}
      {!value && (
        <p className="text-xs text-fg-muted animate-pulse">
          {HINTS[currentHint]}
        </p>
      )}

      {!value && (
        <p className="text-xs text-fg-muted">
          Examples: amox 875 BID x10d; ibuprofen 400 TID x5d
        </p>
      )}
    </div>
  );
}