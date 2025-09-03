import React, { useState } from 'react';
import { Mic, MicOff, Sparkles, Wand2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { cn } from '@/lib/utils';

interface AIPromptBoxProps {
  value: string;
  onChange: (value: string) => void;
  onDraftPrescription: (prompt: string) => void;
  onManual: () => void;
}

const QUICK_CHIPS = [
  'Augmentin 875 BID x10d',
  'Azithro 500 QD x3d', 
  'Prednisone taper 40→20→10',
  'Metformin 500 BID long-term'
];

export function AIPromptBox({ value, onChange, onDraftPrescription, onManual }: AIPromptBoxProps) {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      // Mock voice functionality with delay
      setTimeout(() => {
        onChange("Amoxicillin 875 mg twice daily for 10 days, no refills");
        setIsListening(false);
      }, 2000);
    }
  };

  const handleChipClick = (chip: string) => {
    onChange(chip);
  };

  const handleDraft = () => {
    if (value.trim()) {
      onDraftPrescription(value);
    }
  };

  return (
    <Card className="bg-surface border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-medium text-fg">GoldCare AI</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            Draft • Mock
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <AutosizeTextarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Describe the prescription (e.g., 'Amoxicillin 875 twice daily for 10 days; no refills')."
            className="min-h-20 pr-12 resize-none"
          />
          <Button
            variant={isListening ? "default" : "ghost"}
            size="sm"
            className={cn(
              "absolute right-2 top-2",
              isListening && "animate-pulse"
            )}
            onClick={handleVoiceToggle}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
          {isListening && (
            <div className="absolute bottom-2 left-2 text-xs text-primary animate-shimmer">
              Listening...
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {QUICK_CHIPS.map((chip, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleChipClick(chip)}
              className="text-xs"
            >
              {chip}
            </Button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onManual}
            className="text-fg-muted hover:text-fg"
          >
            Manual
          </Button>
          <Button 
            onClick={handleDraft}
            disabled={!value.trim()}
            className="gap-2"
          >
            <Wand2 className="h-4 w-4" />
            Draft prescription
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}