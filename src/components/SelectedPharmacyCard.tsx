"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

type SelectedPharmacy = {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  distance?: string;
  isOpen?: boolean;
  is24hr?: boolean;
};

interface SelectedPharmacyCardProps {
  pharmacy: SelectedPharmacy;
  onChangePharmacy: () => void;
  onRemovePharmacy: () => void;
}

export default function SelectedPharmacyCard({
  pharmacy,
  onChangePharmacy,
  onRemovePharmacy,
}: SelectedPharmacyCardProps) {
  const [announceText, setAnnounceText] = React.useState<string>("");

  React.useEffect(() => {
    setAnnounceText(`Pharmacy selected: ${pharmacy.name}`);
    const timer = setTimeout(() => setAnnounceText(""), 3000);
    return () => clearTimeout(timer);
  }, [pharmacy.name]);

  const handleRemove = () => {
    setAnnounceText("Pharmacy cleared");
    setTimeout(() => setAnnounceText(""), 3000);
    onRemovePharmacy();
  };

  return (
    <>
      {/* Accessibility announcement */}
      <div
        aria-live="polite" 
        className="sr-only"
        aria-atomic="true"
      >
        {announceText}
      </div>

      <Card className="rounded-xl bg-surface">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Selected pharmacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Primary details */}
          <div className="space-y-2">
            <div className="text-sm font-medium truncate" title={pharmacy.name}>
              {pharmacy.name}
            </div>
            <div className="text-sm text-fg-muted">
              {pharmacy.address}, {pharmacy.city}, {pharmacy.state} {pharmacy.zip}
            </div>
          </div>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2">
            {pharmacy.distance && (
              <Badge variant="outline" className="text-xs">
                {pharmacy.distance}
              </Badge>
            )}
            {pharmacy.isOpen !== undefined && (
              <Badge 
                variant={pharmacy.isOpen ? "default" : "secondary"} 
                className="text-xs"
              >
                {pharmacy.isOpen ? "Open now" : "Closed"}
              </Badge>
            )}
            {pharmacy.is24hr && (
              <Badge variant="outline" className="text-xs">
                24 hr
              </Badge>
            )}
          </div>

          {/* Phone number */}
          {pharmacy.phone && (
            <div className="text-xs text-fg-muted">
              {pharmacy.phone}
            </div>
          )}

          {/* Separator for small screens */}
          <Separator className="md:hidden" />

          {/* Actions */}
          <div className="flex items-center justify-between gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onChangePharmacy}
            >
              Change
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              aria-label="Remove pharmacy"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}