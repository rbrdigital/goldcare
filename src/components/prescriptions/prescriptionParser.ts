export interface ParsedPrescription {
  id: string;
  medication: string;
  strength: string;
  formulation: string;
  route: string;
  frequency: string;
  duration: string;
  quantity: number;
  refills: number;
  substitutions: boolean;
  notes: string;
  notesPharmacy: string;
  startDate: string;
  earlyFill: string;
  prn?: string[];
  isTaper?: boolean;
  taperSteps?: Array<{ strength: string; duration: string }>;
  location?: string;
}

// Mock patient data for interactions
export const MOCK_PATIENT = {
  allergies: ['penicillin'],
  currentMeds: ['warfarin 5 mg daily'],
  preferredPharmacy: { id: '1', name: 'Walgreens', distance: '1.2 mi', address: '123 Main St', phone: '(555) 123-4567' }
};

// Drug interaction rules
const INTERACTIONS: Record<string, { allergyTrigger?: string; interactsWith?: string; message: string }> = {
  'amoxicillin': { allergyTrigger: 'penicillin', message: '⚠ Patient allergic to penicillin — consider alternative.' },
  'augmentin': { allergyTrigger: 'penicillin', message: '⚠ Patient allergic to penicillin — consider alternative.' },
  'tmp-smx': { interactsWith: 'warfarin', message: '⚠ May interact with warfarin — monitor INR.' },
  'bactrim': { interactsWith: 'warfarin', message: '⚠ May interact with warfarin — monitor INR.' }
};

// Guidance suggestions
const GUIDANCE = {
  'amoxicillin': {
    patient: 'Take with food to reduce stomach upset.',
    pharmacy: 'Please counsel on diarrhea risk.'
  },
  'azithromycin': {
    patient: 'Take on empty stomach for best absorption.',
    pharmacy: 'Counsel on QT prolongation risk.'
  },
  'ibuprofen': {
    patient: 'Take with food to prevent stomach irritation.',
    pharmacy: 'Counsel on GI bleeding risk with long-term use.'
  },
  'prednisone': {
    patient: 'Take with food. Do not stop abruptly.',
    pharmacy: 'Counsel on taper schedule and side effects.'
  }
};

