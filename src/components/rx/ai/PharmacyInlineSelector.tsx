import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Search, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  distance?: string;
  isOpen?: boolean;
  is24hr?: boolean;
  isPreferred?: boolean;
}

interface PharmacyInlineSelectorProps {
  onPharmacySelect: (pharmacy: Pharmacy) => void;
  onCancel: () => void;
  selectedPharmacy: Pharmacy;
}

const MOCK_PHARMACIES: Pharmacy[] = [
  {
    id: 'cvs-1023',
    name: 'CVS Pharmacy #1023',
    address: '123 Main St',
    city: 'Naples',
    state: 'FL',
    zip: '34102',
    phone: '(239) 555-0123',
    distance: '0.8 mi',
    isOpen: true,
    is24hr: false,
    isPreferred: true
  },
  {
    id: 'walgreens-5541',
    name: 'Walgreens #5541',
    address: '200 Pine Ave',
    city: 'Naples',
    state: 'FL',
    zip: '34103',
    phone: '(239) 555-0456',
    distance: '1.2 mi',
    isOpen: false,
    is24hr: true
  },
  {
    id: 'publix-901',
    name: 'Publix Pharmacy',
    address: '901 Lake Dr',
    city: 'Naples',
    state: 'FL',
    zip: '34104',
    phone: '(239) 555-0789',
    distance: '2.1 mi',
    isOpen: true,
    is24hr: false
  },
  {
    id: 'partell-specialty',
    name: 'Partell Specialty Pharmacy',
    address: '1001 Freedom Blvd',
    city: 'Naples',
    state: 'FL',
    zip: '34102',
    phone: '(239) 555-0001',
    distance: '0.5 mi',
    isOpen: true,
    is24hr: false
  }
];

const RECENTLY_USED = ['cvs-1023', 'walgreens-5541'];

export function PharmacyInlineSelector({ 
  onPharmacySelect, 
  onCancel, 
  selectedPharmacy 
}: PharmacyInlineSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(selectedPharmacy.id);

  const filteredPharmacies = MOCK_PHARMACIES.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentlyUsed = filteredPharmacies.filter(p => RECENTLY_USED.includes(p.id));
  const nearby = filteredPharmacies.filter(p => !RECENTLY_USED.includes(p.id));

  const handleConfirm = () => {
    const selected = MOCK_PHARMACIES.find(p => p.id === selectedId);
    if (selected) {
      onPharmacySelect(selected);
      toast({
        title: "Pharmacy updated",
        description: `Prescription will be sent to ${selected.name}`,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  // Specialty recommendation
  const hasSpecialtyRecommendation = searchQuery.toLowerCase().includes('specialty') || 
    selectedPharmacy.name.toLowerCase().includes('specialty');

  return (
    <Card className="p-4 space-y-4" onKeyDown={handleKeyDown}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fg-muted" />
        <Input
          placeholder="Search pharmacies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          autoFocus
        />
      </div>

      {/* Specialty Recommendation */}
      {hasSpecialtyRecommendation && (
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-md">
          <div className="text-sm font-medium text-primary mb-1">
            Recommended: Partell Specialty (ships overnight)
          </div>
          <Button size="sm" variant="outline" className="h-7">
            Use this
          </Button>
        </div>
      )}

      <RadioGroup value={selectedId} onValueChange={setSelectedId}>
        {/* Recently Used */}
        {recentlyUsed.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-fg-muted">Recently used</div>
            {recentlyUsed.slice(0, 3).map((pharmacy) => (
              <PharmacyOption key={pharmacy.id} pharmacy={pharmacy} />
            ))}
          </div>
        )}

        {/* Nearby */}
        {nearby.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-fg-muted">Nearby</div>
            {nearby.slice(0, 7).map((pharmacy) => (
              <PharmacyOption key={pharmacy.id} pharmacy={pharmacy} />
            ))}
          </div>
        )}
      </RadioGroup>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2">
        <Button onClick={handleConfirm} disabled={!selectedId} size="sm">
          Set pharmacy
        </Button>
        <Button variant="outline" onClick={onCancel} size="sm">
          Cancel
        </Button>
      </div>
    </Card>
  );
}

function PharmacyOption({ pharmacy }: { pharmacy: Pharmacy }) {
  return (
    <div className="flex items-center space-x-3 p-2 rounded hover:bg-surface-muted">
      <RadioGroupItem value={pharmacy.id} id={pharmacy.id} />
      <Label
        htmlFor={pharmacy.id}
        className="flex-1 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{pharmacy.name}</span>
              {pharmacy.isPreferred && (
                <Badge variant="secondary" className="text-xs">
                  Preferred
                </Badge>
              )}
            </div>
            <div className="text-sm text-fg-muted flex items-center gap-4">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {pharmacy.city}, {pharmacy.state} • {pharmacy.distance}
              </span>
              <span className={cn(
                "flex items-center gap-1",
                pharmacy.isOpen ? "text-success" : "text-fg-muted"
              )}>
                <Clock className="h-3 w-3" />
                {pharmacy.isOpen ? "Open now" : "Closed"}
                {pharmacy.is24hr && " • 24hr"}
              </span>
            </div>
          </div>
        </div>
      </Label>
    </div>
  );
}