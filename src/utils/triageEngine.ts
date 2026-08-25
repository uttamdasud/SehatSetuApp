import { Doctor, SpecialtyType, SymptomAnalysisResult, UrgencyLevel } from '../types';
import { MOCK_DOCTORS, EMERGENCY_KEYWORDS } from '../data/mockData';

export function analyzeSymptoms(symptomText: string, allDoctors: Doctor[] = MOCK_DOCTORS): SymptomAnalysisResult {
  const query = symptomText.toLowerCase().trim();

  // 1. Check for Critical Emergency
  const isEmergency = EMERGENCY_KEYWORDS.some((kw) => query.includes(kw));

  if (isEmergency) {
    const matchedDocs = allDoctors.filter(
      (d) => d.specialty === 'Cardiologist' || d.specialty === 'General Physician'
    );

    return {
      category: 'General Physician',
      urgency: 'EMERGENCY',
      isEmergency: true,
      whyAppropriate:
        'The symptoms you described (such as severe chest pain, extreme breathing distress, or loss of consciousness) can be critical. Immediate emergency medical intervention or hospital emergency room admission is essential.',
      recommendedTimeframe: 'IMMEDIATE EMERGENCY ASSISTANCE REQUIRED',
      emergencyAdvice:
        'Please call India National Emergency (112) or Ambulance (108) immediately, or visit the nearest hospital emergency room (e.g. ILS Hospitals / GB Pant Hospital Emergency). Do not drive yourself.',
      suggestedAction: 'Call Emergency Services / Rush to Nearest Hospital',
      relevantQuestions: [
        'Is the person experiencing sweating, radiating arm/jaw pain, or shortness of breath?',
        'Is the person conscious and responsive?',
      ],
      matchedDoctors: matchedDocs,
    };
  }

  // 2. Specialty Mapping Rules
  let specialty: SpecialtyType = 'General Physician';
  let urgency: UrgencyLevel = 'ROUTINE';
  let whyAppropriate = 'A General Physician will evaluate systemic signs, order baseline tests if necessary, and recommend targeted treatment.';
  let timeframe = 'Within 24 to 48 hours';

  if (
    query.includes('skin') ||
    query.includes('rash') ||
    query.includes('itch') ||
    query.includes('acne') ||
    query.includes('pimple') ||
    query.includes('hair') ||
    query.includes('dandruff') ||
    query.includes('fungal') ||
    query.includes('eczema') ||
    query.includes('chamra') ||
    query.includes('khujli')
  ) {
    specialty = 'Dermatologist';
    urgency = 'ROUTINE';
    whyAppropriate =
      'A certified Dermatologist specializes in hair, scalp, nail, and skin disorders including rashes, allergic contact dermatitis, and acne vulgaris.';
    timeframe = 'Within 1–3 days';
  } else if (
    query.includes('heart') ||
    query.includes('bp') ||
    query.includes('blood pressure') ||
    query.includes('palpitation') ||
    query.includes('hypertension') ||
    query.includes('cholesterol') ||
    query.includes('breathless') ||
    query.includes('dhadkan')
  ) {
    specialty = 'Cardiologist';
    urgency = 'SOON';
    whyAppropriate =
      'A Cardiologist assesses cardiovascular circulation, blood pressure stability, lipid profiles, and rhythm patterns using ECG and clinical review.';
    timeframe = 'Within 24 hours';
  } else if (
    query.includes('child') ||
    query.includes('baby') ||
    query.includes('infant') ||
    query.includes('kid') ||
    query.includes('pediatric') ||
    query.includes('baccha') ||
    query.includes('vaccination')
  ) {
    specialty = 'Child Specialist';
    urgency = query.includes('fever') || query.includes('vomit') ? 'SOON' : 'ROUTINE';
    whyAppropriate =
      'Child Specialists (Pediatricians) are specially trained in newborn and child physiology, dosage titration, infection management, and growth monitoring.';
    timeframe = query.includes('fever') ? 'Same day consultation' : 'Within 2–3 days';
  } else if (
    query.includes('eye') ||
    query.includes('vision') ||
    query.includes('cataract') ||
    query.includes('glaucoma') ||
    query.includes('aankh') ||
    query.includes('sight')
  ) {
    specialty = 'Eye Specialist';
    urgency = query.includes('pain') ? 'SOON' : 'ROUTINE';
    whyAppropriate =
      'An Eye Specialist (Ophthalmologist) examines visual acuity, retinal health, intraocular pressure, and refractive errors.';
    timeframe = 'Within 1–2 days';
  } else if (
    query.includes('brain') ||
    query.includes('nerve') ||
    query.includes('headache') ||
    query.includes('migraine') ||
    query.includes('seizure') ||
    query.includes('numbness') ||
    query.includes('tremor')
  ) {
    specialty = 'Neurologist';
    urgency = query.includes('seizure') || query.includes('sudden') ? 'SOON' : 'ROUTINE';
    whyAppropriate =
      'A Neurologist diagnoses and treats disorders of the central and peripheral nervous system, migraines, neuropathy, and tremors.';
    timeframe = 'Within 24–48 hours';
  } else if (
    query.includes('stomach') ||
    query.includes('liver') ||
    query.includes('acid') ||
    query.includes('acidity') ||
    query.includes('gastric') ||
    query.includes('gerd') ||
    query.includes('constipation') ||
    query.includes('jaundice')
  ) {
    specialty = 'Gastroenterologist';
    urgency = query.includes('bleeding') || query.includes('severe') ? 'SOON' : 'ROUTINE';
    whyAppropriate =
      'A Gastroenterologist specializes in the digestive tract, liver, pancreas, acid reflux, and inflammatory bowel conditions.';
    timeframe = 'Within 1–3 days';
  } else if (
    query.includes('lung') ||
    query.includes('asthma') ||
    query.includes('wheezing') ||
    query.includes('cough') && query.includes('chronic') ||
    query.includes('copd') ||
    query.includes('chest congestion')
  ) {
    specialty = 'Pulmonologist';
    urgency = query.includes('wheez') || query.includes('breath') ? 'SOON' : 'ROUTINE';
    whyAppropriate =
      'A Pulmonologist evaluates respiratory tract conditions, pulmonary function, chronic cough, asthma, and allergic bronchospasm.';
    timeframe = 'Within 24 hours';
  } else if (
    query.includes('diabetes') ||
    query.includes('sugar') ||
    query.includes('thyroid') ||
    query.includes('hormone') ||
    query.includes('weight gain') ||
    query.includes('tsh')
  ) {
    specialty = 'Endocrinologist/Diabetologist';
    urgency = 'ROUTINE';
    whyAppropriate =
      'An Endocrinologist & Diabetologist manages blood glucose control, thyroid hormone imbalances, metabolic disorders, and pituitary health.';
    timeframe = 'Within 2–4 days';
  } else if (
    query.includes('kidney') ||
    query.includes('creatinine') ||
    query.includes('dialysis') ||
    query.includes('proteinuria')
  ) {
    specialty = 'Nephrologist';
    urgency = 'SOON';
    whyAppropriate =
      'A Nephrologist focuses on kidney health, filtration parameters, electrolyte balance, and chronic renal care.';
    timeframe = 'Within 24–48 hours';
  } else if (
    query.includes('physio') ||
    query.includes('posture') ||
    query.includes('rehab') ||
    query.includes('frozen shoulder') ||
    query.includes('muscle stiffness')
  ) {
    specialty = 'Physiotherapist';
    urgency = 'ROUTINE';
    whyAppropriate =
      'A Physiotherapist designs manual rehabilitation protocols, mobility exercises, and physical pain relief techniques.';
    timeframe = 'Within 2–3 days';
  } else if (
    query.includes('urine') ||
    query.includes('urinary') ||
    query.includes('kidney stone') ||
    query.includes('prostate')
  ) {
    specialty = 'Urologist';
    urgency = query.includes('pain') ? 'SOON' : 'ROUTINE';
    whyAppropriate =
      'A Urologist treats urinary system disorders, kidney stones, bladder health, and male reproductive system conditions.';
    timeframe = 'Within 1–2 days';
  } else if (
    query.includes('period') ||
    query.includes('pregnancy') ||
    query.includes('pregnant') ||
    query.includes('pcod') ||
    query.includes('pcos') ||
    query.includes('menstrual') ||
    query.includes('ovary') ||
    query.includes('cramps') ||
    query.includes('mahina')
  ) {
    specialty = 'Gynecologist';
    urgency = 'ROUTINE';
    whyAppropriate =
      'A Gynecologist addresses reproductive health, hormone balancing, ultrasound correlation, and menstrual cycle care.';
    timeframe = 'Within 2–4 days';
  } else if (
    query.includes('bone') ||
    query.includes('joint') ||
    query.includes('knee') ||
    query.includes('back pain') ||
    query.includes('spine') ||
    query.includes('fracture') ||
    query.includes('sprain') ||
    query.includes('arthritis') ||
    query.includes('haddi') ||
    query.includes('kamar dard')
  ) {
    specialty = 'Orthopedic';
    urgency = query.includes('swelling') || query.includes('fall') ? 'SOON' : 'ROUTINE';
    whyAppropriate =
      'An Orthopedic specialist evaluates musculoskeletal alignment, joint wear, ligament sprains, and back/neck pain.';
    timeframe = 'Within 24–48 hours';
  } else if (
    query.includes('ear') ||
    query.includes('nose') ||
    query.includes('throat') ||
    query.includes('sinus') ||
    query.includes('tonsil') ||
    query.includes('hearing') ||
    query.includes('kan') ||
    query.includes('gala')
  ) {
    specialty = 'ENT';
    urgency = 'ROUTINE';
    whyAppropriate =
      'An ENT (Otolaryngologist) has specialized equipment to inspect the eardrum, nasal septum, sinuses, and vocal cords.';
    timeframe = 'Within 1–2 days';
  } else if (
    query.includes('tooth') ||
    query.includes('teeth') ||
    query.includes('gum') ||
    query.includes('dental') ||
    query.includes('cavity') ||
    query.includes('dant')
  ) {
    specialty = 'Dentist';
    urgency = query.includes('severe') || query.includes('swelling') ? 'SOON' : 'ROUTINE';
    whyAppropriate =
      'A Dentist treats tooth decay, dental nerve inflammation, gum bleeding, and root canal indications.';
    timeframe = 'Within 24 hours';
  } else if (
    query.includes('sleep') ||
    query.includes('anxiety') ||
    query.includes('stress') ||
    query.includes('depression') ||
    query.includes('panic') ||
    query.includes('mental') ||
    query.includes('mood') ||
    query.includes('chinta') ||
    query.includes('neend')
  ) {
    specialty = 'Psychiatrist';
    urgency = 'ROUTINE';
    whyAppropriate =
      'A Psychiatrist provides supportive clinical consultation, sleep hygiene coaching, and medical intervention for mood and anxiety.';
    timeframe = 'Within 2–3 days';
  } else if (
    query.includes('ayurveda') ||
    query.includes('herbal') ||
    query.includes('immunity') ||
    query.includes('detox') ||
    query.includes('gas') ||
    query.includes('digestion') ||
    query.includes('ayurvedic')
  ) {
    specialty = 'Ayurveda';
    urgency = 'ROUTINE';
    whyAppropriate =
      'An Ayurvedic Vaidya examines doshic imbalance, digestive fire (Agni), and prescribes tailored herbal formulations and dietary routines.';
    timeframe = 'Within 3–5 days';
  } else {
    // Default fever / cough / stomach / general
    if (query.includes('fever') || query.includes('bukhar') || query.includes('jwor') || query.includes('temperature')) {
      urgency = 'SOON';
      timeframe = 'Same day / within 12 hours';
      whyAppropriate =
        'Fever requires monitoring of temperature spikes, hydration assessment, and screening for viral or seasonal vector-borne illnesses.';
    }
  }

  const matchedDocs = allDoctors.filter((d) => d.specialty === specialty);
  const fallbackDocs = matchedDocs.length > 0 ? matchedDocs : allDoctors.filter((d) => d.specialty === 'General Physician');

  return {
    category: specialty,
    urgency,
    whyAppropriate,
    recommendedTimeframe: timeframe,
    isEmergency: false,
    suggestedAction: `Schedule a consultation with a certified ${specialty}`,
    relevantQuestions: [
      'How many days have you had these symptoms?',
      'Have you taken any over-the-counter medicines yet?',
      'Are you experiencing any other symptoms like fever or nausea?',
    ],
    matchedDoctors: fallbackDocs,
  };
}
