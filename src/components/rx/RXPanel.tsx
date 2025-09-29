import React, { useState } from 'react';
import { AIPromptBox } from './ai/AIPromptBox';
import { PrescriptionHeader } from './summary/PrescriptionHeader';
import { PharmacyLine } from './pharmacy/PharmacyLine';
import RXForm from '@/components/RXForm';
import { useConsultStore } from '@/store/useConsultStore';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { Separator } from '@/components/ui/separator';
import { Pill } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
    
    // Change to drafted state and expand form
    setPanelState('drafted');
    setIsFormExpanded(true);
    
    // Scroll to header and focus first field
    setTimeout(() => {
      const headerElement = document.querySelector('[data-testid="prescription-header"]');
      if (headerElement) {
        headerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      
      const firstInput = document.querySelector('[data-testid="rx-form"] input');
      if (firstInput) {
        (firstInput as HTMLInputElement).focus();
      }
    }, 100);
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

  const handleSave = () => {
    toast({
      title: "Prescriptions Saved",
      description: "Your prescription orders have been saved.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Heading - Always at top */}
      <PageHeader
        title="Prescriptions"
        description="Create and manage prescription orders for your patients"
        icon={Pill}
        onSave={handleSave}
      >
        <Button
          variant="outline"
          onClick={() => {
            window.dispatchEvent(new CustomEvent('openMedicationWorkspace'));
          }}
          className="ml-4"
        >
          <Pill className="h-4 w-4 mr-2" />
          Medication Workspace
        </Button>
      </PageHeader>
      
      {/* AI Prompt Box - Only visible in ai-ready state */}
      {panelState === 'ai-ready' && (
        <AIPromptBox 
          onDraft={handleAIDraft}
          onManualEntry={handleManualEntry}
        />
      )}
      
      {/* Reset to AI link - Visible when form is shown */}
      {(panelState === 'drafted' || panelState === 'manual') && (
        <div className="flex justify-end">
          <button
            onClick={handleReopenAI}
            className="text-sm text-fg-muted hover:text-fg transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-fg after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"
          >
            ← Restart with AI
          </button>
        </div>
      )}
      
      {/* Prescription Header - Visible when drafted or manual with valid data */}
      {(panelState === 'drafted' || (panelState === 'manual' && hasValidPrescription)) && currentPrescription && (
        <PrescriptionHeader 
          prescription={currentPrescription}
          onEditDetails={handleEditDetails}
          onReopenAI={handleReopenAI}
        />
      )}
      
      {/* Pharmacy Line - Always visible when not in ai-ready state */}
      {panelState !== 'ai-ready' && <PharmacyLine />}
      
      {/* RX Form - Collapsible, no section header */}
      {(panelState === 'manual' || panelState === 'drafted') && (
        <Collapsible open={isFormExpanded} onOpenChange={setIsFormExpanded}>
          <CollapsibleContent>
            <div className="pt-4">
              <RXForm />
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}