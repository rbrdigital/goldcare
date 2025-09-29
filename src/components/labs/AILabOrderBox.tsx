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
    <Card className="p-8 bg-gradient-to-br from-surface/50 via-surface to-surface/80 border border-border/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm" data-testid="ai-lab-order-box">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
          <GoldCareAIIcon className="h-5 w-5 text-primary" />
        </div>
        <span className="font-semibold text-fg text-base">GoldCare AI</span>
      </div>

      {/* Input Area */}
      <div className="space-y-6">
        <div className="relative">
          <AutosizeTextarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the labs..."
            minRows={2}
            maxRows={6}
            className="w-full rounded-full px-6 py-4 pr-14 resize-none text-base placeholder:text-fg-muted/60 border-border/60 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 bg-bg/50 shadow-sm transition-all"
            disabled={isLoading}
          />
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "absolute top-3 right-2 h-10 w-10 rounded-full transition-all",
              isListening 
                ? "bg-primary text-on-primary hover:bg-primary/90 animate-pulse" 
                : "hover:bg-surface-muted"
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
            <div className="absolute -bottom-6 right-2 text-xs text-primary font-medium animate-fade-in">
              Listening...
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
          <div className="flex gap-2 pb-1">
            {quickPrompts.map((quickPrompt) => (
              <button
                key={quickPrompt}
                onClick={() => handleChipClick(quickPrompt)}
                disabled={isLoading}
                className="flex-shrink-0 px-4 py-2 rounded-full bg-surface/80 hover:bg-surface border border-border/50 text-sm font-medium text-fg hover:shadow-md hover:scale-[1.02] transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:hover:scale-100"
              >
                {quickPrompt}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4 pt-2">
          <Button 
            onClick={handleDraft}
            disabled={!prompt.trim() || isLoading}
            className="w-full sm:w-auto px-8 py-6 rounded-full text-base font-semibold bg-primary hover:bg-primary/90 text-on-primary shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
            size="lg"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            {isLoading ? 'Drafting...' : 'Draft with AI'}
          </Button>
        </div>
      </div>
    </Card>
  );
}