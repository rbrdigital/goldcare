import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Types for consult data
export interface Vitals {
  heightFt: string;
  heightIn: string;
  weightLbs: string;
  waist: string;
  hip: string;
  bmi: string;
  bloodPressure: string;
  heartRate: string;
  temperature: string;
}

export interface SOAPData {
  chiefComplaint: string;
  observations: string;
  assessment: string;
  differential: string;
  plan: string;
  patientEducation: string;
  followUpValue: string;
  followUpUnit: string;
  currentMedications: string[];
  supplements: string[];
  allergies: string[];
  diagnoses: string[];
  comorbidities: string[];
  vitals: Vitals;
}

export interface Prescription {
  id: string;
  medicine: string;
  qtyPerDose: number | "";
  formulation: string;
  route: string;
  frequency: string;
  duration: number | "";
  totalQtyUnit: "Tablet" | "Capsule" | "mL";
  refills: number | "";
  action: string;
  prn: boolean;
  prnInstructions: string;
  subsAllowed: boolean;
  startDate: string;
  earliestFill: string;
  notesPatient: string;
  notesPharmacy: string;
  selectedPharmacy: any;
}

export interface LabOrder {
  id: string;
  diagnoses: string[];
  otherDx: string;
  requests: Array<{
    id: string;
    category: string;
    exams: string[];
  }>;
}

export interface ImagingOrder {
  id: string;
  diagnoses: string[];
  selectedOrders: Array<{
    orderId: string;
    orderName: string;
    modality: string;
    contrast: string;
    laterality: string;
  }>;
  otherOrders: string[];
  urgency: string;
  indication: string;
  clinicalNotes: string;
}

export interface OutsideOrder {
  id: string;
  type: "external" | "internal";
  external?: {
    content: string;
  };
  internal?: {
    type: "specialty" | "provider";
    specialty?: string;
    providers?: Array<{
      id: string;
      name: string;
      degree: string;
      availability: string;
      tokens: string;
      avatarUrl?: string;
    }>;
  };
}

export interface ConsultState {
  // Session info
  patientId: string;
  encounterId: string;
  consultDate: string;
  
  // Clinical data
  soapNote: SOAPData;
  prescriptions: Prescription[];
  labOrders: LabOrder[];
  imagingOrders: ImagingOrder[];
  outsideOrders: OutsideOrder[];
  privateNotes: string;
  
  // UI state
  isAIVisible: boolean;
  
  // Status
  finished: boolean;
  lastSaved: string;
}

export interface ConsultActions {
  // SOAP actions
  updateSOAPField: <K extends keyof SOAPData>(field: K, value: SOAPData[K]) => void;
  addMedication: (medication: string) => void;
  removeMedication: (index: number) => void;
  addSupplement: (supplement: string) => void;
  removeSupplement: (index: number) => void;
  addAllergy: (allergy: string) => void;
  removeAllergy: (index: number) => void;
  addDiagnosis: (diagnosis: string) => void;
  removeDiagnosis: (index: number) => void;
  addComorbidity: (comorbidity: string) => void;
  removeComorbidity: (index: number) => void;
  updateVitals: <K extends keyof Vitals>(field: K, value: Vitals[K]) => void;
  
  // RX actions
  addPrescription: (prescription: Prescription) => void;
  updatePrescription: (id: string, updates: Partial<Prescription>) => void;
  removePrescription: (id: string) => void;
  
  // Lab actions
  addLabOrder: (labOrder: LabOrder) => void;
  updateLabOrder: (id: string, updates: Partial<LabOrder>) => void;
  removeLabOrder: (id: string) => void;
  
  // Imaging actions
  addImagingOrder: (imagingOrder: ImagingOrder) => void;
  updateImagingOrder: (id: string, updates: Partial<ImagingOrder>) => void;
  removeImagingOrder: (id: string) => void;
  
  // Outside Orders actions
  addOutsideOrder: (outsideOrder: OutsideOrder) => void;
  updateOutsideOrder: (id: string, updates: Partial<OutsideOrder>) => void;
  removeOutsideOrder: (id: string) => void;
  
  // Private Notes actions
  updatePrivateNotes: (notes: string) => void;
  
  // AI visibility actions
  toggleAIVisibility: () => void;
  
  // Session actions
  initializeSession: (patientId: string, encounterId: string) => void;
  setFinished: (finished: boolean) => void;
  clearSession: () => void;
}

