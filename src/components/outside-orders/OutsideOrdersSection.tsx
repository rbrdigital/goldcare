import React, { useState } from 'react';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload } from 'lucide-react';

export default function OutsideOrdersSection() {
  const [orders, setOrders] = useState([{ id: 1, type: '', details: '', notes: '' }]);

  const handleOrderChange = (id: number, field: string, value: string) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, [field]: value } : order
    ));
  };

  const addOrder = () => {
    const newId = Math.max(...orders.map(o => o.id)) + 1;
    setOrders(prev => [...prev, { id: newId, type: '', details: '', notes: '' }]);
  };

  const removeOrder = (id: number) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  return (
    <div className="h-full bg-bg flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <Upload className="h-5 w-5" />
          <h1 className="text-lg font-semibold">Outside Orders</h1>
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
                <Label htmlFor={`type-${order.id}`}>Referral Type</Label>
                <AutosizeTextarea
                  id={`type-${order.id}`}
                  placeholder="Specify referral type (e.g., Cardiology, Physical Therapy, External Consultant)..."
                  value={order.type}
                  onChange={(e) => handleOrderChange(order.id, 'type', e.target.value)}
                  minRows={1}
                />
              </div>

              <div>
                <Label htmlFor={`details-${order.id}`}>Referral Details</Label>
                <AutosizeTextarea
                  id={`details-${order.id}`}
                  placeholder="Describe the reason for referral and specific needs..."
                  value={order.details}
                  onChange={(e) => handleOrderChange(order.id, 'details', e.target.value)}
                  minRows={3}
                />
              </div>

              <div>
                <Label htmlFor={`notes-${order.id}`}>Additional Notes</Label>
                <AutosizeTextarea
                  id={`notes-${order.id}`}
                  placeholder="Any additional context or special instructions..."
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