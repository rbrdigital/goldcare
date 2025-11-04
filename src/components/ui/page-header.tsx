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
    <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-10 h-10 bg-black rounded-md flex items-center justify-center flex-shrink-0">
            <Icon className="h-5 w-5 text-white" />
          </div>
        )}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          {description && <p className="text-sm text-gray-600 mt-0.5">{description}</p>}
        </div>
      </div>
      {(onSave || children) && (
        <div className="flex items-center gap-2">
          {children}
          {onSave && (
            <span className="text-sm text-gray-600">Auto-saved</span>
          )}
        </div>
      )}
    </div>
  );
};

export { PageHeader };