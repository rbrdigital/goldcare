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
import { FlaskConical, MoreHorizontal, Copy, FileText, Edit, Bot } from 'lucide-react';
import { type LabOrder } from '@/store/useConsultStore';

interface LabOrderHeaderProps {
  order: LabOrder;
  orderNumber: number;
  onEditDetails: () => void;
  onReopenAI: () => void;
}

export function LabOrderHeader({ order, orderNumber, onEditDetails, onReopenAI }: LabOrderHeaderProps) {
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
    <Card className="p-4" data-testid="lab-order-header">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <FlaskConical className="h-6 w-6 text-primary" />
          </div>
        </div>

        {/* Summary */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-fg leading-tight mb-1 text-lg">
            {firstDiagnosis || `Lab Order #${orderNumber}`}
          </div>
          <div className="text-sm text-fg-muted">
            {testsSummary}
          </div>
        </div>

        {/* Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {diagnosesCount > 0 && (
            <Badge variant="outline" className="font-semibold">
              {diagnosesCount} {diagnosesCount === 1 ? 'Diagnosis' : 'Diagnoses'}
            </Badge>
          )}
          {totalTests > 0 && (
            <Badge variant="outline" className="font-semibold">
              {totalTests} {totalTests === 1 ? 'Test' : 'Tests'}
            </Badge>
          )}
        </div>

        {/* Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onEditDetails}>
              <Edit className="h-4 w-4 mr-2" />
              Edit details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="h-4 w-4 mr-2" />
              Preview PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onReopenAI}>
              <Bot className="h-4 w-4 mr-2" />
              Reopen AI
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