const initialState: ConsultState = {
  patientId: "",
  encounterId: "",
  consultDate: new Date().toISOString(),
  soapNote: {
    chiefComplaint: "",
    observations: "",
    assessment: "",
    differential: "",
    plan: "",
    patientEducation: "",
    followUpValue: "",
    followUpUnit: "",
    currentMedications: [],
    supplements: [],
    allergies: [],
    diagnoses: [],
    comorbidities: [],
    vitals: {
      heightFt: "",
      heightIn: "",
      weightLbs: "",
      waist: "",
      hip: "",
      bmi: "",
      bloodPressure: "",
      heartRate: "",
      temperature: ""
    }
  },
  prescriptions: [],
  labOrders: [],
  imagingOrders: [],
  outsideOrders: [],
  privateNotes: "",
  isAIVisible: true,
  finished: false,
  lastSaved: ""
};

// Debounced save function
let saveTimeout: NodeJS.Timeout;
const debouncedSave = (fn: () => void, delay = 500) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(fn, delay);
};

// Safe storage fallback
const createSafeStorage = () => {
  let memoryStorage: Record<string, string> = {};
  
  const storage = {
    getItem: (key: string): string | null => {
      try {
        return localStorage.getItem(key);
      } catch {
        return memoryStorage[key] || null;
      }
    },
    setItem: (key: string, value: string): void => {
      try {
        localStorage.setItem(key, value);
      } catch {
        memoryStorage[key] = value;
      }
    },
    removeItem: (key: string): void => {
      try {
        localStorage.removeItem(key);
      } catch {
        delete memoryStorage[key];
      }
    }
  };
  
  return storage;
};

