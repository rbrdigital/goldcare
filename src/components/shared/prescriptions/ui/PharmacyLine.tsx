import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PharmacyLineProps {
  selectedPharmacy: {
    id: string;
    name: string;
    distance?: string;
    address?: string;
    phone?: string;
  } | null;
  onChangePharmacy: () => void;
  onSendToManager: () => void;
  className?: string;
}

export function PharmacyLine({ 
  selectedPharmacy, 
  onChangePharmacy, 
  onSendToManager,
  className 
}: PharmacyLineProps) {
  return (
    <div className={cn("flex items-center gap-1 text-sm text-fg flex-wrap", className)}>
      <span>Send to</span>
      
      {selectedPharmacy ? (
        <>
          <span className="font-semibold text-fg">{selectedPharmacy.name}</span>
          {selectedPharmacy.distance && (
            <>
              <span className="text-fg-muted">(nearest to patient,</span>
              <span className="text-fg-muted">{selectedPharmacy.distance})</span>
            </>
          )}
        </>
      ) : (
        <span className="text-fg-muted">Select a pharmacy</span>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={onChangePharmacy}
        className="h-auto p-0 text-primary hover:text-primary underline text-sm font-normal"
      >
        [Change]
      </Button>

      <span className="text-fg-muted">·</span>

      <Button
        variant="ghost"
        size="sm"
        onClick={onSendToManager}
        className="h-auto p-0 text-fg-muted hover:text-fg underline text-sm font-normal"
      >
        Send to manager
      </Button>
    </div>
  );
}