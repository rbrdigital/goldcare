// Import unified interface
import { ParsedPrescription, Alert } from '@/types/prescription';
import { getTodayISO } from '@/lib/dateUtils';

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

// Check for drug interactions and allergies
export function checkInteractions(prescriptions: ParsedPrescription[]): Alert[] {
  const alerts: Alert[] = [];

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