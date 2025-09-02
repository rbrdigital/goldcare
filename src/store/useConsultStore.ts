import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Types
export type OutsideOrder = 
  | { id: string; type: "external"; text: string }
  | { id: string; type: "internal-specialty"; specialty: string }
  | { id: string; type: "internal-providers"; service: string; providers: Array<{ id: string; name: string; avatar?: string; availability?: string }> };

export type RxOrder = {
  id: string;
  name: string;
  sig: string;
  qty: string;
  refills: string;
  notes?: string;
  status?: "pending" | "ordered" | "filled";
};

export type LabOrder = {
  id: string;
  diagnoses: string[];
  otherDx: string;
  requests: Array<{ id: string; category: string; exams: string[] }>;
  status?: "pending" | "ordered" | "completed";
};

export type ImagingOrder = {
  id: string;
  diagnoses: string[];
  otherDx: string;
  requests: Array<{ id: string; category: string; exams: string[] }>;
  status?: "pending" | "ordered" | "completed";
};

export type ConsultState = {
  // Patient info
  patientId: string;
  encounterId: string;
  patientName: string;
  patientAge: number;
  patientSex: string;
  
  // Visit info
  visitDate: string;
  provider: string;
  reasonForVisit: string;
  
  // SOAP data
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  differential: string;
  
  // Current medications and health data
  currentMeds: string[];
  supplements: string[];
  otcs: string[];
  allergies: string[];
  
  // Vitals
  vitals: {
    height?: string;
    weight?: string;
    bmi?: string;
    waist?: string;
    hip?: string;
    bp?: string;
    hr?: string;
    temp?: string;
  };
  
  // Clinical observations
  observations: string;
  
  // Diagnoses
  diagnoses: string[];
  comorbidities: string[];
  
  // Orders
  rxOrders: RxOrder[];
  labOrders: LabOrder[];
  imagingOrders: ImagingOrder[];
  outsideOrders: OutsideOrder[];
  
  // Private notes
  privateNotes: string;
  
  // Follow-up
  followUp: {
    date?: string;
    instructions?: string;
    tasks?: string[];
  };
  
  // Consult state
  locked: boolean;
  
  // Actions
  setField: <K extends keyof ConsultState>(key: K, value: ConsultState[K]) => void;
  updateVitals: (vitals: Partial<ConsultState['vitals']>) => void;
  addMedication: (med: string) => void;
  removeMedication: (index: number) => void;
  addSupplement: (supp: string) => void;
  removeSupplement: (index: number) => void;
  addAllergy: (allergy: string) => void;
  removeAllergy: (index: number) => void;
  addDiagnosis: (diagnosis: string) => void;
  removeDiagnosis: (index: number) => void;
  addComorbidity: (comorbidity: string) => void;
  removeComorbidity: (index: number) => void;
  addRxOrder: (order: RxOrder) => void;
  updateRxOrder: (id: string, updates: Partial<RxOrder>) => void;
  removeRxOrder: (id: string) => void;
  addLabOrder: (order: LabOrder) => void;
  updateLabOrder: (id: string, updates: Partial<LabOrder>) => void;
  removeLabOrder: (id: string) => void;
  addImagingOrder: (order: ImagingOrder) => void;
  updateImagingOrder: (id: string, updates: Partial<ImagingOrder>) => void;
  removeImagingOrder: (id: string) => void;
  addOutsideOrder: (order: OutsideOrder) => void;
  updateOutsideOrder: (id: string, updates: Partial<OutsideOrder>) => void;
  removeOutsideOrder: (id: string) => void;
  setFollowUp: (followUp: Partial<ConsultState['followUp']>) => void;
  lockConsult: () => void;
  resetConsult: () => void;
};

const STORAGE_VERSION = 1;

// Key is dynamic so each encounter isolates data
export const makeConsultKey = (patientId: string, encounterId: string) =>
  `goldcare.consult.v${STORAGE_VERSION}.${patientId}.${encounterId}`;