export const useConsultStore = create<ConsultState & ConsultActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // SOAP actions
      updateSOAPField: (field, value) => {
        set((state) => ({
          soapNote: { ...state.soapNote, [field]: value },
          lastSaved: new Date().toISOString()
        }));
      },
      
      addMedication: (medication) => {
        set((state) => ({
          soapNote: {
            ...state.soapNote,
            currentMedications: [...state.soapNote.currentMedications, medication]
          },
          lastSaved: new Date().toISOString()
        }));
      },
      
      removeMedication: (index) => {
        set((state) => ({
          soapNote: {
            ...state.soapNote,
            currentMedications: state.soapNote.currentMedications.filter((_, i) => i !== index)
          },
          lastSaved: new Date().toISOString()
        }));
      },
      
      addSupplement: (supplement) => {
        set((state) => ({
          soapNote: {
            ...state.soapNote,
            supplements: [...state.soapNote.supplements, supplement]
          },
          lastSaved: new Date().toISOString()
        }));
      },
      
      removeSupplement: (index) => {
        set((state) => ({
          soapNote: {
            ...state.soapNote,
            supplements: state.soapNote.supplements.filter((_, i) => i !== index)
          },
          lastSaved: new Date().toISOString()
        }));
      },
      
      addAllergy: (allergy) => {
        set((state) => ({
          soapNote: {
            ...state.soapNote,
            allergies: [...state.soapNote.allergies, allergy]
          },
          lastSaved: new Date().toISOString()
        }));
      },
      
      removeAllergy: (index) => {
        set((state) => ({
          soapNote: {
            ...state.soapNote,
            allergies: state.soapNote.allergies.filter((_, i) => i !== index)
          },
          lastSaved: new Date().toISOString()
        }));
      },
      
      addDiagnosis: (diagnosis) => {
        set((state) => ({
          soapNote: {
            ...state.soapNote,
            diagnoses: [...state.soapNote.diagnoses, diagnosis]
          },
          lastSaved: new Date().toISOString()
        }));
      },
      
      removeDiagnosis: (index) => {
        set((state) => ({
          soapNote: {
            ...state.soapNote,
            diagnoses: state.soapNote.diagnoses.filter((_, i) => i !== index)
          },
          lastSaved: new Date().toISOString()
        }));
      },
      
      addComorbidity: (comorbidity) => {
        set((state) => ({
          soapNote: {
            ...state.soapNote,
            comorbidities: [...state.soapNote.comorbidities, comorbidity]
          },
          lastSaved: new Date().toISOString()
        }));
      },
      
      removeComorbidity: (index) => {
        set((state) => ({
          soapNote: {
            ...state.soapNote,
            comorbidities: state.soapNote.comorbidities.filter((_, i) => i !== index)
          },
          lastSaved: new Date().toISOString()
        }));
      },
      
      updateVitals: (field, value) => {
        set((state) => {
          const newVitals = { ...state.soapNote.vitals, [field]: value };
          
          // Auto-calculate BMI if height or weight changes
          if (field === 'heightFt' || field === 'heightIn' || field === 'weightLbs') {
            const heightMeters = (Number(newVitals.heightFt || 0) * 12 + Number(newVitals.heightIn || 0)) * 0.0254;
            const weightKg = Number(newVitals.weightLbs || 0) * 0.453592;
            newVitals.bmi = heightMeters > 0 ? (weightKg / (heightMeters * heightMeters)).toFixed(1) : "";
          }
          
          return {
            soapNote: { ...state.soapNote, vitals: newVitals },
            lastSaved: new Date().toISOString()
          };
        });
      },
      
      // RX actions
      addPrescription: (prescription) => {
        set((state) => ({
          prescriptions: [...state.prescriptions, prescription],
          lastSaved: new Date().toISOString()
        }));
        debouncedSave(() => {
          // Debounced save will persist automatically via Zustand persist
          console.log('Prescription saved');
        });
      },
      
      updatePrescription: (id, updates) => {
        set((state) => ({
          prescriptions: state.prescriptions.map(rx => 
            rx.id === id ? { ...rx, ...updates } : rx
          ),
          lastSaved: new Date().toISOString()
        }));
        debouncedSave(() => {
          // Debounced save will persist automatically via Zustand persist
          console.log('Prescription updated');
        });
      },
      
      removePrescription: (id) => {
        set((state) => ({
          prescriptions: state.prescriptions.filter(rx => rx.id !== id),
          lastSaved: new Date().toISOString()
        }));
        debouncedSave(() => {
          // Debounced save will persist automatically via Zustand persist
          console.log('Prescription removed');
        });
      },
      
      // Lab actions
      addLabOrder: (labOrder) => {
        set((state) => ({
          labOrders: [...state.labOrders, labOrder],
          lastSaved: new Date().toISOString()
        }));
        debouncedSave(() => {
          // Debounced save will persist automatically via Zustand persist
          console.log('Lab order saved');
        });
      },
      
      updateLabOrder: (id, updates) => {
        set((state) => ({
          labOrders: state.labOrders.map(lab => 
            lab.id === id ? { ...lab, ...updates } : lab
          ),
          lastSaved: new Date().toISOString()
        }));
        debouncedSave(() => {
          // Debounced save will persist automatically via Zustand persist
          console.log('Lab order updated');
        });
      },
      
      removeLabOrder: (id) => {
        set((state) => ({
          labOrders: state.labOrders.filter(lab => lab.id !== id),
          lastSaved: new Date().toISOString()
        }));
        debouncedSave(() => {
          // Debounced save will persist automatically via Zustand persist
          console.log('Lab order removed');
        });
      },
      
      // Imaging actions
      addImagingOrder: (imagingOrder) => {
        set((state) => ({
          imagingOrders: [...state.imagingOrders, imagingOrder],
          lastSaved: new Date().toISOString()
        }));
        debouncedSave(() => {
          // Debounced save will persist automatically via Zustand persist
          console.log('Imaging order saved');
        });
      },
      
      updateImagingOrder: (id, updates) => {
        set((state) => ({
          imagingOrders: state.imagingOrders.map(imaging => 
            imaging.id === id ? { ...imaging, ...updates } : imaging
          ),
          lastSaved: new Date().toISOString()
        }));
        debouncedSave(() => {
          // Debounced save will persist automatically via Zustand persist
          console.log('Imaging order updated');
        });
      },
      
      removeImagingOrder: (id) => {
        set((state) => ({
          imagingOrders: state.imagingOrders.filter(imaging => imaging.id !== id),
          lastSaved: new Date().toISOString()
        }));
        debouncedSave(() => {
          // Debounced save will persist automatically via Zustand persist
          console.log('Imaging order removed');
        });
      },
      
      // Outside Orders actions
      addOutsideOrder: (outsideOrder) => {
        set((state) => ({
          outsideOrders: [...state.outsideOrders, outsideOrder],
          lastSaved: new Date().toISOString()
        }));
      },
      
      updateOutsideOrder: (id, updates) => {
        set((state) => ({
          outsideOrders: state.outsideOrders.map(order => 
            order.id === id ? { ...order, ...updates } : order
          ),
          lastSaved: new Date().toISOString()
        }));
      },
      
      removeOutsideOrder: (id) => {
        set((state) => ({
          outsideOrders: state.outsideOrders.filter(order => order.id !== id),
          lastSaved: new Date().toISOString()
        }));
      },
      
      // Private Notes actions
      updatePrivateNotes: (notes) => {
        set(() => ({
          privateNotes: notes,
          lastSaved: new Date().toISOString()
        }));
      },

      // AI visibility actions
      toggleAIVisibility: () => {
        set((state) => ({
          isAIVisible: !state.isAIVisible,
          lastSaved: new Date().toISOString()
        }));
      },

      // Session actions
      initializeSession: (patientId, encounterId) => {
        set((state) => ({
          ...state,
          patientId,
          encounterId,
          consultDate: new Date().toISOString()
        }));
      },
      
      setFinished: (finished) => {
        set(() => ({
          finished,
          lastSaved: new Date().toISOString()
        }));
      },
      
      clearSession: () => {
        set(() => ({
          ...initialState,
          consultDate: new Date().toISOString()
        }));
      }
    }),
    {
      name: 'consult-session',
      storage: createJSONStorage(() => createSafeStorage()),
      partialize: (state) => ({
        patientId: state.patientId,
        encounterId: state.encounterId,
        consultDate: state.consultDate,
        soapNote: state.soapNote,
        prescriptions: state.prescriptions,
        labOrders: state.labOrders,
        imagingOrders: state.imagingOrders,
        outsideOrders: state.outsideOrders,
        privateNotes: state.privateNotes,
        isAIVisible: state.isAIVisible,
        finished: state.finished,
        lastSaved: state.lastSaved
      })
    }
  )
);

