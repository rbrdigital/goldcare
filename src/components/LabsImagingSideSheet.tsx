import { useState, useEffect } from "react";
import { X, FileText, ExternalLink, Copy, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
interface LabImagingItem {
  id: string;
  source: string;
  datetime: string;
  status: "Awaiting" | "Sending" | "Pending" | "Draft";
  details: {
    tests: string[];
    notes: string;
  };
}
const mockData = {
  labs: [{
    id: "lab_001",
    source: "Primary & Acute Care",
    datetime: "2025-06-07T09:00:00-04:00",
    status: "Awaiting" as const,
    details: {
      tests: ["CBC with Differential (CBC)", "Metabolic Panel (BMP)"],
      notes: "Routine follow-up panel"
    }
  }, {
    id: "lab_002",
    source: "Primary & Acute Care",
    datetime: "2025-06-07T09:00:00-04:00",
    status: "Sending" as const,
    details: {
      tests: ["DHEA 004020", "Cortisol-am 004018", "Insulin 004333", "CRP-HS 120766"],
      notes: "Inflammation/Stress panel"
    }
  }, {
    id: "lab_003",
    source: "Primary & Acute Care",
    datetime: "2025-06-07T09:00:00-04:00",
    status: "Pending" as const,
    details: {
      tests: ["Thyroid Comprehensive"],
      notes: ""
    }
  }, {
    id: "lab_004",
    source: "Primary & Acute Care",
    datetime: "2025-06-07T09:00:00-04:00",
    status: "Draft" as const,
    details: {
      tests: ["Lipid Panel"],
      notes: "Awaiting confirmation"
    }
  }],
  imaging: [{
    id: "img_001",
    source: "Radiology",
    datetime: "2025-05-12T11:30:00-04:00",
    status: "Pending" as const,
    details: {
      tests: ["Chest X-ray (PA/LAT)"],
      notes: "R/O pneumonia"
    }
  }]
};
interface LabsImagingSideSheetProps {
  isOpen: boolean;
  onClose: () => void;
}
export function LabsImagingSideSheet({
  isOpen,
  onClose
}: LabsImagingSideSheetProps) {
  const [activeTab, setActiveTab] = useState<"labs" | "imaging">("labs");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const itemsPerPage = 10;

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
      if ((e.altKey || e.metaKey) && e.key === "l") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle URL hash
  useEffect(() => {
    if (window.location.hash === "#prev-labs" && !isOpen) {
      // This would be handled by parent component
    }
  }, [isOpen]);
  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };
  const getStatusChip = (status: string) => {
    const variants = {
      Awaiting: "bg-muted text-muted-foreground border-border",
      Sending: "bg-blue-50 text-blue-700 border-blue-200",
      Pending: "bg-amber-50 text-[hsl(33,95%,38%)] border-amber-200",
      Draft: "bg-muted text-muted-foreground border-border"
    };
    return <Badge variant="outline" className={cn("text-xs px-2 py-1", variants[status as keyof typeof variants])}>
        {status}
      </Badge>;
  };
  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }) + " • " + date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit"
    });
  };
  const currentData = mockData[activeTab];
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = currentData.slice(startIndex, startIndex + itemsPerPage);
  return <div className="h-full flex flex-col bg-bg">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-bg border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Previous Labs & Imaging</h2>
          <p className="text-xs text-muted-foreground">Historical results for this patient</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button onClick={() => setActiveTab("labs")} className={cn("flex-1 px-4 py-3 text-sm font-medium transition-colors relative", activeTab === "labs" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground")}>
          Labs
        </button>
        <button onClick={() => setActiveTab("imaging")} className={cn("flex-1 px-4 py-3 text-sm font-medium transition-colors relative", activeTab === "imaging" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground")}>
          Imaging
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {paginatedData.length === 0 ? <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-2">No previous results yet.</p>
            <Button variant="link" size="sm" className="text-xs">
              Create Lab Order
            </Button>
          </div> : <div className="space-y-4">
            {paginatedData.map((item, index) => <div key={item.id} className={cn("space-y-3 hover:bg-bg rounded-md p-2 -m-2 transition-colors", index > 0 && "pt-4 border-t border-border")}>
                <div className="flex items-start gap-3">
                  {/* Dot indicator */}
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{item.source}</p>
                      {getStatusChip(item.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(item.datetime)}
                    </p>
                  </div>
                </div>

                {/* Expandable details */}
                <div className="ml-5">
                  <button onClick={() => toggleExpanded(item.id)} className="text-xs text-primary hover:underline">
                    {expandedItems.has(item.id) ? "Close" : "Open"}
                  </button>

                  {expandedItems.has(item.id) && <div className="mt-3 p-3 bg-muted rounded-md space-y-2">
                      <div>
                        <p className="text-xs font-medium text-foreground mb-1">Ordered Tests:</p>
                        <div className="space-y-1">
                          {item.details.tests.map((test, testIndex) => <p key={testIndex} className="text-xs text-muted-foreground">• {test}</p>)}
                        </div>
                      </div>
                      
                      {item.details.notes && <div>
                          <p className="text-xs font-medium text-foreground mb-1">Notes:</p>
                          <p className="text-xs text-muted-foreground">{item.details.notes}</p>
                        </div>}

                      <div className="flex gap-2 pt-2">
                        <Button variant="link" size="sm" className="text-xs h-auto p-0">
                          <FileText className="h-3 w-3 mr-1" />
                          Open PDF
                        </Button>
                        <Button variant="link" size="sm" className="text-xs h-auto p-0">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Open in new window
                        </Button>
                        <Button variant="link" size="sm" className="text-xs h-auto p-0">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy to clipboard
                        </Button>
                      </div>
                    </div>}
                </div>
              </div>)}
          </div>}
      </div>

      {/* Pagination */}
      {totalPages > 1 && <div className="border-t border-border p-4">
          <div className="flex items-center justify-center gap-2">
            {Array.from({
          length: totalPages
        }, (_, i) => i + 1).map(page => <button key={page} onClick={() => setCurrentPage(page)} className={cn("w-8 h-8 rounded-full text-xs font-medium transition-colors", currentPage === page ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                {page}
              </button>)}
          </div>
        </div>}
    </div>;
}