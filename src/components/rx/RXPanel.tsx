import React, { useState } from 'react';
import { AIPromptBox } from './ai/AIPromptBox';
import { PrescriptionHeader } from './summary/PrescriptionHeader';
import { PharmacyLine } from './pharmacy/PharmacyLine';
import RXForm from '@/components/RXForm';
import { useConsultStore } from '@/store/useConsultStore';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';

type PanelState = 'ai-ready' | 'drafted' | 'manual';

export function RXPanel() {
  const { prescriptions, updatePrescription } = useConsultStore();
  const [panelState, setPanelState] = useState<PanelState>('ai-ready');
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  
  // Track the current prescription for the header
  const currentPrescription = prescriptions[0] || null;
  const hasValidPrescription = currentPrescription && 
    (currentPrescription.medicine || currentPrescription.qtyPerDose || currentPrescription.formulation);

  const handleAIDraft = (prompt: string) => {
    // Parse prompt and fill form
    if (prescriptions.length > 0) {
      const parsed = parsePrompt(prompt);
      updatePrescription(prescriptions[0].id, parsed);
    }
    
    // Change to drafted state
    setPanelState('drafted');
    setIsFormExpanded(false);
  };

  const handleManualEntry = () => {
    setPanelState('manual');
    setIsFormExpanded(true);
  };

  const handleReopenAI = () => {
    setPanelState('ai-ready');
    setIsFormExpanded(false);
  };

  const handleEditDetails = () => {
    setIsFormExpanded(true);
  };

  // Simple prompt parser (mock implementation)
  const parsePrompt = (prompt: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Basic pattern matching for common medications
    if (prompt.toLowerCase().includes('amoxicillin')) {
      return {
        medicine: 'Amoxicillin 875mg',
        qtyPerDose: 1,
        formulation: 'Tablet',
        route: 'Oral',
        frequency: 'Every 12 hours',
        duration: 10,
        totalQtyUnit: 'Tablet' as const,
        refills: 0,
        action: 'Take',
        prn: false,
        subsAllowed: true,
        startDate: today,
        earliestFill: today,
        notesPatient: 'Take with food to reduce stomach upset. Complete the full course.',
        notesPharmacy: 'Patient counseled on full course completion.'
      };
    }
    
    // Default fallback
    return {
      medicine: 'Medication',
      qtyPerDose: 1,
      formulation: 'Tablet',
      route: 'Oral',
      frequency: 'Once daily',
      duration: 7,
      totalQtyUnit: 'Tablet' as const,
      refills: 0,
      action: 'Take',
      prn: false,
      subsAllowed: true,
      startDate: today,
      earliestFill: today,
      notesPatient: '',
      notesPharmacy: ''
    };
  };

  return (
    <div className="space-y-6">
      {/* AI Prompt Box - Only visible in ai-ready state */}
      {panelState === 'ai-ready' && (
        <AIPromptBox 
          onDraft={handleAIDraft}
          onManualEntry={handleManualEntry}
        />
      )}
      
      {/* Prescription Header - Visible when drafted or manual with valid data */}
      {(panelState === 'drafted' || (panelState === 'manual' && hasValidPrescription)) && currentPrescription && (
        <PrescriptionHeader 
          prescription={currentPrescription}
          onEditDetails={handleEditDetails}
          onReopenAI={handleReopenAI}
        />
      )}
      
      {/* RX Form - Collapsible */}
      {(panelState === 'manual' || panelState === 'drafted') && (
        <Collapsible open={isFormExpanded} onOpenChange={setIsFormExpanded}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between p-2 h-auto font-medium"
            >
              <span>Prescription Details</span>
              {isFormExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="pt-4">
              <RXForm />
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
      
      {/* Pharmacy Line - Always visible when not in ai-ready state */}
      {panelState !== 'ai-ready' && <PharmacyLine />}
    </div>
  );
}