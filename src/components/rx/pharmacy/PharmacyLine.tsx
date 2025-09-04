import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PharmacyInlineSelector } from './PharmacyInlineSelector';
import { useConsultStore } from '@/store/useConsultStore';

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  distance?: string;
  isOpen?: boolean;
  is24hr?: boolean;
  isPreferred?: boolean;
}

const DEFAULT_PHARMACY: Pharmacy = {
  id: 'cvs-1023',
  name: 'CVS Pharmacy #1023',
  address: '123 Main St',
  city: 'Naples',
  state: 'FL',
  zip: '34102',
  phone: '(239) 555-0123',
  distance: '0.8 mi',
  isOpen: true,
  is24hr: false,
  isPreferred: true
};

export function PharmacyLine() {
  const [showSelector, setShowSelector] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy>(DEFAULT_PHARMACY);
  const { prescriptions, updatePrescription } = useConsultStore();

  const handlePharmacyChange = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setShowSelector(false);
    
    // Update the first prescription with the new pharmacy
    if (prescriptions.length > 0) {
      updatePrescription(prescriptions[0].id, {
        selectedPharmacy: {
          name: pharmacy.name,
          address: pharmacy.address,
          city: pharmacy.city,
          state: pharmacy.state,
          zip: pharmacy.zip,
          phone: pharmacy.phone,
          distance: pharmacy.distance,
          isOpen: pharmacy.isOpen,
          is24hr: pharmacy.is24hr
        }
      });
    }
  };

  const handleSendToManager = () => {
    // In real implementation, would handle sending to manager
    console.log('Sending to manager');
  };

  return (
    <div className="space-y-4">
      {/* Always-visible single line */}
      <div className="flex items-center gap-3 text-sm">
        <span className="text-fg-muted">Send to</span>
        <span className="font-semibold text-fg">
          {selectedPharmacy.name}
        </span>
        <span className="text-fg-muted">
          (nearest to patient, {selectedPharmacy.distance})
        </span>
        <Button 
          variant="link" 
          size="sm" 
          className="h-auto p-0 text-primary hover:text-primary/80 font-medium"
          onClick={() => setShowSelector(!showSelector)}
        >
          Change
        </Button>
        <span className="text-fg-muted">·</span>
        <Button 
          variant="link" 
          size="sm" 
          className="h-auto p-0 font-medium"
          onClick={handleSendToManager}
        >
          Send to manager
        </Button>
      </div>

      {/* Inline Selector */}
      {showSelector && (
        <PharmacyInlineSelector
          onPharmacySelect={handlePharmacyChange}
          onCancel={() => setShowSelector(false)}
          selectedPharmacy={selectedPharmacy}
        />
      )}
    </div>
  );
}