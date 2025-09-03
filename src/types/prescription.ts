export interface ParsedPrescription {
  id: string;
  medication: string;
  strength?: string;
  formulation?: string;
  dose?: string;
  route: string;
  frequency?: string;
  duration?: string; // Always in days as string
  quantity?: number;
  refills: number;
  substitutions: boolean;
  prn?: boolean;
  notes?: string;
  startDate?: string; // ISO format YYYY-MM-DD
  earliestFillDate?: string; // ISO format YYYY-MM-DD
  isTaper?: boolean;
}

export interface Alert {
  type: 'allergy' | 'interaction' | 'duplicate';
  message: string;
  prescriptionId: string;
}