import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConsultStore } from '@/store/useConsultStore';

export function AIConversation() {
  const [isTyping, setIsTyping] = useState(true);
  const [showProposal, setShowProposal] = useState(false);
  const { updatePrescription, prescriptions } = useConsultStore();

  useEffect(() => {
    // Simulate AI response delay
    const timer = setTimeout(() => {
      setIsTyping(false);
      setShowProposal(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleInsertIntoForm = () => {
    if (prescriptions.length > 0) {
      updatePrescription(prescriptions[0].id, {
        medicine: 'Amoxicillin 875mg',
        qtyPerDose: 1,
        formulation: 'Tablet',
        route: 'Oral',
        frequency: 'Every 12 hours',
        duration: 10,
        totalQtyUnit: 'Tablet',
        refills: 0,
        action: 'Take',
        prn: false,
        subsAllowed: true,
        startDate: new Date().toISOString().split('T')[0],
        earliestFill: new Date().toISOString().split('T')[0],
        notesPatient: 'Take with food to reduce stomach upset. Complete the full course.',
        notesPharmacy: 'Patient counseled on full course completion.'
      });
    }
  };

  return (
    <Card className="p-4 space-y-4">
      {/* User Bubble */}
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="h-6 w-6 rounded-full bg-surface-muted flex items-center justify-center">
            <User className="h-3 w-3 text-fg-muted" />
          </div>
        </div>
        <div className="flex-1 bg-surface-muted rounded-lg p-3 text-sm">
          Amoxicillin 875 twice daily for 10 days no refills
        </div>
      </div>

      {/* AI Bubble */}
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-3 w-3 text-primary" />
          </div>
        </div>
        <div className="flex-1">
          {isTyping ? (
            <div className="bg-surface rounded-lg p-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-fg-muted rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-fg-muted rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-fg-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-fg-muted">Analyzing prescription...</span>
              </div>
            </div>
          ) : showProposal ? (
            <div className="bg-surface rounded-lg p-4 space-y-3">
              <div className="text-sm">
                <div className="font-medium mb-2">Proposed prescription:</div>
                <div className="text-fg-muted">
                  <strong>Amoxicillin 875mg tablet</strong><br />
                  Take 1 tablet orally every 12 hours for 10 days<br />
                  Total Qty: 20 tablets • Refills: 0 • No substitutions
                </div>
              </div>

              {/* Inline Alerts */}
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-2 bg-warning/10 text-warning rounded border border-warning/20">
                  <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span className="text-xs">Check penicillin allergy - consider alternatives</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button 
                  size="sm" 
                  onClick={handleInsertIntoForm}
                  className="h-8"
                >
                  Insert into form
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  Revise
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  Regenerate
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}