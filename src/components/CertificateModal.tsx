import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Award, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";

interface CertificateModalProps {
  open: boolean;
  onClose: () => void;
  studentName: string;
  courseName: string;
  instructorName: string;
  completionDate: string;
}

function generateCertificatePDF(
  studentName: string,
  courseName: string,
  instructorName: string,
  completionDate: string
): jsPDF {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const w = 297;
  const h = 210;

  // Background
  doc.setFillColor(250, 250, 252);
  doc.rect(0, 0, w, h, "F");

  // Decorative border
  doc.setDrawColor(37, 99, 235); // primary blue
  doc.setLineWidth(1.5);
  doc.rect(12, 12, w - 24, h - 24);
  doc.setLineWidth(0.5);
  doc.rect(15, 15, w - 30, h - 30);

  // Corner decorations
  const cornerSize = 20;
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(1);
  // Top-left
  doc.line(12, 12 + cornerSize, 12, 12); doc.line(12, 12, 12 + cornerSize, 12);
  // Top-right
  doc.line(w - 12 - cornerSize, 12, w - 12, 12); doc.line(w - 12, 12, w - 12, 12 + cornerSize);
  // Bottom-left
  doc.line(12, h - 12 - cornerSize, 12, h - 12); doc.line(12, h - 12, 12 + cornerSize, h - 12);
  // Bottom-right
  doc.line(w - 12 - cornerSize, h - 12, w - 12, h - 12); doc.line(w - 12, h - 12, w - 12, h - 12 - cornerSize);

  // Top accent line
  doc.setFillColor(37, 99, 235);
  doc.rect(w / 2 - 40, 22, 80, 2, "F");

  // Award icon placeholder text
  doc.setFontSize(28);
  doc.setTextColor(37, 99, 235);
  doc.text("✦", w / 2, 38, { align: "center" });

  // "Certificate of Completion"
  doc.setFontSize(14);
  doc.setTextColor(120, 120, 140);
  doc.setFont("helvetica", "normal");
  doc.text("CERTIFICATE OF COMPLETION", w / 2, 50, { align: "center" });

  // Separator
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.3);
  doc.line(w / 2 - 50, 55, w / 2 + 50, 55);

  // "This is to certify that"
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 120);
  doc.text("This is to certify that", w / 2, 68, { align: "center" });

  // Student name
  doc.setFontSize(28);
  doc.setTextColor(30, 30, 50);
  doc.setFont("helvetica", "bold");
  doc.text(studentName, w / 2, 82, { align: "center" });

  // Underline under name
  const nameWidth = doc.getTextWidth(studentName);
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.5);
  doc.line(w / 2 - nameWidth / 2, 85, w / 2 + nameWidth / 2, 85);

  // "has successfully completed the course"
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 120);
  doc.setFont("helvetica", "normal");
  doc.text("has successfully completed the course", w / 2, 97, { align: "center" });

  // Course name
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.setFont("helvetica", "bold");

  // Handle long course names
  const maxLineWidth = w - 80;
  const courseLines = doc.splitTextToSize(courseName, maxLineWidth);
  let courseY = 112;
  courseLines.forEach((line: string) => {
    doc.text(line, w / 2, courseY, { align: "center" });
    courseY += 9;
  });

  // Bottom section
  const bottomY = 155;

  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 120);
  doc.setFont("helvetica", "normal");
  doc.text("Date of Completion", w / 4, bottomY, { align: "center" });
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 50);
  doc.setFont("helvetica", "bold");
  doc.text(completionDate, w / 4, bottomY + 8, { align: "center" });
  doc.setDrawColor(180, 180, 200);
  doc.setLineWidth(0.3);
  doc.line(w / 4 - 35, bottomY + 11, w / 4 + 35, bottomY + 11);

  // Instructor
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 120);
  doc.setFont("helvetica", "normal");
  doc.text("Instructor", (w * 3) / 4, bottomY, { align: "center" });
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 50);
  doc.setFont("helvetica", "bold");
  doc.text(instructorName, (w * 3) / 4, bottomY + 8, { align: "center" });
  doc.setDrawColor(180, 180, 200);
  doc.setLineWidth(0.3);
  doc.line((w * 3) / 4 - 35, bottomY + 11, (w * 3) / 4 + 35, bottomY + 11);

  // LearnHub branding
  doc.setFontSize(10);
  doc.setTextColor(37, 99, 235);
  doc.setFont("helvetica", "bold");
  doc.text("LearnHub", w / 2, bottomY, { align: "center" });
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 160);
  doc.setFont("helvetica", "normal");
  doc.text("Learning Management System", w / 2, bottomY + 6, { align: "center" });

  // Bottom accent line
  doc.setFillColor(37, 99, 235);
  doc.rect(w / 2 - 40, h - 22, 80, 2, "F");

  return doc;
}

export function CertificateModal({
  open,
  onClose,
  studentName,
  courseName,
  instructorName,
  completionDate,
}: CertificateModalProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    try {
      const doc = generateCertificatePDF(studentName, courseName, instructorName, completionDate);
      doc.save(`Certificate-${courseName.replace(/\s+/g, "-")}.pdf`);
    } catch (e) {
      console.error("PDF generation error:", e);
    }
    setDownloading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Course Completed!
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Preview card */}
          <div className="relative overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-6 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_50%)]" />
            <div className="relative">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Certificate of Completion</p>
              <h3 className="mt-2 font-serif text-xl font-bold">{studentName}</h3>
              <p className="mt-1 text-sm text-muted-foreground">has completed</p>
              <p className="mt-1 font-semibold text-primary">{courseName}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {completionDate} • Instructor: {instructorName}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleDownload} className="flex-1 gap-2" disabled={downloading}>
              {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download Certificate
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
