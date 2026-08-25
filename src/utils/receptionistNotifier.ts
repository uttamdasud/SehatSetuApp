import { Doctor, Appointment } from '../types';

/**
 * Generates formatted text for WhatsApp dispatch of the whole day's booking manifest to doctor's receptionist.
 */
export function generateDoctorDailyRosterWhatsAppText(
  doctor: Doctor,
  date: string,
  appointments: Appointment[]
): string {
  const sortedAppointments = [...appointments].sort((a, b) => (a.serialNumber || 0) - (b.serialNumber || 0));
  const receptionist = doctor.receptionistName || 'Clinic Front Desk Manager';
  const phone = doctor.receptionistPhone || '+91 98301 22450';

  let msg = `🏥 *MEDPULSE HEALTH NETWORK - DAILY CLINIC ROSTER*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `👨‍⚕️ *Doctor:* ${doctor.name} (${doctor.specialty})\n`;
  msg += `🏢 *Facility:* ${doctor.hospital}\n`;
  msg += `📍 *Location:* ${doctor.hospitalAddress || doctor.location}\n`;
  msg += `📅 *Date:* ${date}\n`;
  msg += `👥 *Total Bookings:* ${sortedAppointments.length} Patient(s)\n`;
  msg += `👩‍💼 *Desk In-Charge:* ${receptionist} (${phone})\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `📋 *PATIENT QUEUE & SERIAL NUMBERS:*\n\n`;

  if (sortedAppointments.length === 0) {
    msg += `_No appointments scheduled yet for this date._\n`;
  } else {
    sortedAppointments.forEach((apt, idx) => {
      const serial = apt.serialNumber || idx + 1;
      const typeLabel = apt.type === 'VIDEO' ? '📹 Video Call' : '🏥 In-Clinic Visit';
      const address = apt.patientAddress ? apt.patientAddress : 'Not specified';
      const reason = apt.symptoms ? apt.symptoms : 'General Consultation';
      const feeStatus = apt.type === 'VIDEO' 
        ? `₹${apt.fee} (Video Consult)` 
        : `₹${apt.doctorFeePayableAtClinic || apt.fee} (Collect in Clinic)`;

      msg += `*SL #${serial}* | *Token: ${apt.tokenNumber || `#TK-${serial}`}*\n`;
      msg += `👤 *Patient:* ${apt.patientName} (${apt.patientAge}y, ${apt.patientGender})\n`;
      msg += `📞 *Phone:* ${apt.patientPhone}\n`;
      if (apt.patientAddress) {
        msg += `📍 *Address:* ${address}\n`;
      }
      msg += `⏰ *Slot:* ${apt.timeSlot} [${typeLabel}]\n`;
      msg += `🩺 *Reason:* ${reason}\n`;
      msg += `💵 *Visiting Fee:* ${feeStatus}\n`;
      msg += `🆔 *Booking ID:* ${apt.id}\n`;
      msg += `────────────────────────────\n`;
    });
  }

  msg += `\n⚡ *Automated dispatch by MedPulse Telehealth Platform*\n`;
  msg += `ℹ️ _Please verify patient identity at the clinic desk upon arrival._`;

  return msg;
}

/**
 * Generates subject and body for email dispatch to receptionist/assistant.
 */
export function generateDoctorDailyRosterEmailContent(
  doctor: Doctor,
  date: string,
  appointments: Appointment[]
): { subject: string; body: string } {
  const sortedAppointments = [...appointments].sort((a, b) => (a.serialNumber || 0) - (b.serialNumber || 0));
  const receptionist = doctor.receptionistName || 'Clinic Receptionist';
  
  const subject = `[Daily Patient Roster] ${doctor.name} - ${date} (${sortedAppointments.length} Bookings)`;
  
  let body = `Hello ${receptionist},\n\n`;
  body += `Here is the confirmed whole-day patient booking roster for ${doctor.name} for ${date}.\n\n`;
  body += `========================================================\n`;
  body += `DOCTOR & CLINIC DETAILS:\n`;
  body += `Doctor: ${doctor.name} (${doctor.specialty})\n`;
  body += `Hospital/Clinic: ${doctor.hospital}\n`;
  body += `Address: ${doctor.hospitalAddress || doctor.location}\n`;
  body += `Date: ${date}\n`;
  body += `Total Patients Booked: ${sortedAppointments.length}\n`;
  body += `========================================================\n\n`;
  body += `PATIENT QUEUE & SERIAL NUMBERS:\n\n`;

  if (sortedAppointments.length === 0) {
    body += `No appointments booked yet for this date.\n`;
  } else {
    sortedAppointments.forEach((apt, idx) => {
      const serial = apt.serialNumber || idx + 1;
      const typeLabel = apt.type === 'VIDEO' ? 'Video Consultation' : 'In-Clinic Physical Visit';
      body += `SERIAL #${serial} | TOKEN: ${apt.tokenNumber || `TK-${serial}`}\n`;
      body += `--------------------------------------------------------\n`;
      body += `Patient Name: ${apt.patientName}\n`;
      body += `Age / Gender: ${apt.patientAge} Years / ${apt.patientGender}\n`;
      body += `Contact Number: ${apt.patientPhone}\n`;
      if (apt.patientAddress) {
        body += `Residential Address: ${apt.patientAddress}\n`;
      }
      body += `Appointment Slot: ${apt.timeSlot} (${typeLabel})\n`;
      body += `Consultation Reason: ${apt.symptoms || 'General Checkup'}\n`;
      body += `Doctor Visiting Fee: ₹${apt.doctorFeePayableAtClinic || apt.fee} (Payable at Clinic)\n`;
      body += `Booking Reference: ${apt.id}\n\n`;
    });
  }

  body += `========================================================\n`;
  body += `Sent automatically via MedPulse Healthcare Network\n`;
  body += `For modifications or clinic emergency rescheduling, visit the admin portal.\n`;

  return { subject, body };
}

/**
 * Creates WhatsApp Web / App intent URL.
 */
export function getWhatsAppRosterUrl(phone: string, text: string): string {
  // Strip non-digits except leading +
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  
  // If phone has 10 digits without country code, prefix with 91
  const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  
  return `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodedText}`;
}

/**
 * Creates Mailto URL for email dispatch.
 */
export function getEmailRosterUrl(email: string, subject: string, body: string): string {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
}

/**
 * Calculates sequential serial number for a doctor on a specific appointment date.
 */
export function calculateDoctorDaySerialNumber(
  allAppointments: Appointment[],
  doctorId: string,
  date: string
): number {
  const doctorDateAppointments = allAppointments.filter(
    (a) => a.doctorId === doctorId && a.date === date && a.status !== 'CANCELLED'
  );
  return doctorDateAppointments.length + 1;
}

/**
 * Generates Doctor-specific Token ID maintaining serial number.
 */
export function generateDoctorTokenString(doctor: Doctor, serialNumber: number): string {
  // Extract doctor's surname or abbreviation
  const nameParts = doctor.name.replace(/^Dr\.\s+/i, '').split(' ');
  const code = (nameParts[nameParts.length - 1] || nameParts[0] || 'DOC').toUpperCase().slice(0, 3);
  return `#${code}-${String(serialNumber).padStart(2, '0')}`;
}