const createInitialState = (patientId: string, encounterId: string): Omit<ConsultState, keyof ReturnType<typeof createActions>> => ({
  patientId,
  encounterId,
  patientName: "Jane Doe",
  patientAge: 58,
  patientSex: "F",
  visitDate: new Date().toLocaleDateString(),
  provider: "Dr. Smith",
  reasonForVisit: "",
  subjective: "",
  objective: "",
  assessment: "",
  plan: "",
  differential: "",
  currentMeds: [],
  supplements: [],
  otcs: [],
  allergies: [],
  vitals: {},
  observations: "",
  diagnoses: [],
  comorbidities: [],
  rxOrders: [],
  labOrders: [],
  imagingOrders: [],
  outsideOrders: [],
  privateNotes: "",
  followUp: {},
  locked: false,
});

const createActions = (set: any, get: any) => ({
  setField: <K extends keyof ConsultState>(key: K, value: ConsultState[K]) => {
    set({ [key]: value });
  },
  
  updateVitals: (vitals: Partial<ConsultState['vitals']>) => {
    set((state: ConsultState) => ({
      vitals: { ...state.vitals, ...vitals }
    }));
  },
  
  addMedication: (med: string) => {
    set((state: ConsultState) => ({
      currentMeds: [...state.currentMeds, med]
    }));
  },
  
  removeMedication: (index: number) => {
    set((state: ConsultState) => ({
      currentMeds: state.currentMeds.filter((_, i) => i !== index)
    }));
  },
  
  addSupplement: (supp: string) => {
    set((state: ConsultState) => ({
      supplements: [...state.supplements, supp]
    }));
  },
  
  removeSupplement: (index: number) => {
    set((state: ConsultState) => ({
      supplements: state.supplements.filter((_, i) => i !== index)
    }));
  },
  
  addAllergy: (allergy: string) => {
    set((state: ConsultState) => ({
      allergies: [...state.allergies, allergy]
    }));
  },
  
  removeAllergy: (index: number) => {
    set((state: ConsultState) => ({
      allergies: state.allergies.filter((_, i) => i !== index)
    }));
  },
  
  addDiagnosis: (diagnosis: string) => {
    set((state: ConsultState) => ({
      diagnoses: [...state.diagnoses, diagnosis]
    }));
  },
  
  removeDiagnosis: (index: number) => {
    set((state: ConsultState) => ({
      diagnoses: state.diagnoses.filter((_, i) => i !== index)
    }));
  },
  
  addComorbidity: (comorbidity: string) => {
    set((state: ConsultState) => ({
      comorbidities: [...state.comorbidities, comorbidity]
    }));
  },
  
  removeComorbidity: (index: number) => {
    set((state: ConsultState) => ({
      comorbidities: state.comorbidities.filter((_, i) => i !== index)
    }));
  },
  
  addRxOrder: (order: RxOrder) => {
    set((state: ConsultState) => ({
      rxOrders: [...state.rxOrders, order]
    }));
  },
  
  updateRxOrder: (id: string, updates: Partial<RxOrder>) => {
    set((state: ConsultState) => ({
      rxOrders: state.rxOrders.map(order => 
        order.id === id ? { ...order, ...updates } : order
      )
    }));
  },
  
  removeRxOrder: (id: string) => {
    set((state: ConsultState) => ({
      rxOrders: state.rxOrders.filter(order => order.id !== id)
    }));
  },
  
  addLabOrder: (order: LabOrder) => {
    set((state: ConsultState) => ({
      labOrders: [...state.labOrders, order]
    }));
  },
  
  updateLabOrder: (id: string, updates: Partial<LabOrder>) => {
    set((state: ConsultState) => ({
      labOrders: state.labOrders.map(order => 
        order.id === id ? { ...order, ...updates } : order
      )
    }));
  },
  
  removeLabOrder: (id: string) => {
    set((state: ConsultState) => ({
      labOrders: state.labOrders.filter(order => order.id !== id)
    }));
  },
  
  addImagingOrder: (order: ImagingOrder) => {
    set((state: ConsultState) => ({
      imagingOrders: [...state.imagingOrders, order]
    }));
  },
  
  updateImagingOrder: (id: string, updates: Partial<ImagingOrder>) => {
    set((state: ConsultState) => ({
      imagingOrders: state.imagingOrders.map(order => 
        order.id === id ? { ...order, ...updates } : order
      )
    }));
  },
  
  removeImagingOrder: (id: string) => {
    set((state: ConsultState) => ({
      imagingOrders: state.imagingOrders.filter(order => order.id !== id)
    }));
  },
  
  addOutsideOrder: (order: OutsideOrder) => {
    set((state: ConsultState) => ({
      outsideOrders: [...state.outsideOrders, order]
    }));
  },
  
  updateOutsideOrder: (id: string, updates: Partial<OutsideOrder>) => {
    set((state: ConsultState) => ({
      outsideOrders: state.outsideOrders.map(order => 
        order.id === id ? { ...order, ...updates } : order
      )
    }));
  },
  
  removeOutsideOrder: (id: string) => {
    set((state: ConsultState) => ({
      outsideOrders: state.outsideOrders.filter(order => order.id !== id)
    }));
  },
  
  setFollowUp: (followUp: Partial<ConsultState['followUp']>) => {
    set((state: ConsultState) => ({
      followUp: { ...state.followUp, ...followUp }
    }));
  },
  
  lockConsult: () => {
    set({ locked: true });
  },
  
  resetConsult: () => {
    const initial = createInitialState(get().patientId, get().encounterId);
    set(initial);
  },
});

