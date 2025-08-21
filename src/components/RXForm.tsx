import { useState } from "react";
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
      order.id === orderId ? { ...order, ...updates } : order
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-fg">
            <Pill className="h-6 w-6 text-primary" />
            RX - Prescriptions
          </h1>
          <p className="text-fg-muted">Create and manage prescription orders</p>
        </div>
        <Button onClick={addOrder} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Order
        </Button>
      </div>

      <div className="space-y-6">
        {orders.map((order, index) => (
          <Card key={order.id} className="bg-surface border border-border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-fg">Order #{index + 1}</span>
                  {order.medicineName && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {order.medicineName}
                    </Badge>
                  )}
                </div>
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
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Medicine Name */}
              <div className="space-y-2">
                <Label htmlFor={`medicine-${order.id}`} className="text-sm font-medium text-fg">
                  Medicine Name *
                </Label>
                <Input
                  id={`medicine-${order.id}`}
                  value={order.medicineName}
                  onChange={(e) => updateOrder(order.id, { medicineName: e.target.value })}
                  placeholder="Enter medicine name"
                  className="bg-surface text-fg placeholder:text-fg-muted border-border focus-visible:ring-primary"
                />
              </div>

              {/* Formulation and Route */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-fg">Formulation *</Label>
                  <Select value={order.formulation} onValueChange={(value) => updateOrder(order.id, { formulation: value })}>
                    <SelectTrigger className="bg-surface text-fg border-border focus:ring-primary">
                      <SelectValue placeholder="Select formulation" />
                    </SelectTrigger>
                    <SelectContent>
                      {formulationOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-fg">Route *</Label>
                  <Select value={order.route} onValueChange={(value) => updateOrder(order.id, { route: value })}>
                    <SelectTrigger className="bg-surface text-fg border-border focus:ring-primary">
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
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-fg">Dose *</Label>
                  <Input
                    type="number"
                    value={order.dose}
                    onChange={(e) => updateOrder(order.id, { dose: e.target.value })}
                    placeholder="0"
                    className="bg-surface text-fg placeholder:text-fg-muted border-border focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-fg">Unit</Label>
                  <Select value={order.doseUnit} onValueChange={(value) => updateOrder(order.id, { doseUnit: value })}>
                    <SelectTrigger className="bg-surface text-fg border-border focus:ring-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {doseUnits.map((unit) => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-fg">Quantity *</Label>
                  <Input
                    type="number"
                    value={order.quantity}
                    onChange={(e) => updateOrder(order.id, { quantity: e.target.value })}
                    placeholder="0"
                    className="bg-surface text-fg placeholder:text-fg-muted border-border focus-visible:ring-primary"
                  />
                </div>
              </div>

              {/* Frequency */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-fg">Frequency *</Label>
                <Select value={order.frequency} onValueChange={(value) => updateOrder(order.id, { frequency: value })}>
                  <SelectTrigger className="bg-surface text-fg border-border focus:ring-primary">
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
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-fg">Duration</Label>
                  <Input
                    type="number"
                    value={order.duration}
                    onChange={(e) => updateOrder(order.id, { duration: e.target.value })}
                    placeholder="0"
                    className="bg-surface text-fg placeholder:text-fg-muted border-border focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-fg">Unit</Label>
                  <Select value={order.durationUnit} onValueChange={(value) => updateOrder(order.id, { durationUnit: value })}>
                    <SelectTrigger className="bg-surface text-fg border-border focus:ring-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {durationUnits.map((unit) => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-fg">Refills</Label>
                  <Input
                    type="number"
                    min="0"
                    max="11"
                    value={order.refills}
                    onChange={(e) => updateOrder(order.id, { refills: e.target.value })}
                    className="bg-surface text-fg placeholder:text-fg-muted border-border focus-visible:ring-primary"
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
                  <div className="space-y-2 ml-6">
                    <Label className="text-sm font-medium text-fg">PRN Indication</Label>
                    <Input
                      value={order.prnIndication}
                      onChange={(e) => updateOrder(order.id, { prnIndication: e.target.value })}
                      placeholder="Indication for PRN use"
                      className="bg-surface text-fg placeholder:text-fg-muted border-border focus-visible:ring-primary"
                    />
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-fg">Special Instructions</Label>
                <Textarea
                  value={order.specialInstructions}
                  onChange={(e) => updateOrder(order.id, { specialInstructions: e.target.value })}
                  placeholder="Additional instructions for the patient or pharmacy"
                  className="bg-surface text-fg placeholder:text-fg-muted border-border focus-visible:ring-primary resize-none"
                  rows={3}
                />
              </div>

              {/* Pharmacy Selector */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-fg">Pharmacy *</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-border rounded-md bg-bg">
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer Actions */}
      <Separator />
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button variant="outline">Cancel</Button>
        <Button variant="outline">Save</Button>
        <Button className="bg-primary text-on-primary hover:bg-primary/90">
          Send to Manager
        </Button>
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