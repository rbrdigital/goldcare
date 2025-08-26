import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface OrderSetModalProps {
  title: string;
  options: string[];
  selected: string[];
  onClose: () => void;
  onConfirm: (selected: string[]) => void;
}

export default function OrderSetModal({
  title,
  options,
  selected,
  onClose,
  onConfirm,
}: OrderSetModalProps) {
  const [checkedItems, setCheckedItems] = React.useState<string[]>(selected);

  const handleToggle = (item: string) => {
    setCheckedItems((prev) => 
      prev.includes(item) 
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const handleConfirm = () => {
    onConfirm(checkedItems);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title} Lab Set</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          {options.map((item) => {
            const isChecked = checkedItems.includes(item);
            const itemId = `item-${item.replace(/\s+/g, '-')}`;
            
            return (
              <div key={item} className="flex items-start space-x-3">
                <Checkbox
                  id={itemId}
                  checked={isChecked}
                  onCheckedChange={() => handleToggle(item)}
                />
                <Label 
                  htmlFor={itemId}
                  className="text-sm leading-5 cursor-pointer flex-1"
                >
                  {item}
                </Label>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            className="bg-black text-white hover:opacity-90"
          >
            Confirm ({checkedItems.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}