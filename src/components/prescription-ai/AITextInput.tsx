import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { cn } from '@/lib/utils';

interface AITextInputProps {
  value: string;
  onChange: (value: string) => void;
  onParse?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const GHOST_COMPLETIONS: Record<string, string> = {
  'amox': 'amoxicillin 875mg BID x10d',
  'ibu': 'ibuprofen 400mg TID x5d',
  'pred': 'prednisone taper 40mg 5d, 20mg 5d, 10mg 5d',
  'met': 'metformin 500mg BID long-term',
  'lisin': 'lisinopril 10mg QD long-term',
  'sim': 'simvastatin 20mg QPM long-term',
};

const HINTS = [
  "Try: amoxicillin 875 BID x10d",
  "Try: ibuprofen 400 TID x5d", 
  "Try: prednisone taper 40mg 5d, 20mg 5d, 10mg 5d",
  "Try: metformin 500 BID long-term",
];

export function AITextInput({ 
  value, 
  onChange, 
  onParse, 
  placeholder = "Type prescription here...",
  className 
}: AITextInputProps) {
  const [ghostText, setGhostText] = useState('');
  const [currentHint, setCurrentHint] = useState(0);
  const [isParsing, setIsParsing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const parseTimeoutRef = useRef<NodeJS.Timeout>();

  // Rotate hints every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHint(prev => (prev + 1) % HINTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Debounced parsing
  useEffect(() => {
    if (parseTimeoutRef.current) {
      clearTimeout(parseTimeoutRef.current);
    }

    if (value.trim() && onParse) {
      setIsParsing(true);
      parseTimeoutRef.current = setTimeout(() => {
        onParse(value);
        setIsParsing(false);
      }, 300);
    } else {
      setIsParsing(false);
    }

    return () => {
      if (parseTimeoutRef.current) {
        clearTimeout(parseTimeoutRef.current);
      }
    };
  }, [value, onParse]);

  const updateGhostText = useCallback((input: string) => {
    const words = input.toLowerCase().split(' ');
    const lastWord = words[words.length - 1];
    
    if (lastWord && GHOST_COMPLETIONS[lastWord] && !input.includes(GHOST_COMPLETIONS[lastWord])) {
      const completion = GHOST_COMPLETIONS[lastWord];
      if (completion.toLowerCase().startsWith(input.toLowerCase())) {
        setGhostText(completion.slice(input.length));
        return;
      }
    }
    
    setGhostText('');
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    updateGhostText(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.key === 'Tab' || e.key === 'Enter') && ghostText) {
      e.preventDefault();
      const newValue = value + ghostText;
      onChange(newValue);
      setGhostText('');
      updateGhostText(newValue);
    } else if (e.key === 'Escape') {
      setGhostText('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <AutosizeTextarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-md border border-border bg-surface px-3 py-2 text-base placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed resize-none",
            className
          )}
          minRows={2}
          maxRows={8}
        />
        {ghostText && (
          <div className="absolute inset-0 px-3 py-2 pointer-events-none text-base text-fg-muted/50 whitespace-pre-wrap">
            <span className="invisible">{value}</span>
            <span>{ghostText}</span>
          </div>
        )}
        {isParsing && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-fg-muted">
            <div className="animate-spin h-3 w-3 border border-fg-muted border-t-transparent rounded-full" />
            Parsing...
          </div>
        )}
      </div>
      {!value && (
        <p className="text-xs text-fg-muted transition-opacity duration-300">
          {HINTS[currentHint]}
        </p>
      )}
    </div>
  );
}