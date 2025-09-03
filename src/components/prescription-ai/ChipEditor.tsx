import React, { useState, useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ChipEditorProps {
  label: string;
  value: string;
  onSave: (value: string) => void;
  isReadOnly?: boolean;
  placeholder?: string;
  type?: 'text' | 'toggle';
}

export function ChipEditor({ 
  label, 
  value, 
  onSave, 
  isReadOnly = false, 
  placeholder,
  type = 'text' 
}: ChipEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleToggle = () => {
    if (type === 'toggle') {
      const newValue = value === 'Allowed' ? 'Not allowed' : 'Allowed';
      onSave(newValue);
    }
  };

  if (isEditing && !isReadOnly) {
    return (
      <div className="flex items-center gap-1 bg-surface border border-border rounded-full px-3 py-1">
        <span className="text-xs font-medium text-fg-muted">{label}:</span>
        <Input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="border-0 bg-transparent p-0 h-auto text-xs focus:ring-0 min-w-16"
        />
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 text-success hover:text-success"
          onClick={handleSave}
        >
          <Check className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 text-destructive hover:text-destructive"
          onClick={handleCancel}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <button
      onClick={type === 'toggle' && !isReadOnly ? handleToggle : () => !isReadOnly && setIsEditing(true)}
      disabled={isReadOnly}
      className={cn(
        "inline-flex items-center gap-1 bg-surface border border-border rounded-full px-3 py-1 text-xs transition-colors",
        !isReadOnly && "hover:bg-surface-muted cursor-pointer",
        isReadOnly && "opacity-60 cursor-not-allowed"
      )}
    >
      <span className="font-medium text-fg-muted">{label}:</span>
      <span className="text-fg">
        {value || <span className="text-fg-muted">{placeholder || 'Not set'}</span>}
      </span>
    </button>
  );
}