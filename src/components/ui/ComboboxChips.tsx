import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ComboboxChipsProps {
  id?: string;
  label?: string;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
}

export default function ComboboxChips({
  id,
  label,
  placeholder = "Search or add...",
  options,
  selected,
  onSelectionChange,
}: ComboboxChipsProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Filter options based on input
  const filteredOptions = React.useMemo(() => {
    if (!inputValue.trim()) return options;
    const searchTerm = inputValue.toLowerCase();
    return options.filter(opt => 
      opt.label.toLowerCase().includes(searchTerm) || 
      opt.value.toLowerCase().includes(searchTerm)
    );
  }, [options, inputValue]);

  // Handle clicking outside to close
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setInputValue("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addItem = (value: string) => {
    if (value.trim() && !selected.includes(value.trim())) {
      onSelectionChange([...selected, value.trim()]);
    }
    setInputValue("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const removeItem = (value: string) => {
    onSelectionChange(selected.filter(item => item !== value));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      
      // Check if there's an exact match in filtered options
      const exactMatch = filteredOptions.find(opt => 
        opt.label.toLowerCase() === inputValue.toLowerCase()
      );
      
      if (exactMatch) {
        addItem(exactMatch.value);
      } else {
        // Add as free text
        addItem(inputValue.trim());
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setInputValue("");
    }
  };

  const handleOptionClick = (value: string) => {
    addItem(value);
  };

  return (
    <div ref={containerRef} className="relative">
      {label && <Label htmlFor={id}>{label}</Label>}
      
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map((item) => (
            <Badge key={item} variant="outline" className="flex items-center gap-1">
              {item}
              <button
                type="button"
                onClick={() => removeItem(item)}
                className="ml-1 text-fg-muted hover:text-fg focus-visible:outline-none"
                aria-label={`Remove ${item}`}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}
      
      {/* Input */}
      <Input
        ref={inputRef}
        id={id}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-surface border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "w-full text-left px-3 py-2 text-sm hover:bg-surface-muted focus:bg-surface-muted focus-visible:outline-none",
                  selected.includes(option.value) && "bg-surface-muted"
                )}
                onClick={() => handleOptionClick(option.value)}
                disabled={selected.includes(option.value)}
              >
                {option.label}
              </button>
            ))
          ) : inputValue.trim() ? (
            <div className="px-3 py-2 text-sm text-fg-muted">
              Press Enter to add "{inputValue.trim()}" as custom text
            </div>
          ) : (
            <div className="px-3 py-2 text-sm text-fg-muted">
              No options found
            </div>
          )}
        </div>
      )}
    </div>
  );
}