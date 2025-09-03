"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { IMAGING_CATEGORIES } from "@/data/imagingOrders";

interface ImagingCategorySidebarProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string) => void;
}

export default function ImagingCategorySidebar({
  selectedCategory,
  onCategorySelect,
}: ImagingCategorySidebarProps) {
  return (
    <div className="w-64 bg-surface border-r border-border">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        <nav className="space-y-1">
          {IMAGING_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => onCategorySelect(category)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors",
                selectedCategory === category
                  ? "bg-primary text-on-primary"
                  : "text-fg hover:bg-surface-muted focus-visible:bg-surface-muted"
              )}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}