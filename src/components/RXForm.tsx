import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Edit3, RefreshCw, Search, Pill } from "lucide-react";

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

  // AI Suggestion Component (SOAP style)
  const AIsuggestion = ({ text, onInsert, onDismiss }: { text: string; onInsert: () => void; onDismiss: () => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [hasOverflow, setHasOverflow] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
      const checkOverflow = () => {
        if (textRef.current) {
          const { scrollHeight, clientHeight } = textRef.current;
          setHasOverflow(scrollHeight > clientHeight);
        }
      };

      checkOverflow();
      window.addEventListener('resize', checkOverflow);

      return () => {
        window.removeEventListener('resize', checkOverflow);
      };
    }, [text, isExpanded]);
    
    return (
      <div className="mt-3 p-4 rounded-lg bg-surface shadow-sm">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
              <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 16 16">
                <g clipPath="url(#clip0_1036_3138)">
                  <path d="M13 9C13.0012 9.20386 12.9393 9.40311 12.8227 9.57033C12.7061 9.73754 12.5405 9.86451 12.3487 9.93375L9.12498 11.125L7.93748 14.3512C7.86716 14.5423 7.73992 14.7072 7.57295 14.8236C7.40598 14.9401 7.2073 15.0025 7.00373 15.0025C6.80015 15.0025 6.60147 14.9401 6.4345 14.8236C6.26753 14.7072 6.1403 14.5423 6.06998 14.3512L4.87498 11.125L1.64873 9.9375C1.45768 9.86718 1.29281 9.73995 1.17634 9.57298C1.05988 9.406 0.997437 9.20733 0.997437 9.00375C0.997437 8.80017 1.05988 8.6015 1.17634 8.43452C1.29281 8.26755 1.45768 8.14032 1.64873 8.07L4.87498 6.875L6.06248 3.64875C6.1328 3.45771 6.26003 3.29283 6.427 3.17637C6.59397 3.0599 6.79265 2.99746 6.99623 2.99746C7.1998 2.99746 7.39848 3.0599 7.56545 3.17637C7.73242 3.29283 7.85965 3.45771 7.92998 3.64875L9.12498 6.875L12.3512 8.0625C12.5431 8.13237 12.7086 8.26008 12.8248 8.42801C12.941 8.59594 13.0022 8.7958 13 9ZM9.49998 3H10.5V4C10.5 4.13261 10.5527 4.25979 10.6464 4.35355C10.7402 4.44732 10.8674 4.5 11 4.5C11.1326 4.5 11.2598 4.44732 11.3535 4.35355C11.4473 4.25979 11.5 4.13261 11.5 4V3H12.5C12.6326 3 12.7598 2.94732 12.8535 2.85355C12.9473 2.75979 13 2.63261 13 2.5C13 2.36739 12.9473 2.24021 12.8535 2.14645C12.7598 2.05268 12.6326 2 12.5 2H11.5V1C11.5 0.867392 11.4473 0.740215 11.3535 0.646447C11.2598 0.552678 11.1326 0.5 11 0.5C10.8674 0.5 10.7402 0.552678 10.6464 0.646447C10.5527 0.740215 10.5 0.867392 10.5 1V2H9.49998C9.36737 2 9.24019 2.05268 9.14642 2.14645C9.05266 2.24021 8.99998 2.36739 8.99998 2.5C8.99998 2.63261 9.05266 2.75979 9.14642 2.85355C9.24019 2.94732 9.36737 3 9.49998 3ZM15 5H14.5V4.5C14.5 4.36739 14.4473 4.24021 14.3535 4.14645C14.2598 4.05268 14.1326 4 14 4C13.8674 4 13.7402 4.05268 13.6464 4.14645C13.5527 4.24021 13.5 4.36739 13.5 4.5V5H13C12.8674 5 12.7402 5.05268 12.6464 5.14645C12.5527 5.24021 12.5 5.36739 12.5 5.5C12.5 5.63261 12.5527 5.75979 12.6464 5.85355C12.7402 5.94732 12.8674 6 13 6H13.5V6.5C13.5 6.63261 13.5527 6.75979 13.6464 6.85355C13.7402 6.94732 13.8674 7 14 7C14.1326 7 14.2598 6.94732 14.3535 6.85355C14.4473 6.75979 14.5 6.63261 14.5 6.5V6H15C15.1326 6 15.2598 5.94732 15.3535 5.85355C15.4473 5.75979 15.5 5.63261 15.5 5.5C15.5 5.36739 15.4473 5.24021 15.3535 5.14645C15.2598 5.05268 15.1326 5 15 5Z"/>
                </g>
                <defs>
                  <clipPath id="clip0_1036_3138">
                    <rect width="16" height="16" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <span className="text-sm font-semibold text-fg">GoldCare AI</span>
            <span className="text-xs text-fg-muted">Suggestion</span>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={onInsert} className="text-sm font-medium text-primary underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Insert above</button>
            <button type="button" onClick={onDismiss} className="text-sm font-medium text-fg underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Dismiss</button>
          </div>
        </div>
        
        <div className="relative">
          <p 
            ref={textRef}
            className={`text-sm text-fg leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}
          >
            {text}
          </p>
          {hasOverflow && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-xs text-primary underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header - SOAP Style */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-muted-foreground">
            <Pill className="h-6 w-6 text-medical-blue" />
            RX - Prescriptions
          </h1>
          <p className="text-fg-muted">Create and manage prescription orders</p>
        </div>
        <Button onClick={addOrder} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Order
        </Button>
      </div>

      {/* Orders - SOAP Section Style */}
      <div className="space-y-8">
        {orders.map((order, index) => (
          <section key={order.id} data-testid="rx-form-root">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">Prescription #{index + 1}</h3>
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

            {/* Fields - SOAP Style */}
            <div className="space-y-6">
              {/* Medicine Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Medicine Name *</label>
                <input
                  value={order.medicineName}
                  onChange={(e) => updateOrder(order.id, { medicineName: e.target.value })}
                  placeholder="Enter medicine name"
                  className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  <label className="block text-sm font-medium text-foreground mb-2">Formulation *</label>
                  <Select value={order.formulation} onValueChange={(value) => updateOrder(order.id, { formulation: value })}>
                    <SelectTrigger className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent">
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
                  <label className="block text-sm font-medium text-foreground mb-2">Route *</label>
                  <Select value={order.route} onValueChange={(value) => updateOrder(order.id, { route: value })}>
                    <SelectTrigger className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent">
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
                  <label className="block text-sm font-medium text-foreground mb-2">Dose *</label>
                  <input
                    type="number"
                    value={order.dose}
                    onChange={(e) => updateOrder(order.id, { dose: e.target.value })}
                    placeholder="0"
                    className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Unit</label>
                  <Select value={order.doseUnit} onValueChange={(value) => updateOrder(order.id, { doseUnit: value })}>
                    <SelectTrigger className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent">
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
                  <label className="block text-sm font-medium text-foreground mb-2">Quantity *</label>
                  <input
                    type="number"
                    value={order.quantity}
                    onChange={(e) => updateOrder(order.id, { quantity: e.target.value })}
                    placeholder="0"
                    className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Frequency *</label>
                <Select value={order.frequency} onValueChange={(value) => updateOrder(order.id, { frequency: value })}>
                  <SelectTrigger className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent">
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
                  <label className="block text-sm font-medium text-foreground mb-2">Duration</label>
                  <input
                    type="number"
                    value={order.duration}
                    onChange={(e) => updateOrder(order.id, { duration: e.target.value })}
                    placeholder="0"
                    className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Unit</label>
                  <Select value={order.durationUnit} onValueChange={(value) => updateOrder(order.id, { durationUnit: value })}>
                    <SelectTrigger className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent">
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
                  <label className="block text-sm font-medium text-foreground mb-2">Refills</label>
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={order.refills}
                    onChange={(e) => updateOrder(order.id, { refills: e.target.value })}
                    className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  <label htmlFor={`prn-${order.id}`} className="text-sm font-medium text-foreground cursor-pointer">
                    PRN (As needed)
                  </label>
                </div>

                {order.prn && (
                  <div className="ml-6">
                    <label className="block text-sm font-medium text-foreground mb-2">PRN Indication</label>
                    <input
                      value={order.prnIndication}
                      onChange={(e) => updateOrder(order.id, { prnIndication: e.target.value })}
                      placeholder="Indication for PRN use"
                      className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Special Instructions</label>
                <textarea
                  value={order.specialInstructions}
                  onChange={(e) => updateOrder(order.id, { specialInstructions: e.target.value })}
                  placeholder="Additional instructions for the patient or pharmacy"
                  className="w-full h-24 p-3 border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Pharmacy Selector */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Pharmacy *</label>
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

      {/* Footer Actions - SOAP Style */}
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
                className="pl-10 bg-surface text-fg placeholder:text-fg-muted border-border focus-visible:ring-primary"
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