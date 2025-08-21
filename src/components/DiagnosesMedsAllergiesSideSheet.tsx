import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

interface DiagnosesMedsAllergiesSideSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Diagnosis {
  id: string;
  code: string;
  label: string;
  author: string;
  when: string;
}

interface Medication {
  id: string;
  name: string;
  author: string;
  when: string;
}

interface Allergy {
  id: string;
  substance: string;
  reaction: string;
  author: string;
  when: string;
}

const seedData = {
  diagnoses: [
    { id: "d1", code: "E66.811", label: "Obesity, class 1", author: "Deb Diener", when: "3 months ago" },
    { id: "d2", code: "E66.811", label: "Obesity, class 1", author: "Deb Diener", when: "3 months ago" }
  ],
  medications: [
    { id: "m1", name: "Escitalopram", author: "Deb Diener", when: "3 days ago" }
  ],
  allergies: [
    { id: "a1", substance: "Penicillin", reaction: "Rash", author: "Deb Diener", when: "2 weeks ago" },
    { id: "a2", substance: "Penicillin", reaction: "Itches", author: "Deb Diener", when: "2 weeks ago" },
    { id: "a3", substance: "Penicillin", reaction: "Breathing difficulty", author: "Deb Diener", when: "2 weeks ago" }
  ]
};

