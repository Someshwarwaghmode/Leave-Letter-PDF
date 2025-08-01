// api/generate-leave-letter.js

import { writeFileSync, unlinkSync } from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const {
    fullName,
    course,
    roomNumber,
    hostelAddress,
    leaveStart,
    leaveEnd,
    reason,
    homeAddress,
    returnDate,
    rollNumber,
    contactNumber
  } = req.body;

  const doc = new PDFDocument({ margin: 50 });

  const filePath = path.join('/tmp', 'leave_letter.pdf'); // Use /tmp in Vercel
  const stream = writeFileSync(filePath, '');
  doc.pipe(require('fs').createWriteStream(filePath));

  doc.font('Times-Roman');
  doc.fontSize(12);

  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  doc.text(`To\nThe Warden,\n${hostelAddress}\n`, { lineGap: 5 });
  doc.moveDown(1);
  doc.text(`Date: ${today}`, { lineGap: 5 });
  doc.moveDown(1);
  doc.text(`Subject: Request for Leave from Hostel`, { underline: true, lineGap: 6 });
  doc.moveDown(1);
  doc.text(`Respected Sir/Madam,`, { lineGap: 6 });
  doc.moveDown(1);
  doc.text(`I am ${fullName}, a student of ${course}, residing in Room No. ${roomNumber} at ${hostelAddress}. I would like to request leave from the hostel from ${leaveStart} to ${leaveEnd} due to ${reason}.`, { lineGap: 6, align: 'justify' });
  doc.moveDown(1);
  doc.text(`During this period, I will be staying at my home located at ${homeAddress}. I assure you that I will return to the hostel on ${returnDate} and follow all the rules and regulations.`, { lineGap: 6, align: 'justify' });
  doc.moveDown(1);
  doc.text(`Kindly grant me permission for the same.\n\nThank you for your consideration.`, { lineGap: 6 });
  doc.moveDown(1);
  doc.text(`Yours sincerely,`, { lineGap: 4 });
  doc.text(`${fullName}`, { lineGap: 4 });
  doc.text(`Roll No: ${rollNumber}`, { lineGap: 4 });
  doc.text(`Contact: ${contactNumber}`, { lineGap: 4 });

  doc.end();

  // Wait for PDF generation to finish
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const fileBuffer = require('fs').readFileSync(filePath);
  res.setHeader('Content-Disposition', 'attachment; filename=Hostel_Leave_Letter.pdf');
  res.setHeader('Content-Type', 'application/pdf');
  res.send(fileBuffer);

  unlinkSync(filePath); // Clean up
}
