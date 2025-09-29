import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Mic, MicOff, Sparkles } from 'lucide-react';
import { GoldCareAIIcon } from '@/components/icons/GoldCareAIIcon';
import { cn } from '@/lib/utils';

interface AIPromptBoxProps {
  onDraft: (prompt: string) => void;
  onManualEntry: () => void;
}

export function AIPromptBox({ onDraft, onManualEntry }: AIPromptBoxProps) {
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);

  const quickPrompts = [
    'Augmentin 875 BID x10d',
    'Azithro 500 QD x3d', 
    'Prednisone taper 40→20→10',
    'Metformin 500 BID long-term'
  ];

  const handleMicToggle = () => {
    if (!isListening) {
      setIsListening(true);
      // Mock listening behavior
      setTimeout(() => {
        setPrompt('Amoxicillin 875 twice daily for 10 days no refills');
        setIsListening(false);
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  const handleDraft = () => {
    if (prompt.trim()) {
      onDraft(prompt.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleDraft();
    }
  };

  return (
    <div className="space-y-6" data-testid="ai-prompt-box">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <GoldCareAIIcon className="h-4.5 w-4.5 text-primary animate-shimmer" />
        </div>
        <div>
          <h3 className="font-semibold text-fg text-base">GoldCare AI</h3>
          <p className="text-xs text-fg-muted">Draft prescriptions with natural language</p>
        </div>
      </div>

      {/* Input Area */}
      <div className="space-y-4">
        <div className="relative">
          <AutosizeTextarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the prescription..."
            minRows={2}
            maxRows={6}
            className="w-full rounded-full px-6 py-4 pr-14 resize-none text-base placeholder:text-fg-muted/50 border border-border/60 hover:border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 bg-bg transition-all"
          />
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "absolute top-3 right-2 h-9 w-9 rounded-full transition-all",
              isListening 
                ? "bg-primary text-on-primary hover:bg-primary/90 shadow-md" 
                : "hover:bg-surface-muted/60"
            )}
            onClick={handleMicToggle}
          >
            {isListening ? (
              <MicOff className="h-4.5 w-4.5" />
            ) : (
              <Mic className="h-4.5 w-4.5" />
            )}
          </Button>
          {isListening && (
            <div className="absolute -bottom-6 right-2 text-xs text-primary font-medium animate-fade-in">
              Listening...
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="overflow-x-auto scrollbar-hide -mx-1">
          <div className="flex gap-2 px-1 pb-1">
            {quickPrompts.map((quickPrompt) => (
              <button
                key={quickPrompt}
                onClick={() => setPrompt(quickPrompt)}
                className="flex-shrink-0 px-4 py-2 rounded-full bg-surface hover:bg-surface-muted border border-border/40 text-sm text-fg transition-colors duration-150 whitespace-nowrap"
              >
                {quickPrompt}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4 pt-1">
          <Button 
            onClick={handleDraft}
            disabled={!prompt.trim()}
            className="w-full sm:w-auto px-8 py-5 rounded-full text-base font-semibold bg-primary hover:bg-primary/90 text-on-primary shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 disabled:opacity-40 disabled:hover:scale-100"
            size="lg"
          >
            <Sparkles className="h-4.5 w-4.5 mr-2" />
            Draft with AI
          </Button>
          
          <button 
            onClick={onManualEntry}
            className="text-sm text-fg-muted hover:text-fg transition-colors duration-150 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-fg/60 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-150 after:origin-left"
          >
            Or fill the form manually
          </button>
        </div>
      </div>
    </div>
  );
}