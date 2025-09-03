import React from 'react';
import { AIPromptBox } from './ai/AIPromptBox';
import { AIConversation } from './ai/AIConversation';
import { PrescriptionHeader } from './ai/PrescriptionHeader';
import { PharmacyLine } from './ai/PharmacyLine';
import RXForm from '@/components/RXForm';
import { useConsultStore } from '@/store/useConsultStore';

export function RXPanel() {
  const { prescriptions } = useConsultStore();
  const [showConversation, setShowConversation] = React.useState(false);
  
  // Track the current prescription for the header
  const currentPrescription = prescriptions[0] || null;

  return (
    <div className="space-y-6">
      {/* AI Prompt Box */}
      <AIPromptBox onSubmit={() => setShowConversation(true)} />
      
      {/* AI Conversation (hidden until first submit) */}
      {showConversation && <AIConversation />}
      
      {/* Prescription Header */}
      {currentPrescription && <PrescriptionHeader prescription={currentPrescription} />}
      
      {/* Existing RX Form (unchanged) */}
      <RXForm />
      
      {/* Pharmacy Line */}
      <PharmacyLine />
    </div>
  );
}
