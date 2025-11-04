import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { PageHeader } from "@/components/ui/page-header";
import { StickyNote } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useConsultStore } from "@/store/useConsultStore";
import PageContainer from "@/components/layout/PageContainer";

export function PrivateNotesSection() {
  const { privateNotes, updatePrivateNotes } = useConsultStore();

  const handleSave = () => {
    toast({
      title: "Private Notes Saved",
      description: "Your private clinician notes have been automatically saved.",
    });
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Private Clinician Notes"
          description="Personal notes visible only to you during the consultation"
          icon={StickyNote}
          onSave={handleSave}
        />

        <div className="border border-gray-200 rounded-xl p-6">
          <AutosizeTextarea
            value={privateNotes}
            onChange={(e) => updatePrivateNotes(e.target.value)}
            placeholder="Add private notes about the patient, your observations, follow-up reminders, or any other information you want to remember..."
            minRows={12}
            maxRows={24}
            className="text-sm"
          />
          
          <div className="text-xs text-gray-600 mt-4">
            These notes are private and will not be visible to the patient or included in official documentation.
          </div>
        </div>
      </div>
    </PageContainer>
  );
}