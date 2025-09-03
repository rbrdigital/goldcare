import React, { useState, useCallback } from 'react';
import { Send, Users, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ParsedPrescription, Alert } from '@/types/prescription';
import { parsePrescriptions, checkInteractions, MOCK_DATA } from './prescriptionParser';
import { PrescriptionCard } from './PrescriptionCard';
import { PharmacySelector } from './PharmacySelector';
import { AIPromptBox } from './AIPromptBox';
import { AIConversation } from './AIConversation';
import { getTodayISO } from '@/lib/dateUtils';

export function PrescriptionAIPanel() {
  const [promptValue, setPromptValue] = useState('');
  const [conversationPrompt, setConversationPrompt] = useState('');
  const [prescriptions, setPrescriptions] = useState<ParsedPrescription[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(MOCK_DATA.preferredPharmacy);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successTimer, setSuccessTimer] = useState<NodeJS.Timeout | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [focusedCardIndex, setFocusedCardIndex] = useState<number>(-1);

  const { toast } = useToast();

  const handleDraftPrescription = (prompt: string) => {
    setConversationPrompt(prompt);
    setPromptValue(''); // Clear the prompt box
  };

  const handleManual = () => {
    setShowManualForm(true);
    setConversationPrompt('');
  };

  const handleInsertIntoForm = (newPrescriptions: ParsedPrescription[]) => {
    // Apply field behavior fixes - dates default to today, convert duration to days
    const fixedPrescriptions = newPrescriptions.map(rx => ({
      ...rx,
      startDate: rx.startDate || getTodayISO(),
      earliestFillDate: rx.earliestFillDate || getTodayISO()
    }));
    
    setPrescriptions(fixedPrescriptions);
    setShowManualForm(true);
    
    toast({
      title: "Prescriptions inserted",
      description: `${newPrescriptions.length} prescription(s) added to form`,
    });
  };

  const handleRevise = (originalPrompt: string) => {
    setPromptValue(originalPrompt);
    setConversationPrompt('');
  };

  const handleRegenerate = () => {
    if (conversationPrompt) {
      // Re-trigger the same prompt
      setConversationPrompt(conversationPrompt + ' '); // Add space to trigger re-processing
    }
  };

  const updatePrescription = (index: number, updates: Partial<ParsedPrescription>) => {
    setPrescriptions(prev => prev.map((rx, i) => 
      i === index ? { ...rx, ...updates } : rx
    ));
  };

  const removePrescription = (index: number) => {
    const removed = prescriptions[index];
    setPrescriptions(prev => prev.filter((_, i) => i !== index));
    
    toast({
      title: "Prescription removed",
      description: `${removed.medication} prescription removed`,
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setPrescriptions(prev => {
              const newList = [...prev];
              newList.splice(index, 0, removed);
              return newList;
            });
          }}
        >
          Undo
        </Button>
      ),
    });
  };

  const duplicatePrescription = (index: number) => {
    const original = prescriptions[index];
    const duplicate = {
      ...original,
      id: `rx-${Date.now()}-dup`,
    };
    setPrescriptions(prev => {
      const newList = [...prev];
      newList.splice(index + 1, 0, duplicate);
      return newList;
    });
  };

  const validatePrescriptions = () => {
    return prescriptions.every(rx => 
      rx.medication && 
      (rx.strength || rx.isTaper) && 
      (rx.frequency || rx.isTaper) && 
      (rx.duration || rx.quantity)
    );
  };

  const handleSend = () => {
    if (!validatePrescriptions()) {
      toast({
        title: "Validation Error",
        description: "Please complete all prescription details",
        variant: "destructive",
      });
      return;
    }

    setIsSuccess(true);
    
    if (successTimer) clearTimeout(successTimer);
    const timer = setTimeout(() => {
      setIsSuccess(false);
    }, 5000);
    setSuccessTimer(timer);

    toast({
      title: "Prescriptions sent",
      description: `${prescriptions.length} prescription(s) sent to ${selectedPharmacy.name}`,
    });
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft saved",
      description: "Prescription draft saved successfully",
    });
  };

  const handleSendToManager = () => {
    toast({
      title: "Sent to manager",
      description: "Prescriptions sent to manager for review",
    });
  };

  const handleUndo = () => {
    setIsSuccess(false);
    if (successTimer) clearTimeout(successTimer);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp' && focusedCardIndex > 0) {
      setFocusedCardIndex(focusedCardIndex - 1);
      e.preventDefault();
    } else if (e.key === 'ArrowDown' && focusedCardIndex < prescriptions.length - 1) {
      setFocusedCardIndex(focusedCardIndex + 1);
      e.preventDefault();
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'Backspace' && focusedCardIndex >= 0) {
      removePrescription(focusedCardIndex);
      setFocusedCardIndex(Math.max(0, focusedCardIndex - 1));
      e.preventDefault();
    }
  };

  const allAlerts = checkInteractions(prescriptions);
  const getAlertsForPrescription = (prescriptionId: string) => {
    return allAlerts.filter(alert => alert.prescriptionId === prescriptionId);
  };

  return (
    <div className="h-full bg-bg flex flex-col" onKeyDown={handleKeyDown} tabIndex={-1}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-fg">Prescription AI</h1>
          {showManualForm && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowManualForm(false)}
              className="text-primary"
            >
              Edit with AI
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Success Banner */}
        {isSuccess && (
          <div className="bg-success/10 border border-success/20 rounded-md p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-success rounded-full" />
              <span className="text-success font-medium">
                Prescription sent to {selectedPharmacy.name}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleUndo}>
              Undo
            </Button>
          </div>
        )}

        {/* AI Prompt Box - Always visible */}
        {!showManualForm && (
          <AIPromptBox
            value={promptValue}
            onChange={setPromptValue}
            onDraftPrescription={handleDraftPrescription}
            onManual={handleManual}
          />
        )}

        {/* AI Conversation - Show when there's a conversation prompt */}
        {conversationPrompt && !showManualForm && (
          <>
            <Separator />
            <AIConversation
              prompt={conversationPrompt}
              onInsertIntoForm={handleInsertIntoForm}
              onRevise={handleRevise}
              onRegenerate={handleRegenerate}
            />
          </>
        )}

        {/* Manual Form - Show when requested or after AI insert */}
        {showManualForm && (
          <>
            <Separator />
            
            {/* Prescription Cards Stack */}
            {prescriptions.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-base font-medium text-fg">Prescriptions</h2>
                <div className="space-y-4">
                  {prescriptions.map((prescription, index) => (
                    <PrescriptionCard
                      key={prescription.id}
                      prescription={prescription}
                      alerts={getAlertsForPrescription(prescription.id)}
                      onUpdate={(updates) => updatePrescription(index, updates)}
                      onRemove={() => removePrescription(index)}
                      onDuplicate={() => duplicatePrescription(index)}
                      isReadOnly={isSuccess}
                      isFocused={focusedCardIndex === index}
                      onFocus={() => setFocusedCardIndex(index)}
                    />
                  ))}
                </div>
              </div>
            )}

            {prescriptions.length > 0 && <Separator />}

            {/* Routing & Actions Row */}
            <div className="space-y-4">
              <PharmacySelector
                selectedPharmacy={selectedPharmacy}
                onPharmacyChange={setSelectedPharmacy}
              />

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSendToManager}
                    className="text-fg-muted hover:text-fg"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Send to manager
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveDraft}
                    className="text-fg-muted hover:text-fg"
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Save as draft
                  </Button>
                </div>

                <Button
                  onClick={handleSend}
                  disabled={prescriptions.length === 0 || isSuccess || !validatePrescriptions()}
                  className="min-w-24"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>

            {/* Empty State */}
            {prescriptions.length === 0 && (
              <div className="text-center py-12 text-fg-muted">
                <p className="mb-2">No prescriptions added yet</p>
                <p className="text-sm">Use the AI prompt above to get started or add manually</p>
              </div>
            )}
          </>
        )}

        {/* Empty State - Show when no conversation and no manual form */}
        {!conversationPrompt && !showManualForm && (
          <div className="text-center py-12 text-fg-muted">
            <p className="mb-2">Describe your prescription to get AI assistance</p>
            <p className="text-sm">Or click "Manual" to create prescriptions directly</p>
          </div>
        )}
      </div>
    </div>
  );
}