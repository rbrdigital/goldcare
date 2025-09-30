import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pill } from 'lucide-react';
import { type Prescription } from '@/store/useConsultStore';

interface PrescriptionSummaryCardProps {
  prescription: Prescription;
}

export function PrescriptionSummaryCard({ prescription }: PrescriptionSummaryCardProps) {
  // Calculate total quantity locally
  const calcTotalQty = (rx: Prescription): number => {
    const qtyPerDose = Number(rx.qtyPerDose) || 0;
    const duration = Number(rx.duration) || 0;
    const frequency = rx.frequency;
    
    let perDay = 1;
    if (frequency.includes("q12h")) perDay = 2;
    else if (frequency.includes("q8h")) perDay = 3;
    else if (frequency.includes("q6h")) perDay = 4;
    else if (frequency.includes("qod")) perDay = 0.5;
    
    return Math.ceil(qtyPerDose * perDay * duration);
  };
  
  const totalQty = calcTotalQty(prescription);

  const formatDurationText = (duration: number | "") => {
    if (!duration || duration === 0) return "";
    const num = Number(duration);
    return num === 1 ? " for 1 day" : ` for ${num} days`;
  };

  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Pill className="h-5 w-5 text-primary" />
          </div>
        </div>

        {/* Summary */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-fg leading-tight mb-1 text-base">
            {prescription.medicine || 'Medication not specified'} {prescription.qtyPerDose} {prescription.formulation}
          </div>
          <div className="text-sm text-fg-muted">
            {prescription.action} {prescription.qtyPerDose} {prescription.route?.toLowerCase()} {prescription.frequency?.toLowerCase()}
            {prescription.duration && formatDurationText(prescription.duration)}
          </div>
        </div>

        {/* Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {totalQty > 0 && (
            <Badge variant="outline" className="font-medium text-xs">
              Qty: {totalQty}
            </Badge>
          )}
          {prescription.refills !== "" && (
            <Badge variant="outline" className="font-medium text-xs">
              Refills: {prescription.refills}
            </Badge>
          )}
          <Badge variant={prescription.subsAllowed ? "outline" : "secondary"} className="font-medium text-xs">
            {prescription.subsAllowed ? 'Subs OK' : 'No subs'}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
