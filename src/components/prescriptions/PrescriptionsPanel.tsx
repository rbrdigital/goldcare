import React, { useState, useCallback } from 'react';
import { Plus, Send, Archive, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { AITextArea } from './AITextArea';
import { PrescriptionCard } from './PrescriptionCard';
import { PharmacySelector } from './PharmacySelector';
import { parsePrescription, checkInteractions, ParsedPrescription, MOCK_PATIENT } from './prescriptionParser';

export function PrescriptionsPanel() {
  const [inputValue, setInputValue] = useState('');
  const [prescriptions, setPrescriptions] = useState<ParsedPrescription[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(MOCK_PATIENT.preferredPharmacy);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successTimer, setSuccessTimer] = useState<NodeJS.Timeout | null>(null);

  const { toast } = useToast();

  const handleParse = useCallback((input: string) => {
    if (!input.trim()) {
      setPrescriptions([]);
      return;
    }

    const parsed = parsePrescription(input);
    setPrescriptions(parsed);
  }, []);

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
    const errors: string[] = [];
    
    prescriptions.forEach((rx, index) => {
      if (!rx.medication) errors.push(`Prescription ${index + 1}: Missing medication`);
      if (!rx.strength && !rx.isTaper) errors.push(`Prescription ${index + 1}: Missing strength`);
      if (!rx.frequency && !rx.isTaper) errors.push(`Prescription ${index + 1}: Missing frequency`);
      if (!rx.duration && !rx.quantity) errors.push(`Prescription ${index + 1}: Missing duration or quantity`);
    });

    return errors;
  };

  const handleSend = () => {
    const errors = validatePrescriptions();
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors[0],
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

  // Get alerts for all prescriptions
  const allAlerts = checkInteractions(prescriptions);
  const getAlertsForPrescription = (prescriptionId: string) => {
    return allAlerts.filter(alert => alert.prescriptionId === prescriptionId);
  };

  return (
    <div className="h-full bg-bg flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">New Prescription</h1>
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

        {/* Free-Text Input Area */}
        <div className="space-y-4">
          <AITextArea
            value={inputValue}
            onChange={setInputValue}
            onParse={handleParse}
          />
        </div>

        <Separator />

        {/* Prescription Cards Stack */}
        {prescriptions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-medium">Prescriptions</h2>
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
              disabled={prescriptions.length === 0 || isSuccess}
              className="min-w-24"
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>

        {/* Empty State */}
        {prescriptions.length === 0 && !inputValue && (
          <div className="text-center py-12 text-fg-muted">
            <p className="mb-2">Enter prescription details above to get started</p>
            <p className="text-sm">Examples: amox 875 BID x10d; ibuprofen 400 TID x5d</p>
          </div>
        )}
      </div>
    </div>
  );
}