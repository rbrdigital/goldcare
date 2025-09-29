import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Mic, MicOff, Sparkles } from 'lucide-react';
import { GoldCareAIIcon } from '@/components/icons/GoldCareAIIcon';
import { cn } from '@/lib/utils';

interface AILabOrderBoxProps {
  onDraft: (prompt: string) => void;
  isLoading?: boolean;
}

export function AILabOrderBox({ onDraft, isLoading = false }: AILabOrderBoxProps) {
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);

  const quickPrompts = [
    'CBC',
    'CMP', 
    'Lipid panel',
    'A1C',
    'TSH',
    'CRP'
  ];

  const handleMicToggle = () => {
    if (!isListening) {
      setIsListening(true);
      // Mock listening behavior
      setTimeout(() => {
        setPrompt('CBC, CMP; Dx: E11.9 and I10; fasting');
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

  const handleChipClick = (chipText: string) => {
    if (prompt.trim()) {
      setPrompt(prompt + ', ' + chipText);
    } else {
      setPrompt(chipText);
    }
  };

  return (
    <Card className="p-10 bg-gradient-to-br from-surface/60 via-surface/95 to-surface/80 border border-border/40 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-sm" data-testid="ai-lab-order-box">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 mb-10">
        <div className="relative">
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-2 ring-primary/10">
            <GoldCareAIIcon className="h-6 w-6 text-primary animate-shimmer" />
          </div>
          <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping opacity-20" />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-fg text-lg">GoldCare AI</h3>
          <p className="text-xs text-fg-muted mt-0.5">Draft lab orders with natural language</p>
        </div>
      </div>

      {/* Input Area */}
      <div className="space-y-7">
        <div className="relative">
          <AutosizeTextarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the labs..."
            minRows={2}
            maxRows={6}
            className="w-full rounded-full px-7 py-5 pr-16 resize-none text-base placeholder:text-fg-muted/50 border-border/60 hover:border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/15 bg-bg/60 shadow-sm transition-all"
            disabled={isLoading}
          />
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "absolute top-3.5 right-3 h-10 w-10 rounded-full transition-all",
              isListening 
                ? "bg-primary text-on-primary hover:bg-primary/90 shadow-lg animate-pulse" 
                : "hover:bg-surface-muted/80"
            )}
            onClick={handleMicToggle}
            disabled={isLoading}
          >
            {isListening ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
          {isListening && (
            <div className="absolute -bottom-7 right-3 text-xs text-primary font-medium animate-fade-in">
              Listening...
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="overflow-x-auto scrollbar-hide -mx-3 px-3">
          <div className="flex gap-2.5 pb-1">
            {quickPrompts.map((quickPrompt) => (
              <button
                key={quickPrompt}
                onClick={() => handleChipClick(quickPrompt)}
                disabled={isLoading}
                className="flex-shrink-0 px-5 py-2.5 rounded-full bg-surface hover:bg-surface-muted border border-border/50 hover:border-border text-sm font-medium text-fg hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {quickPrompt}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-5 pt-3">
          <Button 
            onClick={handleDraft}
            disabled={!prompt.trim() || isLoading}
            className="w-full sm:w-auto px-10 py-6 rounded-full text-base font-semibold bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/95 hover:via-primary/95 hover:to-primary/85 text-on-primary shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-lg"
            size="lg"
          >
            <Sparkles className="h-5 w-5 mr-2.5" />
            {isLoading ? 'Drafting...' : 'Draft with AI'}
          </Button>
        </div>
      </div>
    </Card>
  );
}