import React, { useState } from 'react';
import { Copy, Trash2, ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ParsedPrescription, Alert } from '@/types/prescription';
import { getGuidance } from './prescriptionParser';
import { ChipEditor } from './ChipEditor';
import { InlineAlert } from './InlineAlert';
import { formatDateForDisplay, formatDuration } from '@/lib/dateUtils';

interface PrescriptionCardProps {
  prescription: ParsedPrescription;
  alerts: Alert[];
  onUpdate: (updates: Partial<ParsedPrescription>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  isReadOnly?: boolean;
  isFocused?: boolean;
  onFocus?: () => void;
}

export function PrescriptionCard({
  prescription,
  alerts,
  onUpdate,
  onRemove,
  onDuplicate,
  isReadOnly = false,
  isFocused = false,
  onFocus
}: PrescriptionCardProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dismissedGuidance, setDismissedGuidance] = useState<Set<string>>(new Set());

  const guidance = getGuidance(prescription.medication);
  const visibleGuidance = guidance.patient && !dismissedGuidance.has(prescription.id);

  const handleGuidanceAccept = () => {
    onUpdate({ 
      notes: prescription.notes 
        ? `${prescription.notes}; ${guidance.patient}` 
        : guidance.patient 
    });
    setDismissedGuidance(prev => new Set(prev).add(prescription.id));
  };

  const handleGuidanceDismiss = () => {
    setDismissedGuidance(prev => new Set(prev).add(prescription.id));
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-200",
        isFocused && "ring-2 ring-primary/50",
        isReadOnly && "opacity-75"
      )}
      onClick={onFocus}
    >
      <CardContent className="p-4 space-y-4">
        {/* Summary */}
        <div className="space-y-1">
          <div className="text-base font-medium text-fg">
            {prescription.medication} {prescription.strength} {prescription.formulation}
          </div>
          <div className="text-sm text-fg-muted">
            Take {prescription.dose || prescription.strength} {prescription.route} {prescription.frequency}
            {prescription.duration && ` for ${formatDuration(prescription.duration)}`}
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <InlineAlert
                key={index}
                type={alert.type}
                message={alert.message}
              />
            ))}
          </div>
        )}

        {/* Editable Chips */}
        <div className="flex flex-wrap gap-2">
          <ChipEditor
            label="Qty"
            value={prescription.quantity?.toString() || ''}
            onSave={(value) => onUpdate({ quantity: parseInt(value) || undefined })}
            isReadOnly={isReadOnly}
            placeholder="30"
          />
          <ChipEditor
            label="Refills"
            value={prescription.refills?.toString() || '0'}
            onSave={(value) => onUpdate({ refills: parseInt(value) || 0 })}
            isReadOnly={isReadOnly}
            placeholder="0"
          />
          <ChipEditor
            label="Substitutions"
            value={prescription.substitutions ? 'Allowed' : 'Not allowed'}
            onSave={(value) => onUpdate({ substitutions: value === 'Allowed' })}
            isReadOnly={isReadOnly}
            type="toggle"
          />
          <ChipEditor
            label="Duration (days)"
            value={prescription.duration || ''}
            onSave={(value) => onUpdate({ duration: value || undefined })}
            isReadOnly={isReadOnly}
            placeholder="0"
          />
          <ChipEditor
            label="Notes"
            value={prescription.notes || ''}
            onSave={(value) => onUpdate({ notes: value || undefined })}
            isReadOnly={isReadOnly}
            placeholder="Patient instructions"
          />
        </div>

        {/* Guidance */}
        {visibleGuidance && (
          <div className="bg-info/10 border border-info/20 rounded-md p-3 text-sm">
            <div className="flex items-start justify-between gap-2">
              <span className="text-info flex-1">{guidance.patient}</span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-info hover:text-info"
                  onClick={handleGuidanceAccept}
                >
                  Accept
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-info hover:text-info"
                  onClick={handleGuidanceDismiss}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Options */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between text-fg-muted hover:text-fg"
            >
              Advanced Options
              {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-2">
            {/* Refills Stepper */}
            <div className="flex items-center gap-2">
              <Label className="text-sm min-w-16">Refills:</Label>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => onUpdate({ refills: Math.max(0, (prescription.refills || 0) - 1) })}
                  disabled={isReadOnly || (prescription.refills || 0) <= 0}
                >
                  -
                </Button>
                <span className="w-8 text-center text-sm">{prescription.refills || 0}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => onUpdate({ refills: (prescription.refills || 0) + 1 })}
                  disabled={isReadOnly}
                >
                  +
                </Button>
              </div>
            </div>

            {/* PRN Checkbox */}
            <div className="flex items-center gap-2">
              <Switch
                id={`prn-${prescription.id}`}
                checked={prescription.prn || false}
                onCheckedChange={(checked) => onUpdate({ prn: checked })}
                disabled={isReadOnly}
              />
              <Label htmlFor={`prn-${prescription.id}`} className="text-sm">
                PRN (as needed)
              </Label>
            </div>

            {/* Duration Input */}
            <div className="space-y-1">
              <Label className="text-xs text-fg-muted">Duration (days)</Label>
              <Input
                type="number"
                min="0"
                step="1"
                value={prescription.duration || ''}
                onChange={(e) => onUpdate({ duration: e.target.value || undefined })}
                disabled={isReadOnly}
                className="text-sm"
                placeholder="0"
              />
            </div>

            {/* Date Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-fg-muted">Start Date</Label>
                <div className="text-sm bg-surface border border-border rounded-md px-3 py-2">
                  {formatDateForDisplay(prescription.startDate || '')}
                </div>
                <Input
                  type="date"
                  value={prescription.startDate || ''}
                  onChange={(e) => onUpdate({ startDate: e.target.value })}
                  disabled={isReadOnly}
                  className="text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-fg-muted">Earliest Fill Date</Label>
                <div className="text-sm bg-surface border border-border rounded-md px-3 py-2">
                  {formatDateForDisplay(prescription.earliestFillDate || '')}
                </div>
                <Input
                  type="date"  
                  value={prescription.earliestFillDate || ''}
                  onChange={(e) => onUpdate({ earliestFillDate: e.target.value })}
                  disabled={isReadOnly}
                  className="text-xs"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Actions */}
        {!isReadOnly && (
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDuplicate}
              className="text-fg-muted hover:text-fg"
            >
              <Copy className="h-4 w-4 mr-1" />
              Duplicate
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-fg-muted hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}