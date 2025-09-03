import React, { useState, useCallback } from 'react';
import { Plus, Send, Archive, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { AITextArea } from '../prescriptions/AITextArea';
import { PrescriptionCard } from '../prescriptions/PrescriptionCard';
import { PrescriptionHeader } from '../shared/prescriptions/ui/PrescriptionHeader';
import { PharmacyLine } from '../shared/prescriptions/ui/PharmacyLine';
import { PharmacyInlineSelector } from '../shared/prescriptions/ui/PharmacyInlineSelector';
import { parsePrescription, checkInteractions, MOCK_PATIENT } from '../prescriptions/prescriptionParser';
import { ParsedPrescription } from '@/types/prescription';
import { getTodayISO } from '@/lib/dateUtils';

export default function RXPanel() {
  const [inputValue, setInputValue] = useState('');
  const [prescriptions, setPrescriptions] = useState<ParsedPrescription[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(MOCK_PATIENT.preferredPharmacy);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successTimer, setSuccessTimer] = useState<NodeJS.Timeout | null>(null);
  const [showPharmacySelector, setShowPharmacySelector] = useState(false);

  const { toast } = useToast();

  const handleParse = useCallback((input: string) => {
    if (!input.trim()) {
      setPrescriptions([]);
      return;
    }

    const parsed = parsePrescription(input);
    // Apply field behavior fixes
    const fixedPrescriptions = parsed.map(rx => ({
      ...rx,
      startDate: rx.startDate || getTodayISO(),
      earliestFillDate: rx.earliestFillDate || getTodayISO(),
      // Remove location field
      location: undefined
    }));
    setPrescriptions(fixedPrescriptions);
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

  const handlePharmacySelect = (pharmacy: any) => {
    setSelectedPharmacy(pharmacy);
    setShowPharmacySelector(false);
    toast({
      title: "Pharmacy set",
      description: `Pharmacy set to ${pharmacy.name}`,
    });
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

        {/* Premium Prescription Headers */}
        {prescriptions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-medium">Prescriptions</h2>
            <div className="space-y-4">
              {prescriptions.map((prescription, index) => (
                <div key={prescription.id} className="space-y-4">
                  <PrescriptionHeader
                    prescription={prescription}
                    alerts={getAlertsForPrescription(prescription.id)}
                    onCopy={() => toast({ title: "Copied to clipboard" })}
                    onPreviewPDF={() => toast({ title: "PDF preview opened" })}
                  />
                  <PrescriptionCard
                    prescription={prescription}
                    alerts={getAlertsForPrescription(prescription.id)}
                    onUpdate={(updates) => updatePrescription(index, updates)}
                    onRemove={() => removePrescription(index)}
                    onDuplicate={() => duplicatePrescription(index)}
                    isReadOnly={isSuccess}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {prescriptions.length > 0 && <Separator />}

        {/* Premium Pharmacy Section */}
        <div className="space-y-4">
          <PharmacyLine
            selectedPharmacy={selectedPharmacy}
            onChangePharmacy={() => setShowPharmacySelector(!showPharmacySelector)}
            onSendToManager={handleSendToManager}
          />
          
          {showPharmacySelector && (
            <PharmacyInlineSelector
              selectedPharmacy={selectedPharmacy}
              onSelect={handlePharmacySelect}
              onCancel={() => setShowPharmacySelector(false)}
              medicationName={prescriptions[0]?.medication}
            />
          )}

          <div className="flex items-center justify-end">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveDraft}
                className="text-fg-muted hover:text-fg"
              >
                <Archive className="h-4 w-4 mr-2" />
                Save as draft
              </Button>

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