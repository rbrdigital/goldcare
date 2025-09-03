import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface Pharmacy {
  id: string;
  name: string;
  distance: string;
  address: string;
  phone: string;
}

const MOCK_PHARMACIES: Pharmacy[] = [
  {
    id: '1',
    name: 'Walgreens',
    distance: '1.2 mi',
    address: '123 Main St, Springfield, IL 62701',
    phone: '(555) 123-4567'
  },
  {
    id: '2', 
    name: 'CVS Pharmacy',
    distance: '1.8 mi',
    address: '456 Oak Ave, Springfield, IL 62702',
    phone: '(555) 234-5678'
  },
  {
    id: '3',
    name: 'Rite Aid',
    distance: '2.1 mi',
    address: '789 Pine Dr, Springfield, IL 62703',
    phone: '(555) 345-6789'
  },
  {
    id: '4',
    name: 'Springfield Pharmacy',
    distance: '2.4 mi',
    address: '321 Elm St, Springfield, IL 62704',
    phone: '(555) 456-7890'
  }
];

interface PharmacySelectorProps {
  selectedPharmacy: Pharmacy;
  onPharmacyChange: (pharmacy: Pharmacy) => void;
}

export function PharmacySelector({ selectedPharmacy, onPharmacyChange }: PharmacySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelected, setTempSelected] = useState(selectedPharmacy.id);

  const filteredPharmacies = MOCK_PHARMACIES.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = () => {
    const pharmacy = MOCK_PHARMACIES.find(p => p.id === tempSelected);
    if (pharmacy) {
      onPharmacyChange(pharmacy);
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleCancel = () => {
    setTempSelected(selectedPharmacy.id);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-fg">
        Send to{' '}
        <span className="font-medium">{selectedPharmacy.name}</span>
        {' '}(nearest to patient, {selectedPharmacy.distance})
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="link" 
              className="h-auto p-0 ml-1 text-primary underline"
            >
              Change
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="border border-border rounded-md bg-surface p-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Search Pharmacies</Label>
                <Input
                  placeholder="Search by name or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-sm"
                />
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                <RadioGroup 
                  value={tempSelected} 
                  onValueChange={setTempSelected}
                  className="space-y-2"
                >
                  {filteredPharmacies.map((pharmacy) => (
                    <div key={pharmacy.id} className="flex items-start space-x-2 p-2 rounded-md hover:bg-surface-muted">
                      <RadioGroupItem 
                        value={pharmacy.id} 
                        id={pharmacy.id}
                        className="mt-1"
                      />
                      <Label 
                        htmlFor={pharmacy.id} 
                        className="flex-1 cursor-pointer space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{pharmacy.name}</span>
                          <span className="text-xs text-fg-muted">{pharmacy.distance}</span>
                        </div>
                        <div className="text-xs text-fg-muted">
                          {pharmacy.address}
                        </div>
                        <div className="text-xs text-fg-muted">
                          {pharmacy.phone}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleConfirm}
                  disabled={!tempSelected}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}