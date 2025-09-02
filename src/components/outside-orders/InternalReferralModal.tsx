"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Provider {
  id: string;
  name: string;
  degree: string;
  availability: string;
  tokens: string;
}

interface InternalReferral {
  id: string;
  type: "specialty" | "provider";
  specialty?: string;
  providers?: Provider[];
}

interface InternalReferralModalProps {
  onClose: () => void;
  onComplete: (referral: InternalReferral) => void;
  initialReferral?: InternalReferral | null;
}

type Step = "choose-type" | "specialty-list" | "provider-selection";

const SERVICES = [
  "Primary & Acute Care",
  "Psychiatric Medicine", 
  "Pediatric Medicine",
  "Weight Management Consultants (Prescribers)",
  "Weight Management Consultants (Advisors)",
  "Specialist Advisor",
  "Complementary Cancer Care Advisors",
  "VIP Specialist",
  "Long COVID & Vax Injury Care",
  "Medical Advisor",
  "Naturopathic and Chiropractic Advisors",
  "Children's Health Advisor",
  "Mental Health Advisor",
  "Sports & Injury Advisors",
  "Biological Dentist (& Naturopathic Doctor)",
  "Vaccine Exemption Package",
  "Advanced Planning for People and Animals",
  "Animal Natural Wellness",
  "Nutrition & Lifestyle",
  "Registered Nurse Wellness Coaching",
  "Spiritual & Pastoral Care",
  "GoldCare Covid/Flu Essentials Pack",
  "GoldCare Covid/Flu Premium Pack",
  "GoldCare Prescription Pack"
];

const MOCK_PROVIDERS: Record<string, Provider[]> = {
  "Primary & Acute Care": [
    {
      id: "primary-1",
      name: "Jennifer Frangos",
      degree: "MD",
      availability: "Available today",
      tokens: "5 tokens = 15 minutes"
    },
    {
      id: "primary-2", 
      name: "Michael Chen",
      degree: "MD",
      availability: "Available tomorrow",
      tokens: "5 tokens = 15 minutes"
    },
    {
      id: "primary-3",
      name: "Sarah Williams",
      degree: "MD",
      availability: "Available Tuesday",
      tokens: "5 tokens = 15 minutes"
    }
  ],
  "Psychiatric Medicine": [
    {
      id: "psych-1",
      name: "Lisa Rodriguez",
      degree: "MD",
      availability: "Available today",
      tokens: "4 tokens = 12 minutes"
    },
    {
      id: "psych-2",
      name: "David Kim",
      degree: "MD", 
      availability: "Available tomorrow",
      tokens: "4 tokens = 12 minutes"
    }
  ],
  "Pediatric Medicine": [
    {
      id: "pedi-1",
      name: "Maria Gonzalez",
      degree: "MD",
      availability: "Available today",
      tokens: "6 tokens = 18 minutes"
    }
  ],
  "Weight Management Consultants (Prescribers)": [
    {
      id: "weight-1",
      name: "Robert Johnson",
      degree: "MD",
      availability: "Available tomorrow", 
      tokens: "5 tokens = 15 minutes"
    }
  ],
  "Specialist Advisor": [
    {
      id: "spec-1",
      name: "Amanda Lee",
      degree: "MD",
      availability: "Available today",
      tokens: "5 tokens = 15 minutes"
    }
  ]
};

