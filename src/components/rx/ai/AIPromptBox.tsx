import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIPromptBoxProps {
  onSubmit: () => void;
}

export function AIPromptBox({ onSubmit }: AIPromptBoxProps) {
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

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-surface to-surface-muted border-2 border-primary/20 shadow-lg" data-testid="ai-prompt-box">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 bg-primary/10 border border-primary/20">
            <span className="text-sm font-medium text-primary">AI</span>
          </Avatar>
          <span className="font-medium text-fg">GoldCare AI</span>
        </div>
        <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
          Ready • Mock
        </Badge>
      </div>

      {/* Input Area */}
      <div className="space-y-4">
        <div className="relative">
          <AutosizeTextarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the prescription (e.g., 'Amoxicillin 875 twice daily for 10 days; no refills')."
            minRows={3}
            maxRows={6}
            className="pr-12 resize-none"
          />
          <Button
            size="icon"
            variant={isListening ? "default" : "ghost"}
            className={cn(
              "absolute top-3 right-3 h-8 w-8",
              isListening && "bg-primary text-on-primary animate-pulse"
            )}
            onClick={handleMicToggle}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
          {isListening && (
            <div className="absolute top-11 right-3 text-xs text-primary">
              Listening...
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((quickPrompt) => (
            <Button
              key={quickPrompt}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setPrompt(quickPrompt)}
            >
              {quickPrompt}
            </Button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleSubmit}
            disabled={!prompt.trim()}
            className="flex-1"
          >
            Draft prescription
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => {
              // Scroll to form
              const formElement = document.querySelector('[data-testid="rx-form"]');
              formElement?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Manual entry
          </Button>
        </div>
      </div>
    </Card>
  );
}