// Helper functions to check meaningful content
const isMeaningfulLab = (lab: LabOrder): boolean => {
  return !!(
    lab.diagnoses?.length > 0 ||
    lab.otherDx?.trim() ||
    lab.requests?.some(r => r.exams?.length > 0)
  );
};

const isMeaningfulRx = (rx: Prescription): boolean => {
  const name = rx?.medicine?.trim();
  const qtyPerDose = Number(rx?.qtyPerDose) || 0;
  const formulation = rx?.formulation?.trim();
  const route = rx?.route?.trim();
  const frequency = rx?.frequency?.trim();
  const duration = Number(rx?.duration) || 0;
  
  // Require at least a drug name AND some meaningful dosing information
  const hasName = !!name;
  const hasMeaningfulDosing = !!(
    qtyPerDose > 0 ||
    formulation ||
    route ||
    frequency ||
    duration > 0
  );
  
  return hasName && hasMeaningfulDosing;
};

const isMeaningfulImaging = (imaging: ImagingOrder): boolean => {
  return !!(
    imaging.diagnoses?.length > 0 ||
    imaging.clinicalNotes?.trim() ||
    imaging.indication?.trim() ||
    imaging.selectedOrders?.length > 0 ||
    imaging.otherOrders?.length > 0
  );
};

// Selectors for easy data access
export const useConsultSelectors = () => {
  const store = useConsultStore();
  
  // Helper to check if SOAP has meaningful content
  const hasSoapContent = () => {
    const soap = store.soapNote;
    return !!(
      soap.chiefComplaint?.trim() ||
      soap.observations?.trim() ||
      soap.assessment?.trim() ||
      soap.differential?.trim() ||
      soap.plan?.trim() ||
      soap.currentMedications?.length > 0 ||
      soap.supplements?.length > 0 ||
      soap.allergies?.length > 0 ||
      soap.diagnoses?.length > 0 ||
      soap.comorbidities?.length > 0 ||
      Object.values(soap.vitals || {}).some(v => v?.trim())
    );
  };
  
  return {
    // Patient info
    patientInfo: {
      patientId: store.patientId,
      encounterId: store.encounterId,
      consultDate: store.consultDate
    },
    
    // SOAP data
    soapNote: store.soapNote,
    
    // Clinical orders
    prescriptions: store.prescriptions,
    labOrders: store.labOrders,
    imagingOrders: store.imagingOrders,
    outsideOrders: store.outsideOrders,
    
    // Notes and status
    privateNotes: store.privateNotes,
    finished: store.finished,
    lastSaved: store.lastSaved,
    
    // Content detection selectors (improved)
    hasSoapContent: hasSoapContent(),
    hasRxContent: store.prescriptions.some(isMeaningfulRx),
    hasLabContent: store.labOrders.some(isMeaningfulLab),
    hasImagingContent: store.imagingOrders.some(isMeaningfulImaging),
    hasOutsideOrdersContent: store.outsideOrders.length > 0,
    hasPrivateNotesContent: !!store.privateNotes?.trim(),
    
    // Overall data check
    hasData: hasSoapContent() || 
             store.prescriptions.some(isMeaningfulRx) || 
             store.labOrders.some(isMeaningfulLab) || 
             store.imagingOrders.some(isMeaningfulImaging) || 
             store.outsideOrders.length > 0 || 
             !!store.privateNotes?.trim()
  };
};