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
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-md flex items-center justify-center flex-shrink-0">
            <Upload className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Outside Orders</h1>
            <p className="text-sm text-gray-600 mt-0.5">Create referrals and external consultations</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {orders.map((order, index) => (
          <div key={order.id} className="border border-gray-200 rounded-xl">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Order #{index + 1}</h3>
                {orders.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeOrder(order.id)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
            
            <div className="p-6 space-y-6">
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
          </div>
        ))}

        <Button variant="outline" onClick={addOrder}>
          + Add Another Order
        </Button>
      </div>
    </div>
  );
}