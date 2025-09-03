import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Pill, MoreHorizontal, Copy, FileText, Edit } from 'lucide-react';
import { formatDateForDisplay, formatDuration } from '@/lib/dateUtils';
import { InlineAlert } from '@/components/prescriptions/InlineAlert';
import { useConsultStore, type Prescription } from '@/store/useConsultStore';

interface PrescriptionHeaderProps {
  prescription: Prescription;
}

export function PrescriptionHeader({ prescription }: PrescriptionHeaderProps) {
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
  
  // Mock alerts for demo
  const alerts = [
    { type: 'allergy' as const, message: 'Patient has documented penicillin allergy - consider alternative' }
  ];

  const handleEditWithAI = () => {
    // Scroll to AI prompt box and prefill with current values
    const promptBox = document.querySelector('[data-testid="ai-prompt-box"]');
    if (promptBox) {
      promptBox.scrollIntoView({ behavior: 'smooth' });
      // In real implementation, would serialize current form values
    }
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
          <div className="font-semibold text-fg leading-tight mb-1">
            {prescription.medicine || 'Medication not specified'} {prescription.qtyPerDose} {prescription.formulation}
          </div>
          <div className="text-sm text-fg-muted">
            {prescription.action} {prescription.qtyPerDose} {prescription.route?.toLowerCase()} {prescription.frequency?.toLowerCase()}
            {prescription.duration && ` for ${formatDuration(prescription.duration.toString())}`}
          </div>
        </div>

        {/* Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {totalQty > 0 && (
            <Badge variant="outline">
              <span className="font-semibold">Qty: {totalQty}</span>
            </Badge>
          )}
          {prescription.refills !== "" && (
            <Badge variant="outline">
              <span className="font-semibold">Refills: {prescription.refills}</span>
            </Badge>
          )}
          <Badge variant={prescription.subsAllowed ? "outline" : "secondary"}>
            <span className="font-semibold">
              {prescription.subsAllowed ? 'Substitutions OK' : 'No substitutions'}
            </span>
          </Badge>
        </div>

        {/* Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="h-4 w-4 mr-2" />
              Preview PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEditWithAI}>
              <Edit className="h-4 w-4 mr-2" />
              Edit with AI
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Inline Alerts */}
      {alerts.length > 0 && (
        <div className="mt-4 space-y-2">
          {alerts.map((alert, index) => (
            <InlineAlert
              key={index}
              type={alert.type}
              message={alert.message}
            />
          ))}
        </div>
      )}
    </Card>
  );
}