export const createConsultStore = (patientId: string, encounterId: string) =>
  create<ConsultState>()(
    persist(
      (set, get) => ({
        ...createInitialState(patientId, encounterId),
        ...createActions(set, get),
      }),
      {
        name: makeConsultKey(patientId, encounterId),
        storage: createJSONStorage(() => {
          try { 
            return window.localStorage; 
          } catch { 
            return {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
              clear: () => {},
              key: () => null,
              length: 0
            } as unknown as Storage;
          }
        }),
        // Only persist meaningful fields
        partialize: (state) => ({
          patientName: state.patientName,
          patientAge: state.patientAge,
          patientSex: state.patientSex,
          visitDate: state.visitDate,
          provider: state.provider,
          reasonForVisit: state.reasonForVisit,
          subjective: state.subjective,
          objective: state.objective,
          assessment: state.assessment,
          plan: state.plan,
          differential: state.differential,
          currentMeds: state.currentMeds,
          supplements: state.supplements,
          otcs: state.otcs,
          allergies: state.allergies,
          vitals: state.vitals,
          observations: state.observations,
          diagnoses: state.diagnoses,
          comorbidities: state.comorbidities,
          rxOrders: state.rxOrders,
          labOrders: state.labOrders,
          imagingOrders: state.imagingOrders,
          outsideOrders: state.outsideOrders,
          privateNotes: state.privateNotes,
          followUp: state.followUp,
          locked: state.locked,
        }),
        version: STORAGE_VERSION,
        migrate: (persisted: any, version) => {
          // Add migrations here when version bumps
          return persisted;
        },
      }
    )
  );

export type ConsultStore = ReturnType<typeof createConsultStore>;

// Selector functions for reading from the store
export const selectSoap = (state: ConsultState) => ({
  subjective: state.subjective,
  objective: state.objective,
  assessment: state.assessment,
  plan: state.plan,
  differential: state.differential,
  currentMeds: state.currentMeds,
  supplements: state.supplements,
  otcs: state.otcs,
  allergies: state.allergies,
  vitals: state.vitals,
  observations: state.observations,
  diagnoses: state.diagnoses,
  comorbidities: state.comorbidities,
});

export const selectRx = (state: ConsultState) => state.rxOrders;
export const selectLabs = (state: ConsultState) => state.labOrders;
export const selectImaging = (state: ConsultState) => state.imagingOrders;
export const selectOutsideOrders = (state: ConsultState) => state.outsideOrders;
export const selectPrivateNotes = (state: ConsultState) => state.privateNotes;
export const selectFollowUp = (state: ConsultState) => state.followUp;
export const selectPatientInfo = (state: ConsultState) => ({
  name: state.patientName,
  age: state.patientAge,
  sex: state.patientSex,
});
export const selectVisitInfo = (state: ConsultState) => ({
  date: state.visitDate,
  provider: state.provider,
  reasonForVisit: state.reasonForVisit,
});