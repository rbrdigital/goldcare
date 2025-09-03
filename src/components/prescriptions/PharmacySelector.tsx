import React, { useState } from 'react';
import { Search, MapPin, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
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
    address: '123 Main St, City, ST 12345',
    phone: '(555) 123-4567'
  },
  {
    id: '2',
    name: 'CVS Pharmacy',
    distance: '1.8 mi',
    address: '456 Oak Ave, City, ST 12345',
    phone: '(555) 234-5678'
  },
  {
    id: '3',
    name: 'Rite Aid',
    distance: '2.3 mi',
    address: '789 Pine St, City, ST 12345',
    phone: '(555) 345-6789'
  },
  {
    id: '4',
    name: 'Target Pharmacy',
    distance: '3.1 mi',
    address: '321 Elm Dr, City, ST 12345',
    phone: '(555) 456-7890'
  },
  {
    id: '5',
    name: 'Costco Pharmacy',
    distance: '4.7 mi',
    address: '654 Cedar Blvd, City, ST 12345',
    phone: '(555) 567-8901'
  },
  {
    id: '6',
    name: 'Independent Pharmacy',
    distance: '5.2 mi',
    address: '987 Birch Way, City, ST 12345',
    phone: '(555) 678-9012'
  },
  {
    id: '7',
    name: 'Kroger Pharmacy',
    distance: '7.8 mi',
    address: '147 Maple Ave, City, ST 12345',
    phone: '(555) 789-0123'
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
    const selected = MOCK_PHARMACIES.find(p => p.id === tempSelected);
    if (selected) {
      onPharmacyChange(selected);
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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm">
          Send to <strong>{selectedPharmacy.name}</strong> (nearest to patient, {selectedPharmacy.distance})
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="text-primary hover:text-primary-fg"
        >
          Change
        </Button>
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent className="space-y-4 border border-border rounded-md p-4 bg-surface">
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fg-muted" />
              <Input
                placeholder="Search pharmacies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            <RadioGroup value={tempSelected} onValueChange={setTempSelected}>
              <div className="space-y-2">
                {filteredPharmacies.map((pharmacy) => (
                  <div
                    key={pharmacy.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors",
                      tempSelected === pharmacy.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-surface-muted"
                    )}
                    onClick={() => setTempSelected(pharmacy.id)}
                  >
                    <RadioGroupItem value={pharmacy.id} className="mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{pharmacy.name}</h4>
                        <div className="flex items-center gap-1 text-sm text-fg-muted">
                          <MapPin className="h-3 w-3" />
                          {pharmacy.distance}
                        </div>
                      </div>
                      <p className="text-sm text-fg-muted mt-1">{pharmacy.address}</p>
                      <p className="text-sm text-fg-muted">{pharmacy.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {filteredPharmacies.length === 0 && (
            <div className="text-center py-4 text-fg-muted">
              No pharmacies found matching "{searchQuery}"
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleConfirm}>
              <Check className="h-4 w-4 mr-2" />
              Confirm
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}