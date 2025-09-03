import React, { useState } from 'react';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Simple imaging icon
const ImagingIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor"/>
  </svg>
);

export default function ImagingOrdersSection() {
  const [orders, setOrders] = useState([{ id: 1, diagnosis: '', details: '', notes: '' }]);

  const handleOrderChange = (id: number, field: string, value: string) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, [field]: value } : order
    ));
  };

  const addOrder = () => {
    const newId = Math.max(...orders.map(o => o.id)) + 1;
    setOrders(prev => [...prev, { id: newId, diagnosis: '', details: '', notes: '' }]);
  };

  const removeOrder = (id: number) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  return (
    <div className="h-full bg-bg flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <ImagingIcon className="h-5 w-5" />
          <h1 className="text-lg font-semibold">Imaging Orders</h1>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {orders.map((order, index) => (
          <Card key={order.id} className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">Order #{index + 1}</h3>
              {orders.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeOrder(order.id)}
                  className="text-fg-muted hover:text-fg"
                >
                  Remove
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor={`diagnosis-${order.id}`}>Clinical Diagnosis</Label>
                <AutosizeTextarea
                  id={`diagnosis-${order.id}`}
                  placeholder="Enter clinical diagnosis..."
                  value={order.diagnosis}
                  onChange={(e) => handleOrderChange(order.id, 'diagnosis', e.target.value)}
                  minRows={2}
                />
              </div>

              <div>
                <Label htmlFor={`details-${order.id}`}>Imaging Details</Label>
                <AutosizeTextarea
                  id={`details-${order.id}`}
                  placeholder="Specify imaging type, body part, contrast needs..."
                  value={order.details}
                  onChange={(e) => handleOrderChange(order.id, 'details', e.target.value)}
                  minRows={3}
                />
              </div>

              <div>
                <Label htmlFor={`notes-${order.id}`}>Clinical Notes</Label>
                <AutosizeTextarea
                  id={`notes-${order.id}`}
                  placeholder="Additional clinical context or special instructions..."
                  value={order.notes}
                  onChange={(e) => handleOrderChange(order.id, 'notes', e.target.value)}
                  minRows={2}
                />
              </div>
            </div>
          </Card>
        ))}

        <Button variant="outline" onClick={addOrder}>
          + Add Another Order
        </Button>
      </div>
    </div>
  );
}