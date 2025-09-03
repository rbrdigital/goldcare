import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface Pharmacy {
  id: string;
  name: string;
  distance?: string;
  address?: string;
  phone?: string;
  city?: string;
  isPreferred?: boolean;
  isSpecialty?: boolean;
}

interface PharmacyInlineSelectorProps {
  selectedPharmacy: Pharmacy | null;
  onSelect: (pharmacy: Pharmacy) => void;
  onCancel: () => void;
  medicationName?: string;
  className?: string;
}

const MOCK_PHARMACIES: Pharmacy[] = [
  { 
    id: '1', 
    name: 'Walgreens', 
    distance: '1.2 mi', 
    address: '123 Main St', 
    city: 'Springfield',
    phone: '(555) 123-4567', 
    isPreferred: true 
  },
  { 
    id: '2', 
    name: 'CVS Pharmacy', 
    distance: '1.5 mi', 
    address: '456 Oak Ave', 
    city: 'Springfield',
    phone: '(555) 234-5678' 
  },
  { 
    id: '3', 
    name: 'Rite Aid', 
    distance: '2.1 mi', 
    address: '789 Pine Rd', 
    city: 'Springfield',
    phone: '(555) 345-6789' 
  },
  { 
    id: '4', 
    name: 'Walmart Pharmacy', 
    distance: '2.8 mi', 
    address: '321 Elm St', 
    city: 'Springfield',
    phone: '(555) 456-7890' 
  },
  { 
    id: '5', 
    name: 'Target Pharmacy', 
    distance: '3.2 mi', 
    address: '654 Maple Dr', 
    city: 'Springfield',
    phone: '(555) 567-8901' 
  },
  { 
    id: 'specialty-1', 
    name: 'Partell Specialty', 
    distance: 'Ships overnight', 
    address: 'National Network', 
    city: 'Specialty',
    phone: '(800) 123-4567',
    isSpecialty: true 
  }
];

const RECENTLY_USED = ['1', '2']; // Mock recent usage

export function PharmacyInlineSelector({
  selectedPharmacy,
  onSelect,
  onCancel,
  medicationName,
  className
}: PharmacyInlineSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(selectedPharmacy?.id || '');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredPharmacies = MOCK_PHARMACIES.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pharmacy.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentlyUsed = filteredPharmacies.filter(p => RECENTLY_USED.includes(p.id));
  const nearby = filteredPharmacies.filter(p => !RECENTLY_USED.includes(p.id) && !p.isSpecialty);
  const specialty = filteredPharmacies.find(p => p.isSpecialty);

  // Show specialty recommendation for certain medications
  const showSpecialtyRecommendation = medicationName && 
    ['humira', 'enbrel', 'remicade', 'specialty'].some(med => 
      medicationName.toLowerCase().includes(med)
    ) && specialty;

  const allPharmacies = [...recentlyUsed, ...nearby];

  useEffect(() => {
    // Focus search input when component mounts
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
      return;
    }

    if (e.key === '/' && e.target !== searchInputRef.current) {
      e.preventDefault();
      searchInputRef.current?.focus();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => Math.min(prev + 1, allPharmacies.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && allPharmacies[focusedIndex]) {
      e.preventDefault();
      setSelectedId(allPharmacies[focusedIndex].id);
    }
  };

  const handleSelect = () => {
    const selected = filteredPharmacies.find(p => p.id === selectedId);
    if (selected) {
      onSelect(selected);
    }
  };

  const handleSpecialtySelect = () => {
    if (specialty) {
      onSelect(specialty);
    }
  };

  return (
    <Card 
      className={cn("mt-2 shadow-lg border-primary/20", className)}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <CardHeader className="pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fg-muted" />
          <Input
            ref={searchInputRef}
            placeholder="Search pharmacies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Specialty Recommendation */}
        {showSpecialtyRecommendation && specialty && (
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-primary">
                  Recommended: {specialty.name}
                </div>
                <div className="text-xs text-fg-muted">
                  {specialty.distance} • Specialized for this medication
                </div>
              </div>
              <Button size="sm" onClick={handleSpecialtySelect}>
                Use this
              </Button>
            </div>
          </div>
        )}

        {/* Pharmacy Lists */}
        <RadioGroup value={selectedId} onValueChange={setSelectedId}>
          {recentlyUsed.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-fg-muted">Recently used</h4>
              {recentlyUsed.map((pharmacy, index) => (
                <PharmacyItem
                  key={pharmacy.id}
                  pharmacy={pharmacy}
                  isFocused={focusedIndex === index}
                  onFocus={() => setFocusedIndex(index)}
                />
              ))}
            </div>
          )}

          {recentlyUsed.length > 0 && nearby.length > 0 && <Separator />}

          {nearby.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-fg-muted">Nearby</h4>
              {nearby.map((pharmacy, index) => (
                <PharmacyItem
                  key={pharmacy.id}
                  pharmacy={pharmacy}
                  isFocused={focusedIndex === (recentlyUsed.length + index)}
                  onFocus={() => setFocusedIndex(recentlyUsed.length + index)}
                />
              ))}
            </div>
          )}
        </RadioGroup>

        {filteredPharmacies.length === 0 && (
          <div className="text-center py-4 text-fg-muted text-sm">
            No pharmacies found matching "{searchQuery}"
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSelect}
            disabled={!selectedId}
          >
            Set pharmacy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PharmacyItem({ 
  pharmacy, 
  isFocused, 
  onFocus 
}: { 
  pharmacy: Pharmacy; 
  isFocused: boolean; 
  onFocus: () => void;
}) {
  return (
    <div 
      className={cn(
        "flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-surface/50",
        isFocused && "bg-surface/80 ring-1 ring-primary/20"
      )}
      onClick={onFocus}
    >
      <RadioGroupItem value={pharmacy.id} id={pharmacy.id} />
      <div className="flex-1 min-w-0">
        <Label 
          htmlFor={pharmacy.id} 
          className="flex items-center justify-between cursor-pointer w-full"
        >
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-fg">{pharmacy.name}</div>
            <div className="text-xs text-fg-muted flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {pharmacy.city && `${pharmacy.city} • `}{pharmacy.distance}
            </div>
          </div>
          {pharmacy.isPreferred && (
            <Badge variant="secondary" className="text-xs ml-2">
              Preferred
            </Badge>
          )}
        </Label>
      </div>
    </div>
  );
}