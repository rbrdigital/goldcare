// Import unified interface
import { ParsedPrescription, Alert } from '@/types/prescription';
import { getTodayISO } from '@/lib/dateUtils';

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
      startDate: getTodayISO(),
      earliestFillDate: getTodayISO()
    };

    // Handle taper patterns (e.g., "prednisone taper 40mg 5d, 20mg 5d, 10mg 5d")
    if (line.toLowerCase().includes('taper')) {
      parsed.isTaper = true;
      const taperMatch = line.match(/(\w+)\s+taper\s+(.*)/i);
      if (taperMatch) {
        parsed.medication = taperMatch[1];
        parsed.notes = line; // Store full taper instructions in notes
        parsed.duration = 'See instructions';
        parsed.frequency = 'As directed';
      }
    } else {
      // Extract medication name (first meaningful word)
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

      // Extract duration and convert to days only
      const durMatch = line.match(/\b(?:x|for)\s*(\d+)\s*(d|days?|w|weeks?|m|months?)\b/i);
      if (durMatch) {
        const value = parseInt(durMatch[1]);
        const unit = durMatch[2].toLowerCase();
        
        if (unit.startsWith('w')) {
          // Convert weeks to days
          parsed.duration = (value * 7).toString();
        } else if (unit.startsWith('d')) {
          parsed.duration = value.toString();
        } else if (unit.startsWith('m')) {
          // Convert months to days (rough estimate)
          parsed.duration = (value * 30).toString();
        }
      } else if (line.toLowerCase().includes('long-term')) {
        parsed.duration = undefined; // Long-term has no specific duration
      }

      // Calculate quantity (simple heuristic)
      if (parsed.frequency && parsed.duration && !line.toLowerCase().includes('long-term')) {
        const freqPerDay = parsed.frequency === 'QD' || parsed.frequency.includes('once') ? 1 : 
                         parsed.frequency === 'BID' || parsed.frequency.includes('twice') ? 2 :
                         parsed.frequency === 'TID' || parsed.frequency.includes('three') ? 3 :
                         parsed.frequency === 'QID' ? 4 : 1;
        
        const days = parseInt(parsed.duration);
        if (!isNaN(days)) {
          parsed.quantity = freqPerDay * days;
        }
      } else if (line.toLowerCase().includes('long-term')) {
        parsed.quantity = 90; // 90-day supply for maintenance
        parsed.refills = 5;
      }
    }

    return parsed;
  });
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