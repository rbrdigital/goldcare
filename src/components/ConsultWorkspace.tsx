import React from "react";
import { createContext, useMemo } from "react";
import { createConsultStore, ConsultStore } from "@/store/useConsultStore";
import { useStore } from "zustand";

export const ConsultContext = createContext<ConsultStore | null>(null);

interface ConsultWorkspaceProps {
  patientId: string;
  encounterId: string;
  children: React.ReactNode;
}

export function ConsultWorkspace({ patientId, encounterId, children }: ConsultWorkspaceProps) {
  console.log('🔧 ConsultWorkspace rendering for:', { patientId, encounterId });
  
  const store = useMemo(() => {
    console.log('🔧 Creating new store in ConsultWorkspace');
    return createConsultStore(patientId, encounterId);
  }, [patientId, encounterId]);

  return (
    <ConsultContext.Provider value={store}>
      {children}
    </ConsultContext.Provider>
  );
}

// Helper hook
export const useConsult = <T,>(selector: (state: any) => T): T => {
  const store = React.useContext(ConsultContext);
  if (!store) {
    throw new Error("useConsult must be used within a ConsultWorkspace");
  }
  return useStore(store, selector);
};