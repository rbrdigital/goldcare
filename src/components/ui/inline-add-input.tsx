import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface InlineAddInputProps {
  placeholder: string;
  onAdd: (value: string) => void;
  className?: string;
}

export function InlineAddInput({ placeholder, onAdd, className }: InlineAddInputProps) {
  const [value, setValue] = React.useState("");

  const handleAdd = () => {
    const trimmed = value.trim();
    if (trimmed) {
      onAdd(trimmed);
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className={cn("relative flex items-center", className)}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 h-10 pl-3 pr-12 rounded-md bg-surface text-fg placeholder:text-fg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
      />
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={handleAdd}
        disabled={!value.trim()}
        className="absolute right-1 h-8 w-8 p-0"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}