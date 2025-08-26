"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export default function PageContainer({
  className, 
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  // Single source of truth: horizontal padding only
  return (
    <div className={cn("mx-auto w-full max-w-5xl px-6", className)}>
      {children}
    </div>
  );
}