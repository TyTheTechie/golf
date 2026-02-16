import { jsPDF } from "jspdf";

const BRAND_GREEN = "#2d6a2d";

function addHeader(doc: jsPDF) {
  doc.setFontSize(20);
  doc.setTextColor(BRAND_GREEN);
  doc.text("JMC Charities", 105, 25, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor("#6b8f6b");
  doc.text("Golf Tournament - Fore the Kids!", 105, 32, { align: "center" });

  doc.setDrawColor(BRAND_GREEN);
  doc.setLineWidth(0.5);
  doc.line(20, 38, 190, 38);
}

function addFooter(doc: jsPDF) {
  doc.setFontSize(8);
  doc.setTextColor("#999999");
  doc.text(
    "JMC Charities is a registered 501(c)(3) nonprofit organization. EIN: XX-XXXXXXX",
    105,
    270,
    { align: "center" }
  );
  doc.text(
    "No goods or services were provided in exchange for this contribution.",
    105,
    276,
    { align: "center" }
  );
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 282, {
    align: "center",
  });
}

export function generateDonationReceipt(donation: {
  id: string;
  name: string;
  email: string;
  amount: number;
  createdAt: Date;
}): Uint8Array {
  const doc = new jsPDF();

  addHeader(doc);

  doc.setFontSize(16);
  doc.setTextColor("#1a2e1a");
  doc.text("Donation Receipt", 105, 52, { align: "center" });

  doc.setFontSize(11);
  doc.setTextColor("#333333");

  const y = 68;
  const fields = [
    ["Receipt #", donation.id.slice(0, 12).toUpperCase()],
    ["Donor Name", donation.name],
    ["Email", donation.email],
    ["Date", new Date(donation.createdAt).toLocaleDateString()],
    ["Amount", `$${(donation.amount / 100).toFixed(2)}`],
  ];

  fields.forEach(([label, value], i) => {
    const rowY = y + i * 12;
    doc.setTextColor("#6b8f6b");
    doc.text(label, 25, rowY);
    doc.setTextColor("#1a2e1a");
    doc.setFont("helvetica", "bold");
    doc.text(value, 85, rowY);
    doc.setFont("helvetica", "normal");
  });

  doc.setFontSize(10);
  doc.setTextColor("#6b8f6b");
  doc.text(
    "Thank you for your generous donation to JMC Charities!",
    105,
    y + fields.length * 12 + 15,
    { align: "center" }
  );
  doc.text(
    "This receipt serves as your official record for tax purposes.",
    105,
    y + fields.length * 12 + 22,
    { align: "center" }
  );

  addFooter(doc);

  return new Uint8Array(doc.output("arraybuffer"));
}

export function generateSponsorReceipt(sponsor: {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  tier: string;
  amount: number;
  createdAt: Date;
}): Uint8Array {
  const doc = new jsPDF();

  addHeader(doc);

  doc.setFontSize(16);
  doc.setTextColor("#1a2e1a");
  doc.text("Sponsorship Receipt", 105, 52, { align: "center" });

  doc.setFontSize(11);
  doc.setTextColor("#333333");

  const y = 68;
  const fields = [
    ["Receipt #", sponsor.id.slice(0, 12).toUpperCase()],
    ["Company", sponsor.companyName],
    ["Contact", sponsor.contactName],
    ["Email", sponsor.contactEmail],
    ["Tier", sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1)],
    ["Date", new Date(sponsor.createdAt).toLocaleDateString()],
    ["Amount", `$${(sponsor.amount / 100).toFixed(2)}`],
  ];

  fields.forEach(([label, value], i) => {
    const rowY = y + i * 12;
    doc.setTextColor("#6b8f6b");
    doc.text(label, 25, rowY);
    doc.setTextColor("#1a2e1a");
    doc.setFont("helvetica", "bold");
    doc.text(value, 85, rowY);
    doc.setFont("helvetica", "normal");
  });

  doc.setFontSize(10);
  doc.setTextColor("#6b8f6b");
  doc.text(
    "Thank you for sponsoring JMC Charities Golf Tournament!",
    105,
    y + fields.length * 12 + 15,
    { align: "center" }
  );

  addFooter(doc);

  return new Uint8Array(doc.output("arraybuffer"));
}
