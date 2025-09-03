import React from 'react';
import { Pill, Copy, FileText, Wand2, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ParsedPrescription, Alert } from '@/types/prescription';
import { InlineAlert } from '@/components/prescriptions/InlineAlert';
import { formatDuration } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';

interface PrescriptionHeaderProps {
  prescription: ParsedPrescription;
  alerts: Alert[];
  showEditWithAI?: boolean;
  onEditWithAI?: () => void;
  onCopy?: () => void;
  onPreviewPDF?: () => void;
  className?: string;
}

export function PrescriptionHeader({
  prescription,
  alerts,
  showEditWithAI = false,
  onEditWithAI,
  onCopy,
  onPreviewPDF,
  className
}: PrescriptionHeaderProps) {
  const formatSummaryLines = () => {
    if (prescription.isTaper) {
      return {
        medication: `${prescription.medication} taper`,
        instructions: 'See instructions below'
      };
    }

    const medication = `${prescription.medication}${prescription.strength ? ` ${prescription.strength}` : ''} ${prescription.formulation || 'tablet'}`;
    
    let instructions = `Take ${prescription.dose || prescription.strength || ''} ${prescription.route?.toLowerCase() || 'by mouth'}`;
    if (prescription.frequency) {
      instructions += ` ${prescription.frequency.toLowerCase()}`;
    }
    if (prescription.duration) {
      instructions += ` for ${formatDuration(prescription.duration)}`;
    }

    return { medication, instructions };
  };

  const { medication, instructions } = formatSummaryLines();

  const handleCopy = () => {
    const text = `${medication} - ${instructions}`;
    navigator.clipboard.writeText(text);
    onCopy?.();
  };

  return (
    <Card className={cn("bg-gradient-to-r from-surface to-surface/50 border-border/50", className)}>
      <CardContent className="p-6" role="region" aria-label="Prescription summary">
        <div className="flex items-start gap-4">
          {/* Left: Icon */}
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Pill className="h-5 w-5 text-primary" />
          </div>

          {/* Center: Summary */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="text-base font-semibold text-fg leading-tight">
              {medication}
            </div>
            <div className="text-sm text-fg-muted leading-tight">
              {instructions}
            </div>
          </div>

          {/* Right: Chips */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <Badge variant="secondary" className="text-xs">
                Qty: <span className="font-semibold ml-1">{prescription.quantity || 0}</span>
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Refills: <span className="font-semibold ml-1">{prescription.refills || 0}</span>
              </Badge>
              <Badge variant={prescription.substitutions ? "secondary" : "outline"} className="text-xs">
                Subs: <span className="font-semibold ml-1">{prescription.substitutions ? 'OK' : 'No'}</span>
              </Badge>

              {/* Utility Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={handleCopy}>
                    <Copy className="h-3 w-3 mr-2" />
                    Copy
                  </DropdownMenuItem>
                  {onPreviewPDF && (
                    <DropdownMenuItem onClick={onPreviewPDF}>
                      <FileText className="h-3 w-3 mr-2" />
                      Preview PDF
                    </DropdownMenuItem>
                  )}
                  {showEditWithAI && onEditWithAI && (
                    <DropdownMenuItem onClick={onEditWithAI}>
                      <Wand2 className="h-3 w-3 mr-2" />
                      Edit with AI
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Alerts Row */}
        {alerts.length > 0 && (
          <div className="mt-3 space-y-2">
            {alerts.map((alert, index) => (
              <InlineAlert 
                key={index} 
                type={alert.type} 
                message={alert.message}
                className="text-xs"
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}