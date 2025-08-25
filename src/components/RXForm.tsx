import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Edit3, RefreshCw, Search, Pill, Save } from "lucide-react";

interface RXOrder {
  id: string;
  medicineName: string;
  formulation: string;
  dose: string;
  doseUnit: string;
  route: string;
  quantity: string;
  frequency: string;
  duration: string;
  durationUnit: string;
  refills: string;
  prn: boolean;
  prnIndication: string;
  specialInstructions: string;
  selectedPharmacy: string;
}

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance?: string;
}

const defaultPharmacies: Pharmacy[] = [
  { id: "partell", name: "Partell Specialty", address: "123 Medical Center Dr", phone: "(555) 123-4567", distance: "0.5 mi" },
  { id: "walgreens", name: "Walgreens", address: "789 Main Street", phone: "(555) 987-6543", distance: "1.2 mi" },
  { id: "freedom", name: "Freedom Pharmacy", address: "456 Oak Avenue", phone: "(555) 555-0199", distance: "0.8 mi" },
  { id: "nearby", name: "Nearby Pharmacy", address: "321 Pine Street", phone: "(555) 111-2222", distance: "1.0 mi" }
];

const allPharmacies: Pharmacy[] = [
  ...defaultPharmacies,
  { id: "cvs", name: "CVS Pharmacy", address: "101 Second St", phone: "(555) 234-5678", distance: "1.5 mi" },
  { id: "rite-aid", name: "Rite Aid", address: "555 Third Ave", phone: "(555) 345-6789", distance: "2.1 mi" },
  { id: "kroger", name: "Kroger Pharmacy", address: "888 Fourth Blvd", phone: "(555) 456-7890", distance: "1.8 mi" },
  { id: "walmart", name: "Walmart Pharmacy", address: "999 Fifth St", phone: "(555) 567-8901", distance: "2.3 mi" }
];

const formulationOptions = [
  "Tablet", "Capsule", "Liquid", "Injection", "Cream", "Ointment", "Patch", "Inhaler", "Suppository", "Powder"
];

const routeOptions = [
  "Oral", "Topical", "IV", "IM", "SC", "Rectal", "Inhalation", "Nasal", "Ophthalmic", "Otic"
];

const frequencyOptions = [
  "Once daily", "Twice daily", "Three times daily", "Four times daily", "Every 6 hours", "Every 8 hours", "Every 12 hours", "As needed", "Weekly", "Monthly"
];

const durationUnits = ["Days", "Weeks", "Months"];
const doseUnits = ["mg", "g", "mL", "units", "mcg", "IU"];

