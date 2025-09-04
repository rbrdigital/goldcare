import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Mic, MicOff } from 'lucide-react';
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
    <Card className="p-6 bg-gradient-to-br from-surface via-surface to-surface/80 border-2 border-primary/20 shadow-lg" data-testid="ai-prompt-box">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/30">
            <span className="text-sm font-semibold text-primary">AI</span>
          </Avatar>
          <span className="font-semibold text-fg text-lg">GoldCare AI</span>
        </div>
        <Badge variant="outline" className="bg-success/10 text-success border-success/30">
          Ready • Mock
        </Badge>
      </div>

      {/* Input Area */}
      <div className="space-y-6">
        <div className="relative">
          <AutosizeTextarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the prescription (e.g., 'Amoxicillin 875 twice daily for 10 days; no refills')."
            minRows={3}
            maxRows={6}
            className="pr-12 resize-none text-base"
          />
          <Button
            size="icon"
            variant={isListening ? "default" : "ghost"}
            className={cn(
              "absolute top-3 right-3 h-9 w-9",
              isListening && "bg-primary text-on-primary animate-pulse"
            )}
            onClick={handleMicToggle}
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
              onClick={() => setPrompt(quickPrompt)}
            >
              {quickPrompt}
            </Button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleDraft}
            disabled={!prompt.trim()}
            className="flex-1 font-semibold"
            size="lg"
          >
            Draft prescription
          </Button>
          <Button 
            variant="ghost" 
            onClick={onManualEntry}
            className="font-medium text-primary hover:text-primary/80"
          >
            Manual entry
          </Button>
        </div>
      </div>
    </Card>
  );
}