export function DiagnosesMedsAllergiesSideSheet({ isOpen, onClose }: DiagnosesMedsAllergiesSideSheetProps) {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>(seedData.diagnoses);
  const [medications, setMedications] = useState<Medication[]>(seedData.medications);
  const [allergies, setAllergies] = useState<Allergy[]>(seedData.allergies);
  
  const [diagnosesOpen, setDiagnosesOpen] = useState(true);
  const [medicationsOpen, setMedicationsOpen] = useState(true);
  const [allergiesOpen, setAllergiesOpen] = useState(true);

  const [showAddDiagnosis, setShowAddDiagnosis] = useState(false);
  const [showAddMedication, setShowAddMedication] = useState(false);
  const [showAddAllergy, setShowAddAllergy] = useState(false);

  const [removeConfirm, setRemoveConfirm] = useState<{ type: string; id: string } | null>(null);

  // Handle keyboard shortcuts and URL hash
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // This would be handled by the parent component
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    // Handle URL hash
    if (window.location.hash === "#dma" && !isOpen) {
      // This would be handled by the parent component
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleRemoveItem = (type: string, id: string) => {
    if (type === "diagnosis") {
      setDiagnoses(prev => prev.filter(item => item.id !== id));
    } else if (type === "medication") {
      setMedications(prev => prev.filter(item => item.id !== id));
    } else if (type === "allergy") {
      setAllergies(prev => prev.filter(item => item.id !== id));
    }
    setRemoveConfirm(null);
  };

  const handleAddDiagnosis = (data: { code: string; label: string; note?: string }) => {
    const newDiagnosis: Diagnosis = {
      id: Date.now().toString(),
      code: data.code,
      label: data.label,
      author: "Current User",
      when: "just now"
    };
    setDiagnoses(prev => [newDiagnosis, ...prev]);
    setShowAddDiagnosis(false);
  };

  const handleAddMedication = (data: { name: string; dose?: string; directions?: string; startDate?: string }) => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      name: data.name,
      author: "Current User",
      when: "just now"
    };
    setMedications(prev => [newMedication, ...prev]);
    setShowAddMedication(false);
  };

  const handleAddAllergy = (data: { allergen: string; reaction: string; severity?: string }) => {
    const newAllergy: Allergy = {
      id: Date.now().toString(),
      substance: data.allergen,
      reaction: data.reaction,
      author: "Current User",
      when: "just now"
    };
    setAllergies(prev => [newAllergy, ...prev]);
    setShowAddAllergy(false);
  };

  return (
    <div className="h-full flex flex-col bg-bg">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-bg border-b border-border z-10">
        <div className="flex items-center justify-between p-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Diagnoses, Meds, Allergies</h2>
          <p className="text-sm text-muted-foreground mt-1">Clinical summary</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-bg">
        {/* Diagnoses Section */}
        <div className="space-y-4">
          <Collapsible open={diagnosesOpen} onOpenChange={setDiagnosesOpen}>
            <div className="flex items-center justify-between">
              <CollapsibleTrigger className="flex items-center gap-2 text-base font-semibold text-foreground hover:text-foreground/80">
                {diagnosesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                Diagnoses
              </CollapsibleTrigger>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddDiagnosis(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
                Add new
              </Button>
            </div>
            
            <CollapsibleContent className="space-y-3">
              {showAddDiagnosis && (
                <AddDiagnosisForm
                  onSubmit={handleAddDiagnosis}
                  onCancel={() => setShowAddDiagnosis(false)}
                />
              )}
              
              {diagnoses.map((diagnosis) => (
                <div
                  key={diagnosis.id}
                  className="p-3 rounded-md hover:bg-muted/50 border border-transparent hover:border-border transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-foreground">
                        {diagnosis.code} – {diagnosis.label}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {diagnosis.author} • {diagnosis.when}
                      </div>
                    </div>
                    <button
                      onClick={() => setRemoveConfirm({ type: "diagnosis", id: diagnosis.id })}
                      className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Medications Section */}
        <div className="space-y-4">
          <Collapsible open={medicationsOpen} onOpenChange={setMedicationsOpen}>
            <div className="flex items-center justify-between">
              <CollapsibleTrigger className="flex items-center gap-2 text-base font-semibold text-foreground hover:text-foreground/80">
                {medicationsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                Medications
              </CollapsibleTrigger>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddMedication(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
                Add new
              </Button>
            </div>
            
            <CollapsibleContent className="space-y-3">
              {showAddMedication && (
                <AddMedicationForm
                  onSubmit={handleAddMedication}
                  onCancel={() => setShowAddMedication(false)}
                />
              )}
              
              {medications.map((medication) => (
                <div
                  key={medication.id}
                  className="p-3 rounded-md hover:bg-muted/50 border border-transparent hover:border-border transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{medication.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {medication.author} • {medication.when}
                      </div>
                    </div>
                    <button
                      onClick={() => setRemoveConfirm({ type: "medication", id: medication.id })}
                      className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Allergies Section */}
        <div className="space-y-4">
          <Collapsible open={allergiesOpen} onOpenChange={setAllergiesOpen}>
            <div className="flex items-center justify-between">
              <CollapsibleTrigger className="flex items-center gap-2 text-base font-semibold text-foreground hover:text-foreground/80">
                {allergiesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                Allergies
              </CollapsibleTrigger>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddAllergy(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
                Add new
              </Button>
            </div>
            
            <CollapsibleContent className="space-y-3">
              {showAddAllergy && (
                <AddAllergyForm
                  onSubmit={handleAddAllergy}
                  onCancel={() => setShowAddAllergy(false)}
                />
              )}
              
              {allergies.map((allergy) => (
                <div
                  key={allergy.id}
                  className="p-3 rounded-md hover:bg-muted/50 border border-transparent hover:border-border transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-foreground">
                        {allergy.substance} – {allergy.reaction}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {allergy.author} • {allergy.when}
                      </div>
                    </div>
                    <button
                      onClick={() => setRemoveConfirm({ type: "allergy", id: allergy.id })}
                      className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* Remove Confirmation Popover */}
      {removeConfirm && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md border shadow-sm max-w-sm mx-4">
            <p className="text-sm text-foreground mb-3">Remove item?</p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRemoveConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveItem(removeConfirm.type, removeConfirm.id)}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add Diagnosis Form Component
function AddDiagnosisForm({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) {
  const [code, setCode] = useState("");
  const [label, setLabel] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !label) return;
    onSubmit({ code, label, note });
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border border-border rounded-md bg-muted/50 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="code" className="text-sm font-medium">ICD-10 Code</Label>
          <Input
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="E66.811"
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="label" className="text-sm font-medium">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Diagnosis name"
            className="mt-1"
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="note" className="text-sm font-medium">Optional Note</Label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Additional notes..."
          className="mt-1"
          rows={2}
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm">
          Save
        </Button>
      </div>
    </form>
  );
}

// Add Medication Form Component
function AddMedicationForm({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) {
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [directions, setDirections] = useState("");
  const [startDate, setStartDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onSubmit({ name, dose, directions, startDate });
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border border-border rounded-md bg-muted/50 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="med-name" className="text-sm font-medium">Medication Name</Label>
          <Input
            id="med-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Escitalopram"
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="dose" className="text-sm font-medium">Dose</Label>
          <Input
            id="dose"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            placeholder="10mg"
            className="mt-1"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="directions" className="text-sm font-medium">Directions</Label>
        <Textarea
          id="directions"
          value={directions}
          onChange={(e) => setDirections(e.target.value)}
          placeholder="Take once daily with food"
          className="mt-1"
          rows={2}
        />
      </div>
      <div>
        <Label htmlFor="start-date" className="text-sm font-medium">Start Date</Label>
        <Input
          id="start-date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-1"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm">
          Save
        </Button>
      </div>
    </form>
  );
}

// Add Allergy Form Component
function AddAllergyForm({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) {
  const [allergen, setAllergen] = useState("");
  const [reaction, setReaction] = useState("");
  const [severity, setSeverity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allergen || !reaction) return;
    onSubmit({ allergen, reaction, severity });
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border border-border rounded-md bg-muted/50 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="allergen" className="text-sm font-medium">Allergen</Label>
          <Input
            id="allergen"
            value={allergen}
            onChange={(e) => setAllergen(e.target.value)}
            placeholder="Penicillin"
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="reaction" className="text-sm font-medium">Reaction</Label>
          <Input
            id="reaction"
            value={reaction}
            onChange={(e) => setReaction(e.target.value)}
            placeholder="Rash"
            className="mt-1"
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="severity" className="text-sm font-medium">Severity</Label>
        <Select value={severity} onValueChange={setSeverity}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mild">Mild</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="severe">Severe</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm">
          Save
        </Button>
      </div>
    </form>
  );
}