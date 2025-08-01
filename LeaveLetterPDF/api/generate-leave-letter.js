
import { createWriteStream, readFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { finished } from 'stream';
import PDFDocument from 'pdfkit';

const streamFinished = promisify(finished);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  try {
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
      contactNumber,
    } = req.body;

    const filePath = join('/tmp', 'leave_letter.pdf'); 

    const doc = new PDFDocument({ margin: 50 });
    const writeStream = createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.font('Times-Roman').fontSize(12);

    const today = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    doc.text(`To\nThe Warden,\n${hostelAddress}\n`, { lineGap: 5 });
    doc.moveDown();
    doc.text(`Date: ${today}`, { lineGap: 5 });
    doc.moveDown();
    doc.text(`Subject: Request for Leave from Hostel`, { underline: true, lineGap: 6 });
    doc.moveDown();
    doc.text(`Respected Sir/Madam,`, { lineGap: 6 });
    doc.moveDown();
    doc.text(
      `I am ${fullName}, a student of ${course}, residing in Room No. ${roomNumber} at ${hostelAddress}. I would like to request leave from the hostel from ${leaveStart} to ${leaveEnd} due to ${reason}.`,
      { lineGap: 6, align: 'justify' }
    );
    doc.moveDown();
    doc.text(
      `During this period, I will be staying at my home located at ${homeAddress}. I assure you that I will return to the hostel on ${returnDate} and follow all the rules and regulations.`,
      { lineGap: 6, align: 'justify' }
    );
    doc.moveDown();
    doc.text(`Kindly grant me permission for the same.\n\nThank you for your consideration.`, { lineGap: 6 });
    doc.moveDown();
    doc.text(`Yours sincerely,`, { lineGap: 4 });
    doc.text(`${fullName}`, { lineGap: 4 });
    doc.text(`Roll No: ${rollNumber}`, { lineGap: 4 });
    doc.text(`Contact: ${contactNumber}`, { lineGap: 4 });

    doc.end();

    await streamFinished(writeStream);

    const fileBuffer = readFileSync(filePath);

    res.setHeader('Content-Disposition', 'attachment; filename=Hostel_Leave_Letter.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(fileBuffer);

    unlinkSync(filePath); 
  } catch (err) {
    console.error('PDF generation failed:', err);
    res.status(500).send({ message: 'Failed to generate PDF' });
  }
}
