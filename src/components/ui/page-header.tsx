import * as React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onSave?: () => void;
  children?: React.ReactNode;
}

const PageHeader = ({ 
  title, 
  description, 
  icon: Icon, 
  onSave,
  children 
}: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-fg">
          {Icon && <Icon className="h-6 w-6 text-medical-blue" />}
          {title}
        </h1>
        {description && <p className="text-fg-muted">{description}</p>}
      </div>
      {(onSave || children) && (
        <div className="flex items-center gap-2">
          {children}
          {onSave && (
            <Button variant="ghost" size="sm" onClick={onSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export { PageHeader };