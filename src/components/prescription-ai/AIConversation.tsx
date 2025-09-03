import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, AlertTriangle, RefreshCw, Edit3, Plus } from 'lucide-react';
import { ParsedPrescription } from '@/types/prescription';
import { cn } from '@/lib/utils';

interface AIConversationProps {
  prompt: string;
  onInsertIntoForm: (prescriptions: ParsedPrescription[]) => void;
  onRevise: (prompt: string) => void;
  onRegenerate: () => void;
}

interface ConversationExchange {
  id: string;
  userMessage: string;
  aiResponse: string;
  prescriptions: ParsedPrescription[];
  guardrails: Array<{ type: 'allergy' | 'interaction' | 'duplicate'; message: string; }>;
}

export function AIConversation({ prompt, onInsertIntoForm, onRevise, onRegenerate }: AIConversationProps) {
  const [exchanges, setExchanges] = useState<ConversationExchange[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEarlier, setShowEarlier] = useState(false);

  useEffect(() => {
    if (prompt) {
      processPrompt(prompt);
    }
  }, [prompt]);

  const processPrompt = async (userPrompt: string) => {
    setIsTyping(true);

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 150 + 150));

    // Mock AI processing
    const mockPrescriptions: ParsedPrescription[] = [{
      id: `rx-${Date.now()}`,
      medication: 'Amoxicillin',
      strength: '875 mg',
      route: 'oral',
      frequency: 'twice daily',
      duration: '10',
      quantity: 20,
      refills: 0,
      substitutions: true,
      startDate: new Date().toISOString().split('T')[0],
      earliestFillDate: new Date().toISOString().split('T')[0]
    }];

    const mockGuardrails = [
      { type: 'allergy' as const, message: 'Patient has penicillin allergy - monitor for cross-reactivity' }
    ];

    const newExchange: ConversationExchange = {
      id: `exchange-${Date.now()}`,
      userMessage: userPrompt,
      aiResponse: 'I\'ve drafted Amoxicillin 875 mg twice daily for 10 days with no refills. Please note the penicillin allergy alert.',
      prescriptions: mockPrescriptions,
      guardrails: mockGuardrails
    };

    setExchanges(prev => [newExchange, ...prev.slice(0, 2)]); // Keep only last 3
    setIsTyping(false);
  };

  const visibleExchanges = showEarlier ? exchanges : exchanges.slice(0, 3);

  return (
    <div className="space-y-4">
      {/* Typing indicator */}
      {isTyping && (
        <Card className="bg-surface border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-primary" />
              </div>
              <div className="flex gap-1">
                <div className="h-2 w-2 bg-fg-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="h-2 w-2 bg-fg-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="h-2 w-2 bg-fg-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exchanges */}
      {visibleExchanges.map((exchange, index) => (
        <div key={exchange.id} className="space-y-3">
          {/* User message */}
          <div className="flex justify-end">
            <Card className="bg-primary text-on-primary max-w-[80%]">
              <CardContent className="p-3">
                <p className="text-sm">{exchange.userMessage}</p>
              </CardContent>
            </Card>
          </div>

          {/* AI response */}
          <Card className="bg-surface border-border">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <Sparkles className="h-3 w-3 text-primary" />
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-sm text-fg">{exchange.aiResponse}</p>

                  {/* Guardrails */}
                  {exchange.guardrails.length > 0 && (
                    <div className="space-y-2">
                      {exchange.guardrails.map((guardrail, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <AlertTriangle className="h-3 w-3 text-warning" />
                          <span className="text-warning">{guardrail.message}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button 
                      size="sm" 
                      onClick={() => onInsertIntoForm(exchange.prescriptions)}
                      className="gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Insert into form
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onRevise(exchange.userMessage)}
                    >
                      <Edit3 className="h-3 w-3" />
                      Revise
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={onRegenerate}
                    >
                      <RefreshCw className="h-3 w-3" />
                      Regenerate
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}

      {/* Show earlier link */}
      {exchanges.length > 3 && !showEarlier && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowEarlier(true)}
          className="w-full text-fg-muted"
        >
          Show earlier drafts ({exchanges.length - 3} more)
        </Button>
      )}
    </div>
  );
}