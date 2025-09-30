import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FlaskConical } from 'lucide-react';
import { type LabOrder } from '@/store/useConsultStore';

interface LabOrderSummaryCardProps {
  order: LabOrder;
  orderNumber: number;
}

export function LabOrderSummaryCard({ order, orderNumber }: LabOrderSummaryCardProps) {
  // Extract first diagnosis for heading
  const firstDiagnosis = order.diagnoses[0] || null;
  const diagnosesCount = order.diagnoses.length;
  
  // Count total tests across all requests
  const totalTests = order.requests.reduce((count, req) => count + req.exams.length, 0);
  
  // Generate summary of tests
  const testsSummary = order.requests.length > 0
    ? order.requests.map(req => `${req.category} (${req.exams.length} tests)`).join(', ')
    : 'No tests selected';

  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <FlaskConical className="h-5 w-5 text-primary" />
          </div>
        </div>

        {/* Summary */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-fg leading-tight mb-1 text-base">
            {firstDiagnosis || `Lab Order #${orderNumber}`}
          </div>
          <div className="text-sm text-fg-muted">
            {testsSummary}
          </div>
          {order.diagnoses.length > 1 && (
            <div className="text-xs text-fg-muted mt-1">
              + {order.diagnoses.length - 1} more {order.diagnoses.length === 2 ? 'diagnosis' : 'diagnoses'}
            </div>
          )}
        </div>

        {/* Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {diagnosesCount > 0 && (
            <Badge variant="outline" className="font-medium text-xs">
              {diagnosesCount} {diagnosesCount === 1 ? 'Dx' : 'Dxs'}
            </Badge>
          )}
          {totalTests > 0 && (
            <Badge variant="outline" className="font-medium text-xs">
              {totalTests} {totalTests === 1 ? 'Test' : 'Tests'}
            </Badge>
          )}
        </div>
      </div>

      {/* Detailed test list */}
      {order.requests.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="space-y-2">
            {order.requests.map((request, idx) => (
              <div key={request.id} className="text-xs">
                <span className="font-medium text-fg">{request.category}:</span>
                <span className="text-fg-muted ml-1">{request.exams.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
