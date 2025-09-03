import React, { useState } from 'react';
import { Trash2, Copy, ChevronDown, ChevronUp, Calendar, MapPin, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { ParsedPrescription, Alert } from '@/types/prescription';
import { getGuidance } from './prescriptionParser';
import { InlineAlert } from './InlineAlert';
import { cn } from '@/lib/utils';
import { formatDateForDisplay, formatDuration } from '@/lib/dateUtils';

interface PrescriptionCardProps {
  prescription: ParsedPrescription;
  alerts: Alert[];
  onUpdate: (updates: Partial<ParsedPrescription>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  isReadOnly?: boolean;
}

export function PrescriptionCard({ 
  prescription, 
  alerts, 
  onUpdate, 
  onRemove, 
  onDuplicate,
  isReadOnly = false 
}: PrescriptionCardProps) {
  const [editingChip, setEditingChip] = useState<string | null>(null);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());

  const guidance = getGuidance(prescription.medication);

  const formatSummary = () => {
    if (prescription.isTaper) {
      return `${prescription.medication} taper - see instructions below`;
    }

    const medStr = `${prescription.medication}${prescription.strength ? ` ${prescription.strength}` : ''} ${prescription.formulation || 'tablet'}`;
    const takeStr = `Take by ${prescription.route.toLowerCase()} ${prescription.frequency?.toLowerCase() || ''}${prescription.duration ? ` for ${formatDuration(prescription.duration)}` : ''}`;
    
    return { medStr, takeStr };
  };

  const handleChipEdit = (chipType: string, value: string) => {
    if (isReadOnly) return;
    
    if (chipType === 'quantity') {
      onUpdate({ quantity: parseInt(value) || 0 });
    } else if (chipType === 'refills') {
      onUpdate({ refills: parseInt(value) || 0 });
    } else if (chipType === 'notes') {
      onUpdate({ notes: value });
    }
    setEditingChip(null);
  };

  const acceptSuggestion = (type: 'patient', text: string) => {
    const key = `${type}-${prescription.id}`;
    onUpdate({ notes: prescription.notes ? `${prescription.notes}. ${text}` : text });
    setDismissedSuggestions(prev => new Set([...prev, key]));
  };

  const dismissSuggestion = (type: 'patient') => {
    const key = `${type}-${prescription.id}`;
    setDismissedSuggestions(prev => new Set([...prev, key]));
  };

  const summary = formatSummary();
  const isTaper = typeof summary === 'string';

  return (
    <Card className={cn("relative", isReadOnly && "opacity-75")}>
      <CardContent className="p-4 space-y-4">
        {/* Summary */}
        <div className="space-y-2">
          {isTaper ? (
            <div className="text-base font-medium">{summary}</div>
          ) : (
            <>
              <div className="text-base font-medium">{summary.medStr}</div>
              <div className="text-sm text-fg-muted">{summary.takeStr}</div>
            </>
          )}

          {/* Alerts */}
          {alerts.map((alert, index) => (
            <InlineAlert key={index} type={alert.type} message={alert.message} />
          ))}
        </div>

        {/* Chips Row */}
        <div className="flex flex-wrap gap-2">
          <ChipEditor
            label="Qty"
            value={prescription.quantity?.toString() || '0'}
            isEditing={editingChip === 'quantity'}
            onEdit={() => setEditingChip('quantity')}
            onSave={(value) => handleChipEdit('quantity', value)}
            onCancel={() => setEditingChip(null)}
            isReadOnly={isReadOnly}
          />
          <ChipEditor
            label="Refills"
            value={prescription.refills?.toString() || '0'}
            isEditing={editingChip === 'refills'}
            onEdit={() => setEditingChip('refills')}
            onSave={(value) => handleChipEdit('refills', value)}
            onCancel={() => setEditingChip(null)}
            isReadOnly={isReadOnly}
          />
          <Badge variant={prescription.substitutions ? "secondary" : "outline"}>
            Substitutions {prescription.substitutions ? 'Allowed' : 'Denied'}
          </Badge>
          <ChipEditor
            label="Duration (days)"
            value={prescription.duration || '0'}
            isEditing={editingChip === 'duration'}
            onEdit={() => setEditingChip('duration')}
            onSave={(value) => onUpdate({ duration: value || undefined })}
            onCancel={() => setEditingChip(null)}
            isReadOnly={isReadOnly}
          />
          <ChipEditor
            label="Notes"
            value={prescription.notes || 'None'}
            isEditing={editingChip === 'notes'}
            onEdit={() => setEditingChip('notes')}
            onSave={(value) => handleChipEdit('notes', value)}
            onCancel={() => setEditingChip(null)}
            isReadOnly={isReadOnly}
          />
        </div>

        {/* Guidance Suggestions */}
        {!isReadOnly && (
          <div className="space-y-2">
            {guidance.patient && !dismissedSuggestions.has(`patient-${prescription.id}`) && (
              <div className="flex items-center justify-between p-2 bg-surface rounded-md text-sm">
                <span className="text-fg-muted">Patient note: {guidance.patient}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => acceptSuggestion('patient', guidance.patient!)}
                    className="h-6 px-2 text-xs"
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => dismissSuggestion('patient')}
                    className="h-6 px-2 text-xs"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Advanced Options */}
        {!isReadOnly && (
          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-between">
                Advanced Options
                {isAdvancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Refills</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdate({ refills: Math.max(0, (prescription.refills || 0) - 1) })}
                      disabled={(prescription.refills || 0) <= 0}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{prescription.refills || 0}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdate({ refills: (prescription.refills || 0) + 1 })}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Substitutions</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Switch
                      checked={prescription.substitutions}
                      onCheckedChange={(checked) => onUpdate({ substitutions: checked })}
                    />
                    <span className="text-sm">{prescription.substitutions ? 'Allowed' : 'Denied'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">PRN (As Needed)</label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={prescription.prn || false}
                    onCheckedChange={(checked) => onUpdate({ prn: checked })}
                  />
                  <span className="text-sm">{prescription.prn ? 'Yes' : 'No'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (days only)</label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={prescription.duration || ''}
                  onChange={(e) => onUpdate({ duration: e.target.value || undefined })}
                  placeholder="0"
                  className="text-sm"
                />
                <div className="text-xs text-fg-muted">
                  Display: {prescription.duration ? formatDuration(prescription.duration) : '0 days'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Date</label>
                  <div className="text-sm bg-surface border border-border rounded-md px-3 py-2 mb-1">
                    {formatDateForDisplay(prescription.startDate || '')}
                  </div>
                  <Input
                    type="date"
                    value={prescription.startDate || ''}
                    onChange={(e) => onUpdate({ startDate: e.target.value })}
                    className="text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Earliest Fill Date</label>
                  <div className="text-sm bg-surface border border-border rounded-md px-3 py-2 mb-1">
                    {formatDateForDisplay(prescription.earliestFillDate || '')}
                  </div>
                  <Input
                    type="date"
                    value={prescription.earliestFillDate || ''}
                    onChange={(e) => onUpdate({ earliestFillDate: e.target.value })}
                    className="text-sm"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* PDF Preview */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPdfPreview(!showPdfPreview)}
            className="text-primary hover:text-primary-fg"
          >
            Preview PDF
          </Button>
          
          {showPdfPreview && (
            <div className="border border-border rounded-md p-4 bg-surface/50">
              <div className="text-center mb-4">
                <h3 className="font-semibold">GoldCare Medical Center</h3>
                <p className="text-sm text-fg-muted">Prescription</p>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Patient:</strong> Jane Doe</p>
                <p><strong>DOB:</strong> 01/15/1965</p>
                <Separator className="my-2" />
                {isTaper ? (
                  <p>{summary}</p>
                ) : (
                  <>
                    <p><strong>Medication:</strong> {summary.medStr}</p>
                    <p><strong>Instructions:</strong> {summary.takeStr}</p>
                  </>
                )}
                <p><strong>Quantity:</strong> {prescription.quantity}</p>
                <p><strong>Refills:</strong> {prescription.refills}</p>
                {prescription.notes && <p><strong>Notes:</strong> {prescription.notes}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Card Actions */}
        {!isReadOnly && (
          <div className="flex justify-end gap-2 pt-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={onDuplicate}
              className="h-8"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onRemove}
              className="h-8 text-destructive hover:text-destructive-fg"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Chip Editor Component
interface ChipEditorProps {
  label: string;
  value: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (value: string) => void;
  onCancel: () => void;
  isReadOnly?: boolean;
}

function ChipEditor({ label, value, isEditing, onEdit, onSave, onCancel, isReadOnly }: ChipEditorProps) {
  const [editValue, setEditValue] = useState(value);

  React.useEffect(() => {
    if (isEditing) setEditValue(value);
  }, [isEditing, value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSave(editValue);
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  if (isEditing && !isReadOnly) {
    return (
      <div className="flex items-center gap-1">
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => onSave(editValue)}
          className="h-6 w-20 text-xs"
          autoFocus
        />
      </div>
    );
  }

  return (
    <Badge
      variant="secondary"
      className={cn("cursor-pointer", !isReadOnly && "hover:bg-primary/10")}
      onClick={!isReadOnly ? onEdit : undefined}
    >
      {label}: {value}
    </Badge>
  );
}