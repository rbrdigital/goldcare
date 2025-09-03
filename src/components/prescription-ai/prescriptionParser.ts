export interface ParsedPrescription {
  id: string;
  medication: string;
  strength?: string;
  formulation?: string;
  dose?: string;
  route: string;
  frequency?: string;
  duration?: string;
  quantity?: number;
  refills: number;
  substitutions: boolean;
  prn?: boolean;
  notes?: string;
  startDate?: string;
  earliestFillDate?: string;
  location?: string;
  isTaper?: boolean;
}

export interface Alert {
  type: 'allergy' | 'interaction' | 'duplicate';
  message: string;
  prescriptionId: string;
}

export const MOCK_DATA = {
  patient: {
    allergies: ['penicillin', 'sulfa'],
    currentMedications: [
      { medication: 'warfarin', strength: '5mg', frequency: 'QD' },
      { medication: 'metformin', strength: '500mg', frequency: 'BID' }
    ]
  },
  preferredPharmacy: {
    id: '1',
    name: 'Walgreens',
    distance: '1.2 mi',
    address: '123 Main St, Springfield, IL 62701',
    phone: '(555) 123-4567'
  }
};

const INTERACTIONS: Record<string, { 
  allergies?: string[]; 
  interactions?: string[]; 
  message: string; 
}> = {
  'amoxicillin': {
    allergies: ['penicillin'],
    message: 'Patient has penicillin allergy - contraindicated'
  },
  'ampicillin': {
    allergies: ['penicillin'],
    message: 'Patient has penicillin allergy - contraindicated'
  },
  'trimethoprim-sulfamethoxazole': {
    allergies: ['sulfa'],
    interactions: ['warfarin'],
    message: 'Interaction with warfarin - monitor INR closely'
  },
  'tmp-smx': {
    allergies: ['sulfa'],
    interactions: ['warfarin'],
    message: 'Interaction with warfarin - monitor INR closely'
  },
  'metformin': {
    message: 'Patient already taking metformin - duplicate therapy'
  }
};

const GUIDANCE: Record<string, { patient?: string; pharmacy?: string }> = {
  'amoxicillin': {
    patient: 'Take with food to reduce stomach upset. Complete full course even if feeling better.',
    pharmacy: 'Dispense with food/meal instructions. Verify penicillin allergy status.'
  },
  'ibuprofen': {
    patient: 'Take with food. Do not exceed 2400mg daily. Stop if stomach pain occurs.',
    pharmacy: 'Counsel on GI protection and maximum daily dose.'
  },
  'prednisone': {
    patient: 'Take with food. Do not stop abruptly. May cause mood changes or difficulty sleeping.',
    pharmacy: 'Counsel on tapering schedule and steroid precautions.'
  },
  'metformin': {
    patient: 'Take with meals to reduce stomach upset. Monitor blood sugar regularly.',
    pharmacy: 'Counsel on GI side effects and lactic acidosis warning signs.'
  }
};

export function parsePrescriptions(input: string): ParsedPrescription[] {
  const lines = input.split('\n').filter(line => line.trim());
  const prescriptions: ParsedPrescription[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const today = new Date().toISOString().split('T')[0];
    const rx: ParsedPrescription = {
      id: `rx-${Date.now()}-${index}`,
      medication: '',
      route: 'PO',
      refills: 0,
      substitutions: true,
      startDate: today,
      earliestFillDate: today
    };

    // Check for taper pattern
    if (trimmed.toLowerCase().includes('taper') || /\d+mg\s+\d+d/i.test(trimmed)) {
      rx.isTaper = true;
      const medication = trimmed.split(/\s+/)[0];
      rx.medication = medication;
      rx.duration = 'See taper schedule';
      rx.frequency = 'As directed';
      rx.notes = trimmed;
    } else {
      // Parse regular prescription
      const parts = trimmed.split(/\s+/);
      
      // Extract medication (first word)
      rx.medication = parts[0] || '';

      // Extract strength (number + unit pattern)
      const strengthMatch = trimmed.match(/(\d+\.?\d*)\s?(mg|mcg|g|ml|units?)/i);
      if (strengthMatch) {
        rx.strength = strengthMatch[0];
      }

      // Extract frequency
      const frequencies = ['QD', 'BID', 'TID', 'QID', 'Q4H', 'Q6H', 'Q8H', 'Q12H', 'QPM', 'QAM'];
      const frequency = frequencies.find(f => trimmed.toUpperCase().includes(f));
      if (frequency) {
        rx.frequency = frequency;
      }

      // Extract duration and convert to days
      const durationMatch = trimmed.match(/x\s?(\d+)\s?(d|day|days|w|week|weeks|month|months)/i);
      if (durationMatch) {
        const value = parseInt(durationMatch[1]);
        const unit = durationMatch[2].toLowerCase();
        
        if (unit.startsWith('w')) {
          // Convert weeks to days
          rx.duration = (value * 7).toString();
        } else if (unit.startsWith('d')) {
          rx.duration = value.toString();
        } else if (unit.startsWith('m')) {
          // Convert months to days (rough estimate)
          rx.duration = (value * 30).toString();
        }
      } else if (trimmed.toLowerCase().includes('long-term')) {
        rx.duration = undefined; // Long-term has no specific duration
      }

      // Calculate quantity heuristic
      if (rx.frequency && rx.duration && !rx.isTaper) {
        const freqMultiplier = {
          'QD': 1, 'BID': 2, 'TID': 3, 'QID': 4,
          'Q4H': 6, 'Q6H': 4, 'Q8H': 3, 'Q12H': 2,
          'QPM': 1, 'QAM': 1
        };
        
        const durationMatch = rx.duration.match(/(\d+)/);
        if (durationMatch && freqMultiplier[rx.frequency]) {
          const days = parseInt(durationMatch[1]);
          rx.quantity = days * freqMultiplier[rx.frequency];
        }
      }
    }

    prescriptions.push(rx);
  });

  return prescriptions;
}

export function checkInteractions(prescriptions: ParsedPrescription[]): Alert[] {
  const alerts: Alert[] = [];
  const seenMedications = new Set<string>();

  prescriptions.forEach(rx => {
    const medLower = rx.medication.toLowerCase();
    
    // Check for allergies and interactions
    const interaction = INTERACTIONS[medLower];
    if (interaction) {
      // Check allergies
      if (interaction.allergies?.some(allergy => 
        MOCK_DATA.patient.allergies.includes(allergy)
      )) {
        alerts.push({
          type: 'allergy',
          message: interaction.message,
          prescriptionId: rx.id
        });
      }

      // Check drug interactions
      if (interaction.interactions?.some(drug =>
        MOCK_DATA.patient.currentMedications.some(med => 
          med.medication.toLowerCase().includes(drug)
        )
      )) {
        alerts.push({
          type: 'interaction',
          message: interaction.message,
          prescriptionId: rx.id
        });
      }
    }

    // Check for duplicates
    if (seenMedications.has(medLower)) {
      alerts.push({
        type: 'duplicate',
        message: `Duplicate ${rx.medication} prescription`,
        prescriptionId: rx.id
      });
    } else {
      seenMedications.add(medLower);
    }

    // Check against current medications
    const isDuplicate = MOCK_DATA.patient.currentMedications.some(med =>
      med.medication.toLowerCase() === medLower
    );
    if (isDuplicate) {
      alerts.push({
        type: 'duplicate',
        message: `Patient already taking ${rx.medication}`,
        prescriptionId: rx.id
      });
    }
  });

  return alerts;
}

export function getGuidance(medication: string): { patient?: string; pharmacy?: string } {
  return GUIDANCE[medication.toLowerCase()] || {};
}