export function RXForm() {
  const [orders, setOrders] = useState<RXOrder[]>([{
    id: "1",
    medicineName: "",
    formulation: "",
    dose: "",
    doseUnit: "mg",
    route: "",
    quantity: "",
    frequency: "",
    duration: "",
    durationUnit: "Days",
    refills: "0",
    prn: false,
    prnIndication: "",
    specialInstructions: "",
    selectedPharmacy: "partell"
  }]);

  const [pharmacyModalOpen, setPharmacyModalOpen] = useState(false);
  const [pharmacySearch, setPharmacySearch] = useState("");
  const [selectedOrderForPharmacy, setSelectedOrderForPharmacy] = useState<string>("");

  const addOrder = () => {
    const newOrder: RXOrder = {
      id: Date.now().toString(),
      medicineName: "",
      formulation: "",
      dose: "",
      doseUnit: "mg",
      route: "",
      quantity: "",
      frequency: "",
      duration: "",
      durationUnit: "Days",
      refills: "0",
      prn: false,
      prnIndication: "",
      specialInstructions: "",
      selectedPharmacy: "partell"
    };
    setOrders([...orders, newOrder]);
  };

  const removeOrder = (orderId: string) => {
    if (orders.length > 1) {
      setOrders(orders.filter(order => order.id !== orderId));
    }
  };

  const updateOrder = (orderId: string, updates: Partial<RXOrder>) => {
    setOrders(orders.map(order => 
      order.id !== orderId ? { ...order, ...updates } : order
    ));
  };

  const selectPharmacy = (pharmacyId: string) => {
    if (selectedOrderForPharmacy) {
      updateOrder(selectedOrderForPharmacy, { selectedPharmacy: pharmacyId });
    }
    setPharmacyModalOpen(false);
    setSelectedOrderForPharmacy("");
    setPharmacySearch("");
  };

  const openPharmacyModal = (orderId: string) => {
    setSelectedOrderForPharmacy(orderId);
    setPharmacyModalOpen(true);
  };

  const filteredPharmacies = allPharmacies.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(pharmacySearch.toLowerCase()) ||
    pharmacy.address.toLowerCase().includes(pharmacySearch.toLowerCase())
  );

  const getSelectedPharmacy = (pharmacyId: string) => {
    return [...defaultPharmacies, ...allPharmacies].find(p => p.id === pharmacyId);
  };

  // AI Suggestion Component (consistent with AIChipClosedSmart style)
  const AIsuggestion = ({ text, onInsert, onDismiss }: { text: string; onInsert: () => void; onDismiss: () => void }) => {
    return (
      <div className="mt-2 w-full flex items-center justify-between rounded-full border border-border bg-surface-muted px-3 py-2 text-[13px] text-fg">
        <div className="min-w-0 flex items-center gap-2 overflow-hidden">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            fill="none"
            className="shrink-0 text-fg"
            aria-hidden="true"
          >
            <mask id="mask0_1169_244" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="0" y="0" width="12" height="12">
              <path d="M12 0H0V12H12V0Z" fill="white"/>
            </mask>
            <g mask="url(#mask0_1169_244)">
              <path d="M9.74997 6.75C9.75087 6.90289 9.70444 7.05233 9.61699 7.17775C9.52954 7.30315 9.40534 7.39838 9.26149 7.45031L6.8437 8.34375L5.95308 10.7634C5.90034 10.9067 5.80491 11.0304 5.67968 11.1177C5.55445 11.2051 5.40544 11.2519 5.25277 11.2519C5.10008 11.2519 4.95107 11.2051 4.82584 11.1177C4.70062 11.0304 4.60519 10.9067 4.55245 10.7634L3.6562 8.34375L1.23652 7.45312C1.09323 7.40038 0.969577 7.30496 0.882224 7.17974C0.794879 7.0545 0.748047 6.9055 0.748047 6.75281C0.748047 6.60013 0.794879 6.45112 0.882224 6.32589C0.969577 6.20066 1.09323 6.10524 1.23652 6.0525L3.6562 5.15625L4.54683 2.73656C4.59957 2.59328 4.69499 2.46962 4.82022 2.38228C4.94545 2.29492 5.09446 2.24809 5.24714 2.24809C5.39982 2.24809 5.54883 2.29492 5.67406 2.38228C5.79928 2.46962 5.89471 2.59328 5.94745 2.73656L6.8437 5.15625L9.26337 6.04688C9.40729 6.09928 9.53142 6.19506 9.61857 6.32101C9.70572 6.44696 9.75162 6.59685 9.74997 6.75ZM7.12495 2.25H7.87497V3C7.87497 3.09946 7.91449 3.19484 7.98477 3.26516C8.05512 3.33549 8.15052 3.375 8.24997 3.375C8.34942 3.375 8.44482 3.33549 8.51509 3.26516C8.58544 3.19484 8.62497 3.09946 8.62497 3V2.25H9.37497C9.47442 2.25 9.56982 2.21049 9.64009 2.14016C9.71044 2.06984 9.74997 1.97446 9.74997 1.875C9.74997 1.77554 9.71044 1.68016 9.64009 1.60984C9.56982 1.53951 9.47442 1.5 9.37497 1.5H8.62497V0.75C8.62497 0.650544 8.58544 0.555161 8.51509 0.484835C8.44482 0.414509 8.34942 0.375 8.24997 0.375C8.15052 0.375 8.05512 0.414509 7.98477 0.484835C7.91449 0.555161 7.87497 0.650544 7.87497 0.75V1.5H7.12495C7.0255 1.5 6.93011 1.53951 6.85978 1.60984C6.78946 1.68016 6.74995 1.77554 6.74995 1.875C6.74995 1.97446 6.78946 2.06984 6.85978 2.14016C6.93011 2.21049 7.0255 2.25 7.12495 2.25ZM11.25 3.75H10.875V3.375C10.875 3.27554 10.8354 3.18016 10.7651 3.10984C10.6948 3.03951 10.5994 3 10.5 3C10.4005 3 10.3051 3.03951 10.2348 3.10984C10.1645 3.18016 10.125 3.27554 10.125 3.375V3.75H9.74997C9.65052 3.75 9.55512 3.78951 9.48477 3.85984C9.41449 3.93016 9.37497 4.02554 9.37497 4.125C9.37497 4.22446 9.41449 4.31984 9.48477 4.39016C9.55512 4.46049 9.65052 4.5 9.74997 4.5H10.125V4.875C10.125 4.97446 10.1645 5.06984 10.2348 5.14016C10.3051 5.21049 10.4005 5.25 10.5 5.25C10.5994 5.25 10.6948 5.21049 10.7651 5.14016C10.8354 5.06984 10.875 4.97446 10.875 4.875V4.5H11.25C11.3494 4.5 11.4448 4.46049 11.5151 4.39016C11.5854 4.31984 11.625 4.22446 11.625 4.125C11.625 4.02554 11.5854 3.93016 11.5151 3.85984C11.4448 3.78951 11.3494 3.75 11.25 3.75Z" fill="currentColor"/>
            </g>
          </svg>
          <strong className="shrink-0">GoldCare&nbsp;AI:</strong>
          <span className="min-w-0 truncate whitespace-nowrap" title={text}>
            {text}
          </span>
        </div>

        <button
          type="button"
          onClick={onInsert}
          className="ml-3 shrink-0 text-[12px] font-medium text-primary hover:underline focus:outline-none"
          aria-label="Insert GoldCare AI suggestion"
        >
          Insert
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-fg">
            <Pill className="h-6 w-6 text-medical-blue" />
            RX - Prescriptions
          </h1>
          <p className="text-fg-muted">Create and manage prescription orders</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button onClick={addOrder} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Order
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {orders.map((order, index) => (
          <section key={order.id} data-testid="rx-form-root">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-fg">Prescription #{index + 1}</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Create Refill
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  <Edit3 className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                {orders.length > 1 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-danger hover:text-danger"
                    onClick={() => removeOrder(order.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* Medicine Name */}
              <div>
                <Label className="text-sm font-medium text-fg mb-2">Medicine Name *</Label>
                <Input
                  value={order.medicineName}
                  onChange={(e) => updateOrder(order.id, { medicineName: e.target.value })}
                  placeholder="Enter medicine name"
                />
                <AIsuggestion 
                  text="Based on patient history and symptoms, consider prescribing Lisinopril 10mg daily for hypertension management. This ACE inhibitor has shown excellent results in similar patient profiles."
                  onInsert={() => updateOrder(order.id, { medicineName: "Lisinopril" })}
                  onDismiss={() => {}}
                />
              </div>

              {/* Formulation and Route */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-fg mb-2">Formulation *</Label>
                  <Select value={order.formulation} onValueChange={(value) => updateOrder(order.id, { formulation: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select formulation" />
                    </SelectTrigger>
                    <SelectContent>
                      {formulationOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-fg mb-2">Route *</Label>
                  <Select value={order.route} onValueChange={(value) => updateOrder(order.id, { route: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                    <SelectContent>
                      {routeOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Dose and Quantity */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label className="text-sm font-medium text-fg mb-2">Dose *</Label>
                  <Input
                    type="number"
                    value={order.dose}
                    onChange={(e) => updateOrder(order.id, { dose: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-fg mb-2">Unit</Label>
                  <Select value={order.doseUnit} onValueChange={(value) => updateOrder(order.id, { doseUnit: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {doseUnits.map((unit) => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-fg mb-2">Quantity *</Label>
                  <Input
                    type="number"
                    value={order.quantity}
                    onChange={(e) => updateOrder(order.id, { quantity: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Frequency */}
              <div>
                <Label className="text-sm font-medium text-fg mb-2">Frequency *</Label>
                <Select value={order.frequency} onValueChange={(value) => updateOrder(order.id, { frequency: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Duration and Refills */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label className="text-sm font-medium text-fg mb-2">Duration</Label>
                  <Input
                    type="number"
                    value={order.duration}
                    onChange={(e) => updateOrder(order.id, { duration: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-fg mb-2">Unit</Label>
                  <Select value={order.durationUnit} onValueChange={(value) => updateOrder(order.id, { durationUnit: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {durationUnits.map((unit) => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-fg mb-2">Refills</Label>
                  <Input
                    type="number"
                    min="0"
                    max="11"
                    value={order.refills}
                    onChange={(e) => updateOrder(order.id, { refills: e.target.value })}
                  />
                </div>
              </div>

              {/* PRN */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`prn-${order.id}`}
                    checked={order.prn}
                    onCheckedChange={(checked) => updateOrder(order.id, { prn: checked as boolean })}
                    className="border-border focus-visible:ring-primary"
                  />
                  <Label htmlFor={`prn-${order.id}`} className="text-sm font-medium text-fg cursor-pointer">
                    PRN (As needed)
                  </Label>
                </div>

                {order.prn && (
                  <div className="ml-6">
                    <Label className="text-sm font-medium text-fg mb-2">PRN Indication</Label>
                    <Input
                      value={order.prnIndication}
                      onChange={(e) => updateOrder(order.id, { prnIndication: e.target.value })}
                      placeholder="Indication for PRN use"
                    />
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              <div>
                <Label className="text-sm font-medium text-fg mb-2">Special Instructions</Label>
                <Textarea
                  value={order.specialInstructions}
                  onChange={(e) => updateOrder(order.id, { specialInstructions: e.target.value })}
                  placeholder="Additional instructions for the patient or pharmacy"
                  className="resize-none"
                  rows={3}
                />
              </div>

              {/* Pharmacy Selector */}
              <div>
                <Label className="text-sm font-medium text-fg mb-2">Pharmacy *</Label>
                <div className="flex items-center justify-between p-3 border border-border rounded-md">
                  <div className="flex-1">
                    {getSelectedPharmacy(order.selectedPharmacy) && (
                      <div>
                        <div className="font-medium text-fg">
                          {getSelectedPharmacy(order.selectedPharmacy)!.name}
                        </div>
                        <div className="text-sm text-fg-muted">
                          {getSelectedPharmacy(order.selectedPharmacy)!.address}
                        </div>
                        <div className="text-sm text-fg-muted">
                          {getSelectedPharmacy(order.selectedPharmacy)!.phone}
                        </div>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => openPharmacyModal(order.id)}
                    className="ml-4"
                  >
                    Choose other pharmacy
                  </Button>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <Separator />
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button variant="outline">Cancel</Button>
        <Button variant="outline">Save</Button>
        <Button>Send to Manager</Button>
      </div>

      {/* Pharmacy Selection Modal */}
      <Dialog open={pharmacyModalOpen} onOpenChange={setPharmacyModalOpen}>
        <DialogContent className="max-w-2xl bg-bg border-border">
          <DialogHeader>
            <DialogTitle className="text-fg">Choose Pharmacy</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
                <Input
                  placeholder="Search pharmacies..."
                  value={pharmacySearch}
                  onChange={(e) => setPharmacySearch(e.target.value)}
                  className="pl-10"
                />
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredPharmacies.map((pharmacy) => (
                <div
                  key={pharmacy.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg bg-surface hover:bg-bg transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium text-fg">{pharmacy.name}</div>
                    <div className="text-sm text-fg-muted">{pharmacy.address}</div>
                    <div className="text-sm text-fg-muted">{pharmacy.phone}</div>
                    {pharmacy.distance && (
                      <div className="text-xs text-primary mt-1">{pharmacy.distance} away</div>
                    )}
                  </div>
                  <Button
                    onClick={() => selectPharmacy(pharmacy.id)}
                    className="ml-4"
                  >
                    Select
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}