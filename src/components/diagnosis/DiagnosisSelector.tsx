import { useState, useMemo, useRef, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { icd10Diagnoses, getCategories, type ICD10Diagnosis } from "@/data/icd10Data";

interface DiagnosisSelectorProps {
  onSelect: (diagnosis: ICD10Diagnosis) => void;
  label?: string;
  showAdvancedSearch?: boolean;
  placeholder?: string;
}

export function DiagnosisSelector({
  onSelect,
  label = "Search diagnosis",
  showAdvancedSearch = true,
  placeholder = "Type to search ICD-10 codes or diagnoses..."
}: DiagnosisSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Advanced search filters
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [autoResolveFilter, setAutoResolveFilter] = useState<string>("all");
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter results for dropdown (top 5)
  const dropdownResults = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    
    const query = debouncedQuery.toLowerCase();
    return icd10Diagnoses
      .filter(d => 
        d.diagnosis.toLowerCase().includes(query) || 
        d.code.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [debouncedQuery]);

  // Filter results for modal (all with filters)
  const modalResults = useMemo(() => {
    let results = icd10Diagnoses;
    
    // Apply search filter
    if (modalSearchQuery.trim()) {
      const query = modalSearchQuery.toLowerCase();
      results = results.filter(d => 
        d.diagnosis.toLowerCase().includes(query) || 
        d.code.toLowerCase().includes(query) ||
        d.category.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (categoryFilter !== "all") {
      results = results.filter(d => d.category === categoryFilter);
    }
    
    // Apply auto-resolve filter
    if (autoResolveFilter === "true") {
      results = results.filter(d => d.autoResolve);
    } else if (autoResolveFilter === "false") {
      results = results.filter(d => !d.autoResolve);
    }
    
    return results;
  }, [modalSearchQuery, categoryFilter, autoResolveFilter]);

  // Handle selection
  const handleSelect = (diagnosis: ICD10Diagnosis) => {
    onSelect(diagnosis);
    setSearchQuery("");
    setIsDropdownOpen(false);
    setIsModalOpen(false);
    setSelectedIndex(0);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen || dropdownResults.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < dropdownResults.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (dropdownResults[selectedIndex]) {
          handleSelect(dropdownResults[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsDropdownOpen(false);
        break;
    }
  };

  // Show/hide dropdown
  useEffect(() => {
    setIsDropdownOpen(dropdownResults.length > 0);
    setSelectedIndex(0);
  }, [dropdownResults.length]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (dropdownResults.length > 0) setIsDropdownOpen(true);
            }}
            className="pl-9 pr-4"
          />
        </div>

        {/* Dropdown results */}
        {isDropdownOpen && dropdownResults.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-surface border border-border rounded-md shadow-lg"
          >
            <div className="py-1">
              {dropdownResults.map((diagnosis, index) => (
                <button
                  key={diagnosis.code}
                  onClick={() => handleSelect(diagnosis)}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors",
                    index === selectedIndex && "bg-muted"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-fg">{diagnosis.diagnosis}</div>
                      <div className="text-xs text-fg-muted mt-0.5">
                        {diagnosis.code} • {diagnosis.category}
                      </div>
                    </div>
                    {diagnosis.autoResolve && (
                      <Badge variant="outline" className="text-xs shrink-0">
                        Auto-resolve
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Advanced Search Link */}
      {showAdvancedSearch && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              <Filter className="h-3 w-3 mr-1.5" />
              Advanced Search
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Advanced ICD-10 Search</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 flex-shrink-0">
              {/* Modal Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
                <Input
                  type="text"
                  placeholder="Search all diagnoses..."
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {getCategories().map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Auto-Resolve</Label>
                  <Select value={autoResolveFilter} onValueChange={setAutoResolveFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Auto-resolve only</SelectItem>
                      <SelectItem value="false">No auto-resolve</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="text-xs text-fg-muted">
                Showing {modalResults.length} result{modalResults.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Results List */}
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-1 pr-4">
                {modalResults.length === 0 ? (
                  <div className="py-12 text-center text-fg-muted">
                    No results found
                  </div>
                ) : (
                  modalResults.map((diagnosis) => (
                    <button
                      key={diagnosis.code}
                      onClick={() => handleSelect(diagnosis)}
                      className="w-full px-4 py-3 text-left hover:bg-muted/50 rounded-md transition-colors border border-transparent hover:border-border"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-fg mb-1">
                            {diagnosis.diagnosis}
                          </div>
                          <div className="text-xs text-fg-muted space-y-0.5">
                            <div>Code: {diagnosis.code}</div>
                            <div>Category: {diagnosis.category}</div>
                            {diagnosis.notes && (
                              <div className="text-medical-amber">Note: {diagnosis.notes}</div>
                            )}
                          </div>
                        </div>
                        {diagnosis.autoResolve && (
                          <Badge variant="outline" className="shrink-0">
                            Auto-resolve
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
