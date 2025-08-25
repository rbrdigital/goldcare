import * as React from "react";
import UnifiedClinicalScreen from "@/components/screens/UnifiedClinicalScreen";
import { MainContent } from "@/components/MainContent";

export default function Dashboard() {
  const useUnified =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("unified") === "1";

  return useUnified ? <UnifiedClinicalScreen /> : <MainContent activeSection="soap" />;
}