// Parsed ICD-10 Favorites data
export interface ICD10Diagnosis {
  code: string;
  diagnosis: string;
  category: string;
  autoResolve: boolean;
  notes?: string;
}

// Hardcoded dataset from ICD10_Favorites.csv
export const icd10Diagnoses: ICD10Diagnosis[] = [
  // Chronic cardiometabolic
  { code: "I10", diagnosis: "Hypertension", category: "Chronic cardiometabolic", autoResolve: false },
  { code: "E10.9", diagnosis: "Type 1 diabetes mellitus", category: "Chronic cardiometabolic", autoResolve: false },
  { code: "E11.9", diagnosis: "Type 2 diabetes mellitus", category: "Chronic cardiometabolic", autoResolve: false },
  { code: "R73.03", diagnosis: "Prediabetes", category: "Chronic cardiometabolic", autoResolve: true, notes: "R-code auto-resolves in 6 months" },
  { code: "E78.5", diagnosis: "Hyperlipidemia", category: "Chronic cardiometabolic", autoResolve: false },
  { code: "E03.9", diagnosis: "Hypothyroidism", category: "Chronic cardiometabolic", autoResolve: false },
  { code: "E06.3", diagnosis: "Thyroiditis, autoimmune", category: "Chronic cardiometabolic", autoResolve: false },
  { code: "E07.9", diagnosis: "Thyroid disorder, unspecified", category: "Chronic cardiometabolic", autoResolve: false },
  { code: "E66.9", diagnosis: "Obesity", category: "Chronic cardiometabolic", autoResolve: false },
  { code: "E66.3", diagnosis: "Overweight", category: "Chronic cardiometabolic", autoResolve: false },
  { code: "E88.81", diagnosis: "Metabolic syndrome", category: "Chronic cardiometabolic", autoResolve: false },
  { code: "E55.9", diagnosis: "Vitamin D deficiency", category: "Chronic cardiometabolic", autoResolve: false },
  { code: "E53.8", diagnosis: "B-vitamin deficiency", category: "Chronic cardiometabolic", autoResolve: false },
  { code: "E87.8", diagnosis: "Electrolyte and fluid balance disorder", category: "Chronic cardiometabolic", autoResolve: false },
  { code: "N18.2", diagnosis: "Chronic kidney disease (mild)", category: "Chronic cardiometabolic", autoResolve: false },
  { code: "D64.9", diagnosis: "Anemia", category: "Chronic cardiometabolic", autoResolve: false },
  { code: "I25", diagnosis: "Atherosclerotic heart disease without angina", category: "Chronic cardiometabolic", autoResolve: false },
  { code: "I48.0", diagnosis: "Paroxysmal atrial fibrillation", category: "Chronic cardiometabolic", autoResolve: false },
  { code: "I48.11", diagnosis: "Persistent atrial fibrillation", category: "Chronic cardiometabolic", autoResolve: false },
  { code: "I63.9", diagnosis: "Cerebral infarction", category: "Chronic cardiometabolic", autoResolve: false },
  { code: "I16.0", diagnosis: "Hypertensive urgency", category: "Chronic cardiometabolic", autoResolve: false },

  // Eye
  { code: "H40.9", diagnosis: "Glaucoma", category: "Eye", autoResolve: false },
  { code: "H26.9", diagnosis: "Cataract", category: "Eye", autoResolve: false },
  { code: "H04.123", diagnosis: "Dry eye", category: "Eye", autoResolve: false },
  { code: "E11.319", diagnosis: "Retinopathy and diabetes", category: "Eye", autoResolve: false },
  { code: "H54.1", diagnosis: "Blindness", category: "Eye", autoResolve: false },
  { code: "H34.10", diagnosis: "Central retinal artery occlusion", category: "Eye", autoResolve: false },
  { code: "H10.9", diagnosis: "Conjunctivitis", category: "Eye", autoResolve: true, notes: "Auto-resolve for acute use" },
  { code: "H00.019", diagnosis: "Hordeolum unspecified eye", category: "Eye", autoResolve: true, notes: "Auto-resolve" },

  // Respiratory / sleep
  { code: "J44.9", diagnosis: "COPD", category: "Respiratory / sleep", autoResolve: false },
  { code: "J45.909", diagnosis: "Asthma", category: "Respiratory / sleep", autoResolve: false },
  { code: "J20.9", diagnosis: "Bronchitis", category: "Respiratory / sleep", autoResolve: true, notes: "Auto-resolve" },
  { code: "J20.0", diagnosis: "Bronchitis due to mycoplasma pneumoniae", category: "Respiratory / sleep", autoResolve: true, notes: "Auto-resolve" },
  { code: "J30.9", diagnosis: "Rhinitis", category: "Respiratory / sleep", autoResolve: false },
  { code: "J10.1", diagnosis: "Influenza", category: "Respiratory / sleep", autoResolve: true, notes: "Auto-resolve" },
  { code: "G47.00", diagnosis: "Insomnia", category: "Respiratory / sleep", autoResolve: false },
  { code: "G47.33", diagnosis: "Sleep apnea", category: "Respiratory / sleep", autoResolve: false },

  // Musculoskeletal / pain
  { code: "M19.90", diagnosis: "Osteoarthritis, unspecified", category: "Musculoskeletal / pain", autoResolve: false },
  { code: "M17.10", diagnosis: "Unilateral osteoarthritis, knee", category: "Musculoskeletal / pain", autoResolve: false },
  { code: "M54.50", diagnosis: "Low back pain", category: "Musculoskeletal / pain", autoResolve: false },
  { code: "M54.2", diagnosis: "Cervicalgia (neck pain)", category: "Musculoskeletal / pain", autoResolve: false },
  { code: "G89.29", diagnosis: "Other chronic pain", category: "Musculoskeletal / pain", autoResolve: false },
  { code: "M72.2", diagnosis: "Plantar fascial fibromatosis", category: "Musculoskeletal / pain", autoResolve: false },
  { code: "G60.3", diagnosis: "Idiopathic progressive neuropathy", category: "Musculoskeletal / pain", autoResolve: false },
  { code: "M81.8", diagnosis: "Osteoporosis without pathological fracture", category: "Musculoskeletal / pain", autoResolve: false },
  { code: "M81.0", diagnosis: "Osteoporosis", category: "Musculoskeletal / pain", autoResolve: false },
  { code: "M85.80", diagnosis: "Osteopenia", category: "Musculoskeletal / pain", autoResolve: false },
  { code: "M25.5", diagnosis: "Pain in joint, unspecified", category: "Musculoskeletal / pain", autoResolve: false },
  { code: "M54.10", diagnosis: "Radiculopathy, unspecified", category: "Musculoskeletal / pain", autoResolve: false },
  { code: "M54.16", diagnosis: "Radiculopathy, lumbar", category: "Musculoskeletal / pain", autoResolve: false },
  { code: "G62.9", diagnosis: "Polyneuropathy", category: "Musculoskeletal / pain", autoResolve: false },
  { code: "M79.10", diagnosis: "Myalgia", category: "Musculoskeletal / pain", autoResolve: false },
  { code: "M79.7", diagnosis: "Fibromyalgia", category: "Musculoskeletal / pain", autoResolve: false },
  { code: "M79.2", diagnosis: "Neuralgia and neuritis", category: "Musculoskeletal / pain", autoResolve: false },
  { code: "G56.0", diagnosis: "Carpal tunnel syndrome", category: "Musculoskeletal / pain", autoResolve: false },
  { code: "C43.9", diagnosis: "Skin neoplasm", category: "Musculoskeletal / pain", autoResolve: false },
  { code: "M10.9", diagnosis: "Gout", category: "Musculoskeletal / pain", autoResolve: false },
  { code: "M62.838", diagnosis: "Muscle spasm, other", category: "Musculoskeletal / pain", autoResolve: false },

  // Genitourinary (common ≥50)
  { code: "N39.0", diagnosis: "Urinary tract infection", category: "Genitourinary (common ≥50)", autoResolve: true, notes: "Auto-resolve" },
  { code: "N30.0", diagnosis: "Cystitis", category: "Genitourinary (common ≥50)", autoResolve: true, notes: "Auto-resolve" },
  { code: "R35.0", diagnosis: "Frequency of micturition", category: "Genitourinary (common ≥50)", autoResolve: true, notes: "R-code auto-resolves" },
  { code: "R39.15", diagnosis: "Urgency of urination", category: "Genitourinary (common ≥50)", autoResolve: true, notes: "R-code auto-resolves" },
  { code: "R30.0", diagnosis: "Pain with urination (dysuria)", category: "Genitourinary (common ≥50)", autoResolve: true, notes: "R-code auto-resolves" },
  { code: "N39.41", diagnosis: "Urge incontinence", category: "Genitourinary (common ≥50)", autoResolve: false },
  { code: "N18.4", diagnosis: "Chronic kidney disease (severe)", category: "Genitourinary (common ≥50)", autoResolve: false },
  { code: "N18.6", diagnosis: "ESRD (dialysis)", category: "Genitourinary (common ≥50)", autoResolve: false },
  { code: "N20.0", diagnosis: "Kidney stone", category: "Genitourinary (common ≥50)", autoResolve: true, notes: "Auto-resolve then replace with Z87.442" },

  // GI & endocrine
  { code: "K21.9", diagnosis: "GERD", category: "GI & endocrine", autoResolve: false },
  { code: "K59.00", diagnosis: "Constipation", category: "GI & endocrine", autoResolve: false },
  { code: "K52.9", diagnosis: "Gastroenteritis", category: "GI & endocrine", autoResolve: true, notes: "Auto-resolve" },
  { code: "K57.30", diagnosis: "Diverticulosis", category: "GI & endocrine", autoResolve: false },
  { code: "K50.90", diagnosis: "Crohn's disease", category: "GI & endocrine", autoResolve: false },
  { code: "K51.90", diagnosis: "Ulcerative colitis", category: "GI & endocrine", autoResolve: false },
  { code: "K58.9", diagnosis: "Irritable bowel syndrome", category: "GI & endocrine", autoResolve: false },
  { code: "K80.20", diagnosis: "Cholelithiasis", category: "GI & endocrine", autoResolve: false },
  { code: "K76.0", diagnosis: "Fatty liver disease", category: "GI & endocrine", autoResolve: false },
  { code: "K86.9", diagnosis: "Pancreatic disorder", category: "GI & endocrine", autoResolve: false },

  // Neuropsych / behavioral
  { code: "F41.1", diagnosis: "Generalized anxiety disorder", category: "Neuropsych / behavioral", autoResolve: false },
  { code: "F32.9", diagnosis: "Major depressive disorder", category: "Neuropsych / behavioral", autoResolve: false },
  { code: "F43.10", diagnosis: "PTSD", category: "Neuropsych / behavioral", autoResolve: false },
  { code: "F90.9", diagnosis: "ADHD", category: "Neuropsych / behavioral", autoResolve: false },
  { code: "F84.0", diagnosis: "Autism spectrum disorder", category: "Neuropsych / behavioral", autoResolve: false },
  { code: "F10.20", diagnosis: "Alcohol use disorder", category: "Neuropsych / behavioral", autoResolve: false },
  { code: "F11.20", diagnosis: "Opioid use disorder", category: "Neuropsych / behavioral", autoResolve: false },
  { code: "F17.200", diagnosis: "Nicotine dependence", category: "Neuropsych / behavioral", autoResolve: false },
  { code: "G20", diagnosis: "Parkinson's disease", category: "Neuropsych / behavioral", autoResolve: false },
  { code: "G30.9", diagnosis: "Alzheimer's disease", category: "Neuropsych / behavioral", autoResolve: false },
  { code: "F03.90", diagnosis: "Dementia", category: "Neuropsych / behavioral", autoResolve: false },
  { code: "G40.909", diagnosis: "Epilepsy", category: "Neuropsych / behavioral", autoResolve: false },
  { code: "G43.909", diagnosis: "Migraine", category: "Neuropsych / behavioral", autoResolve: false },
  { code: "G44.209", diagnosis: "Tension-type headache", category: "Neuropsych / behavioral", autoResolve: false },

  // Dermatology
  { code: "L20.9", diagnosis: "Eczema", category: "Dermatology", autoResolve: false },
  { code: "L40.9", diagnosis: "Psoriasis", category: "Dermatology", autoResolve: false },
  { code: "L70.0", diagnosis: "Acne", category: "Dermatology", autoResolve: false },
  { code: "L30.9", diagnosis: "Dermatitis", category: "Dermatology", autoResolve: false },
  { code: "B07.9", diagnosis: "Wart", category: "Dermatology", autoResolve: true, notes: "Auto-resolve" },
  { code: "L71.9", diagnosis: "Rosacea", category: "Dermatology", autoResolve: false },
  { code: "L98.9", diagnosis: "Skin disorder", category: "Dermatology", autoResolve: false },

  // Infectious disease
  { code: "A09", diagnosis: "Gastroenteritis, infectious", category: "Infectious disease", autoResolve: true, notes: "Auto-resolve" },
  { code: "J02.9", diagnosis: "Pharyngitis", category: "Infectious disease", autoResolve: true, notes: "Auto-resolve" },
  { code: "J06.9", diagnosis: "Upper respiratory infection", category: "Infectious disease", autoResolve: true, notes: "Auto-resolve" },
  { code: "J18.9", diagnosis: "Pneumonia", category: "Infectious disease", autoResolve: true, notes: "Auto-resolve" },
  { code: "B34.9", diagnosis: "Viral infection", category: "Infectious disease", autoResolve: true, notes: "Auto-resolve" },
  { code: "L03.90", diagnosis: "Cellulitis", category: "Infectious disease", autoResolve: true, notes: "Auto-resolve" },
  { code: "H66.90", diagnosis: "Otitis media", category: "Infectious disease", autoResolve: true, notes: "Auto-resolve" },
  { code: "B37.9", diagnosis: "Candidiasis", category: "Infectious disease", autoResolve: true, notes: "Auto-resolve" },
  { code: "A49.9", diagnosis: "Bacterial infection", category: "Infectious disease", autoResolve: true, notes: "Auto-resolve" },

  // Sex-specific: female
  { code: "N94.6", diagnosis: "Dysmenorrhea", category: "Sex-specific: female", autoResolve: false },
  { code: "N92.0", diagnosis: "Menorrhagia", category: "Sex-specific: female", autoResolve: false },
  { code: "N76.0", diagnosis: "Vaginitis", category: "Sex-specific: female", autoResolve: true, notes: "Auto-resolve" },
  { code: "N95.1", diagnosis: "Menopause", category: "Sex-specific: female", autoResolve: false },
  { code: "N80.9", diagnosis: "Endometriosis", category: "Sex-specific: female", autoResolve: false },
  { code: "D25.9", diagnosis: "Uterine fibroid", category: "Sex-specific: female", autoResolve: false },
  { code: "N83.20", diagnosis: "Ovarian cyst", category: "Sex-specific: female", autoResolve: false },
  { code: "Z30.09", diagnosis: "Contraceptive management", category: "Sex-specific: female", autoResolve: false },
  { code: "Z01.411", diagnosis: "Pap smear", category: "Sex-specific: female", autoResolve: false },
  { code: "N97.9", diagnosis: "Infertility", category: "Sex-specific: female", autoResolve: false },

  // Sex-specific: male
  { code: "N40.0", diagnosis: "Benign prostatic hyperplasia", category: "Sex-specific: male", autoResolve: false },
  { code: "N41.9", diagnosis: "Prostatitis", category: "Sex-specific: male", autoResolve: true, notes: "Auto-resolve" },
  { code: "N48.30", diagnosis: "Priapism", category: "Sex-specific: male", autoResolve: true, notes: "Auto-resolve" },
  { code: "N50.82", diagnosis: "Scrotal pain", category: "Sex-specific: male", autoResolve: true, notes: "Auto-resolve" },
  { code: "N44.00", diagnosis: "Testicular torsion", category: "Sex-specific: male", autoResolve: true, notes: "Auto-resolve" },
  { code: "N43.3", diagnosis: "Hydrocele", category: "Sex-specific: male", autoResolve: false },
  { code: "N50.89", diagnosis: "Testicular disorder", category: "Sex-specific: male", autoResolve: false },
  { code: "N52.9", diagnosis: "Erectile dysfunction", category: "Sex-specific: male", autoResolve: false },
  { code: "E29.1", diagnosis: "Hypogonadism", category: "Sex-specific: male", autoResolve: false },

  // Wellness / prevention
  { code: "Z00.00", diagnosis: "Wellness visit", category: "Wellness / prevention", autoResolve: false },
  { code: "Z23", diagnosis: "Immunization", category: "Wellness / prevention", autoResolve: false },
  { code: "Z13.89", diagnosis: "Screening exam", category: "Wellness / prevention", autoResolve: false },
  { code: "Z71.3", diagnosis: "Dietary counseling", category: "Wellness / prevention", autoResolve: false },
  { code: "Z71.89", diagnosis: "Health counseling", category: "Wellness / prevention", autoResolve: false },
  { code: "Z79.899", diagnosis: "Long-term medication use", category: "Wellness / prevention", autoResolve: false },

  // Symptom codes (R-codes)
  { code: "R05.9", diagnosis: "Cough", category: "Symptom codes (R-codes)", autoResolve: true, notes: "R-code auto-resolves" },
  { code: "R50.9", diagnosis: "Fever", category: "Symptom codes (R-codes)", autoResolve: true, notes: "R-code auto-resolves" },
  { code: "R51.9", diagnosis: "Headache", category: "Symptom codes (R-codes)", autoResolve: true, notes: "R-code auto-resolves" },
  { code: "R10.9", diagnosis: "Abdominal pain", category: "Symptom codes (R-codes)", autoResolve: true, notes: "R-code auto-resolves" },
  { code: "R07.9", diagnosis: "Chest pain", category: "Symptom codes (R-codes)", autoResolve: true, notes: "R-code auto-resolves" },
  { code: "R42", diagnosis: "Dizziness", category: "Symptom codes (R-codes)", autoResolve: true, notes: "R-code auto-resolves" },
  { code: "R53.83", diagnosis: "Fatigue", category: "Symptom codes (R-codes)", autoResolve: true, notes: "R-code auto-resolves" },
  { code: "R06.02", diagnosis: "Shortness of breath", category: "Symptom codes (R-codes)", autoResolve: true, notes: "R-code auto-resolves" },
  { code: "R11.0", diagnosis: "Nausea", category: "Symptom codes (R-codes)", autoResolve: true, notes: "R-code auto-resolves" },
  { code: "R11.10", diagnosis: "Vomiting", category: "Symptom codes (R-codes)", autoResolve: true, notes: "R-code auto-resolves" },
  { code: "R19.7", diagnosis: "Diarrhea", category: "Symptom codes (R-codes)", autoResolve: true, notes: "R-code auto-resolves" },
  { code: "R60.9", diagnosis: "Edema", category: "Symptom codes (R-codes)", autoResolve: true, notes: "R-code auto-resolves" },
  { code: "R63.4", diagnosis: "Weight loss", category: "Symptom codes (R-codes)", autoResolve: true, notes: "R-code auto-resolves" },
  { code: "R63.5", diagnosis: "Weight gain", category: "Symptom codes (R-codes)", autoResolve: true, notes: "R-code auto-resolves" },
];

// Helper to get unique categories
export const getCategories = (): string[] => {
  const categories = new Set(icd10Diagnoses.map(d => d.category));
  return Array.from(categories).sort();
};