// Simple prescription parser for mock purposes
export function parsePrescription(input: string): ParsedPrescription[] {
  const lines = input.split('\n').filter(line => line.trim());
  
  return lines.map((line, index) => {
    const parsed: ParsedPrescription = {
      id: `rx-${Date.now()}-${index}`,
      medication: '',
      strength: '',
      formulation: 'tablet',
      route: 'PO',
      frequency: '',
      duration: '',
      quantity: 0,
      refills: 0,
      substitutions: true,
      notes: '',
      notesPharmacy: '',
      startDate: new Date().toISOString().split('T')[0],
      earlyFill: new Date().toISOString().split('T')[0]
    };

    // Handle taper patterns (e.g., "prednisone taper 40mg 5d, 20mg 5d, 10mg 5d")
    if (line.toLowerCase().includes('taper')) {
      parsed.isTaper = true;
      const taperMatch = line.match(/(\w+)\s+taper\s+(.*)/i);
      if (taperMatch) {
        parsed.medication = taperMatch[1];
        const steps = taperMatch[2].split(',').map(step => {
          const stepMatch = step.trim().match(/(\d+\w+)\s+(\d+d?)/);
          if (stepMatch) {
            return { strength: stepMatch[1], duration: stepMatch[2] };
          }
          return null;
        }).filter(Boolean);
        parsed.taperSteps = steps as Array<{ strength: string; duration: string }>;
        if (steps.length > 0) {
          parsed.strength = steps[0]?.strength || '';
          parsed.duration = steps.map(s => s?.duration).join(' then ');
        }
      }
    } else {
      // Extract medication name (first meaningful word)
      const words = line.toLowerCase().split(/\s+/);
      const medMatch = line.match(/^(\w+(?:-\w+)*)/);
      if (medMatch) {
        parsed.medication = medMatch[1];
      }

      // Extract strength (numbers followed by mg, etc.)
      const strengthMatch = line.match(/(\d+(?:\/\d+)?)\s*(mg|g|mcg|units?)/i);
      if (strengthMatch) {
        parsed.strength = `${strengthMatch[1]} ${strengthMatch[2]}`;
      }

      // Extract frequency
      const freqMatch = line.match(/\b(QD|BID|TID|QID|once\s+daily|twice\s+daily|three\s+times\s+daily)\b/i);
      if (freqMatch) {
        const freq = freqMatch[1].toUpperCase();
        parsed.frequency = freq.includes('DAILY') ? freq : freq;
      }

      // Extract duration
      const durMatch = line.match(/\b(?:x|for)\s*(\d+)\s*(d|days?|weeks?|months?)\b/i);
      if (durMatch) {
        parsed.duration = `${durMatch[1]} ${durMatch[2]}`;
      } else if (line.toLowerCase().includes('long-term')) {
        parsed.duration = 'long-term';
      }

      // Calculate quantity (simple heuristic)
      if (parsed.frequency && parsed.duration && !parsed.duration.includes('long-term')) {
        const freqPerDay = parsed.frequency === 'QD' || parsed.frequency.includes('once') ? 1 : 
                         parsed.frequency === 'BID' || parsed.frequency.includes('twice') ? 2 :
                         parsed.frequency === 'TID' || parsed.frequency.includes('three') ? 3 :
                         parsed.frequency === 'QID' ? 4 : 1;
        
        const daysMatch = parsed.duration.match(/(\d+)/);
        const days = daysMatch ? parseInt(daysMatch[1]) : 7;
        parsed.quantity = freqPerDay * days;
      } else if (parsed.duration.includes('long-term')) {
        parsed.quantity = 90; // 90-day supply for maintenance
        parsed.refills = 5;
      }
    }

    return parsed;
  });
}

// Check for drug interactions and allergies
export function checkInteractions(prescriptions: ParsedPrescription[]): Array<{
  type: 'allergy' | 'interaction' | 'duplicate';
  message: string;
  prescriptionId: string;
}> {
  const alerts: Array<{
    type: 'allergy' | 'interaction' | 'duplicate';
    message: string;
    prescriptionId: string;
  }> = [];

  // Check allergies
  prescriptions.forEach(rx => {
    const interaction = INTERACTIONS[rx.medication.toLowerCase() as keyof typeof INTERACTIONS];
    if (interaction?.allergyTrigger && MOCK_PATIENT.allergies.includes(interaction.allergyTrigger)) {
      alerts.push({
        type: 'allergy',
        message: interaction.message,
        prescriptionId: rx.id
      });
    }
  });

  // Check drug interactions
  prescriptions.forEach(rx => {
    const interaction = INTERACTIONS[rx.medication.toLowerCase() as keyof typeof INTERACTIONS];
    if (interaction?.interactsWith) {
      const hasInteraction = MOCK_PATIENT.currentMeds.some(med => 
        med.toLowerCase().includes(interaction.interactsWith || '')
      );
      if (hasInteraction) {
        alerts.push({
          type: 'interaction',
          message: interaction.message,
          prescriptionId: rx.id
        });
      }
    }
  });

  // Check duplicates
  const medCounts = new Map<string, string[]>();
  prescriptions.forEach(rx => {
    const med = rx.medication.toLowerCase();
    if (!medCounts.has(med)) {
      medCounts.set(med, []);
    }
    medCounts.get(med)?.push(rx.id);
  });

  medCounts.forEach((ids, med) => {
    if (ids.length > 1) {
      ids.forEach(id => {
        alerts.push({
          type: 'duplicate',
          message: 'Duplicate therapy detected.',
          prescriptionId: id
        });
      });
    }
  });

  return alerts;
}

// Get guidance suggestions for a medication
export function getGuidance(medication: string): { patient?: string; pharmacy?: string } {
  return GUIDANCE[medication.toLowerCase() as keyof typeof GUIDANCE] || {};
}