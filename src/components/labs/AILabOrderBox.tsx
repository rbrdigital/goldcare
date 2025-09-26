import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Mic, MicOff } from 'lucide-react';
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
    <Card className="p-6 bg-gradient-to-br from-surface via-surface to-surface/80 border-2 border-primary/20 shadow-lg" data-testid="ai-lab-order-box">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/30 flex items-center justify-center">
          <GoldCareAIIcon className="h-6 w-6 text-primary" />
        </div>
        <span className="font-semibold text-fg text-lg">GoldCare AI</span>
      </div>

      {/* Input Area */}
      <div className="space-y-6">
        <div className="relative">
          <AutosizeTextarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the labs (e.g., 'CBC, CMP; Dx: E11.9 and I10; fasting')."
            minRows={3}
            maxRows={6}
            className="pr-12 resize-none text-base"
            disabled={isLoading}
          />
          <Button
            size="icon"
            variant={isListening ? "default" : "ghost"}
            className={cn(
              "absolute top-3 right-3 h-9 w-9",
              isListening && "bg-primary text-on-primary animate-pulse"
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
            <div className="absolute top-12 right-3 text-sm text-primary font-medium">
              Listening...
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="flex flex-wrap gap-3">
          {quickPrompts.map((quickPrompt) => (
            <Button
              key={quickPrompt}
              variant="outline"
              size="sm"
              className="text-sm font-medium"
              onClick={() => handleChipClick(quickPrompt)}
              disabled={isLoading}
            >
              {quickPrompt}
            </Button>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Button 
            onClick={handleDraft}
            disabled={!prompt.trim() || isLoading}
            className="w-full sm:w-auto font-semibold"
            size="lg"
          >
            <GoldCareAIIcon className="h-4 w-4 mr-2" />
            {isLoading ? 'Drafting...' : 'Draft with AI'}
          </Button>
        </div>
      </div>
    </Card>
  );
}