export function InternalReferralModal({ onClose, onComplete, initialReferral }: InternalReferralModalProps) {
  const [step, setStep] = React.useState<Step>("choose-type");
  const [selectedType, setSelectedType] = React.useState<"specialty" | "provider" | null>(
    initialReferral?.type || null
  );
  const [selectedSpecialty, setSelectedSpecialty] = React.useState<string | null>(
    initialReferral?.specialty || null
  );
  const [selectedService, setSelectedService] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedProviders, setSelectedProviders] = React.useState<Set<string>>(
    new Set(initialReferral?.providers?.map(p => p.id) || [])
  );

  // Initialize state based on existing referral
  React.useEffect(() => {
    if (initialReferral) {
      if (initialReferral.type === "specialty") {
        setStep("specialty-list");
      } else if (initialReferral.type === "provider") {
        setStep("provider-selection");
        // Find the service based on providers
        const firstProvider = initialReferral.providers?.[0];
        if (firstProvider) {
          for (const [service, providers] of Object.entries(MOCK_PROVIDERS)) {
            if (providers.some(p => p.id === firstProvider.id)) {
              setSelectedService(service);
              break;
            }
          }
        }
      }
    }
  }, [initialReferral]);

  const handleTypeSelect = (type: "specialty" | "provider") => {
    setSelectedType(type);
    if (type === "specialty") {
      setStep("specialty-list");
    } else {
      setStep("provider-selection");
    }
  };

  const handleSpecialtySelect = (service: string) => {
    const referral: InternalReferral = {
      id: crypto.randomUUID(),
      type: "specialty",
      specialty: service
    };
    onComplete(referral);
  };

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
  };

  const handleProviderToggle = (providerId: string) => {
    const newSelected = new Set(selectedProviders);
    if (newSelected.has(providerId)) {
      newSelected.delete(providerId);
    } else if (newSelected.size < 5) {
      newSelected.add(providerId);
    }
    setSelectedProviders(newSelected);
  };

  const handleApply = () => {
    if (!selectedService || selectedProviders.size === 0) return;

    const providers = MOCK_PROVIDERS[selectedService]?.filter(p => 
      selectedProviders.has(p.id)
    ) || [];

    const referral: InternalReferral = {
      id: crypto.randomUUID(),
      type: "provider",
      providers
    };
    onComplete(referral);
  };

  const getAvailableProviders = () => {
    if (!selectedService) return [];
    
    const providers = MOCK_PROVIDERS[selectedService] || [];
    
    if (!searchQuery.trim()) return providers;
    
    return providers.filter(provider =>
      provider.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredProviders = getAvailableProviders();
  const canSelectMore = selectedProviders.size < 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-xl border border-border bg-bg p-6 max-h-[90vh] overflow-y-auto">
        
        {step === "choose-type" && (
          <>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Internal Referral</h3>
              <p className="text-sm text-fg-muted mt-1">
                Select whether you want to recommend a specialty covered by GoldCare, or specific providers.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleTypeSelect("specialty")}
                className="w-full flex items-center gap-3 p-4 rounded-lg border border-border bg-surface hover:bg-surface-muted transition-colors text-left"
              >
                <div className="w-4 h-4 rounded-full border-2 border-border bg-bg flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-fg">Refer specialty</div>
                </div>
              </button>

              <button
                onClick={() => handleTypeSelect("provider")}
                className="w-full flex items-center gap-3 p-4 rounded-lg border border-border bg-surface hover:bg-surface-muted transition-colors text-left"
              >
                <div className="w-4 h-4 rounded-full border-2 border-border bg-bg flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-fg">Refer a provider</div>
                </div>
              </button>
            </div>

            <div className="flex items-center justify-end">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </>
        )}

        {step === "specialty-list" && (
          <>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Internal Referral</h3>
              <p className="text-sm text-fg-muted mt-1">Choose a service</p>
            </div>

            <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
              {SERVICES.map((service) => (
                <button
                  key={service}
                  onClick={() => handleSpecialtySelect(service)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-border bg-surface hover:bg-surface-muted transition-colors text-left"
                >
                  <div className="font-medium text-fg">{service}</div>
                  <div className="w-2 h-2 rounded-full bg-fg-muted flex-shrink-0" />
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => setStep("choose-type")}>Back</Button>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </>
        )}

        {step === "provider-selection" && (
          <>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Internal Referral</h3>
              <p className="text-sm text-fg-muted mt-1">Select a service</p>
            </div>

            {!selectedService && (
              <>
                <div className="flex flex-wrap gap-2 mb-6">
                  {SERVICES.map((service) => (
                    <button
                      key={service}
                      onClick={() => handleServiceSelect(service)}
                      className="rounded-full border border-border bg-surface px-3 py-1 text-sm hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {service}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <Button variant="ghost" onClick={() => setStep("choose-type")}>Back</Button>
                  <Button variant="outline" onClick={onClose}>Cancel</Button>
                </div>
              </>
            )}

            {selectedService && (
              <>
                <div className="mb-4">
                  <Input
                    placeholder="Search by provider's name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {filteredProviders.map((provider) => {
                    const isSelected = selectedProviders.has(provider.id);
                    const isDisabled = !isSelected && !canSelectMore;
                    
                    return (
                      <div
                        key={provider.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border border-border transition-colors",
                          isDisabled 
                            ? "bg-surface-muted opacity-50 cursor-not-allowed"
                            : "bg-surface hover:bg-surface-muted cursor-pointer"
                        )}
                        onClick={() => !isDisabled && handleProviderToggle(provider.id)}
                      >
                        <img 
                          src={`https://images.unsplash.com/photo-${1500000000000 + (provider.id.charCodeAt(0) * 1000)}?w=64&h=64&fit=crop&crop=face&auto=format`}
                          alt={provider.name}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = '';
                            e.currentTarget.className = 'w-8 h-8 rounded-full bg-surface-muted flex-shrink-0';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{provider.name}, {provider.degree}</div>
                          <div className="text-sm text-fg-muted mt-1">
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-surface-muted">
                              {provider.availability}
                            </span>
                          </div>
                          <div className="text-xs text-fg-muted mt-1 flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-fg-muted" />
                            <span>{provider.tokens}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <Checkbox 
                            checked={isSelected}
                            disabled={isDisabled}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedProviders.size >= 5 && (
                  <div className="text-sm text-fg-muted mb-4">
                    Maximum of 5 providers selected.
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Button variant="ghost" onClick={() => setSelectedService(null)}>Back</Button>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button 
                      onClick={handleApply}
                      disabled={selectedProviders.size === 0}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}