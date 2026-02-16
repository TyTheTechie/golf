const BRAND = {
  green: "#2d6a2d",
  gold: "#d4a843",
  bg: "#f0f9f0",
  text: "#1a1a1a",
  muted: "#6b7280",
};

function layout(content: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
    <div style="text-align:center;margin-bottom:24px;">
      <span style="font-size:28px;">&#9971;</span>
      <span style="font-size:20px;font-weight:700;color:${BRAND.green};margin-left:8px;">JMC Charities</span>
    </div>
    <div style="background:#ffffff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
      ${content}
    </div>
    <p style="text-align:center;font-size:12px;color:${BRAND.muted};margin-top:24px;">
      JMC Charities Golf Tournament
    </p>
  </div>
</body>
</html>`;
}

export function golferConfirmationEmail({
  playerName,
  type,
  teamName,
  amount,
  inviteCode,
}: {
  playerName: string;
  type: string;
  teamName?: string;
  amount: number;
  inviteCode?: string;
}) {
  const amountStr = `$${(amount / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  return {
    subject: "Registration Confirmed - JMC Charities Golf Tournament",
    html: layout(`
      <h2 style="margin:0 0 8px;color:${BRAND.green};">Registration Confirmed!</h2>
      <p style="color:${BRAND.muted};margin:0 0 20px;">Thank you for registering, ${playerName}.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:8px 0;color:${BRAND.muted};">Type</td><td style="padding:8px 0;text-align:right;font-weight:600;">${type === "team" ? "Team of 4" : "Individual"}</td></tr>
        ${teamName ? `<tr><td style="padding:8px 0;color:${BRAND.muted};">Team</td><td style="padding:8px 0;text-align:right;font-weight:600;">${teamName}</td></tr>` : ""}
        <tr style="border-top:1px solid #e5e7eb;"><td style="padding:12px 0;font-weight:600;">Amount Paid</td><td style="padding:12px 0;text-align:right;font-weight:700;color:${BRAND.green};">${amountStr}</td></tr>
      </table>
      ${inviteCode ? `<div style="margin-top:20px;padding:16px;background:${BRAND.bg};border-radius:8px;text-align:center;">
        <p style="margin:0 0 4px;font-size:13px;color:${BRAND.muted};">Your Team Invite Code</p>
        <p style="margin:0;font-size:24px;font-weight:700;letter-spacing:3px;color:${BRAND.green};">${inviteCode}</p>
        <p style="margin:8px 0 0;font-size:12px;color:${BRAND.muted};">Share with teammates so they can join your team.</p>
      </div>` : ""}
    `),
  };
}

export function sponsorConfirmationEmail({
  companyName,
  contactName,
  tier,
  amount,
}: {
  companyName: string;
  contactName: string;
  tier: string;
  amount: number;
}) {
  const amountStr = `$${(amount / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  return {
    subject: "Sponsorship Confirmed - JMC Charities Golf Tournament",
    html: layout(`
      <h2 style="margin:0 0 8px;color:${BRAND.gold};">Sponsorship Confirmed!</h2>
      <p style="color:${BRAND.muted};margin:0 0 20px;">Thank you, ${contactName}.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:8px 0;color:${BRAND.muted};">Company</td><td style="padding:8px 0;text-align:right;font-weight:600;">${companyName}</td></tr>
        <tr><td style="padding:8px 0;color:${BRAND.muted};">Tier</td><td style="padding:8px 0;text-align:right;font-weight:600;">${tier.charAt(0).toUpperCase() + tier.slice(1)}</td></tr>
        <tr style="border-top:1px solid #e5e7eb;"><td style="padding:12px 0;font-weight:600;">Amount Paid</td><td style="padding:12px 0;text-align:right;font-weight:700;color:${BRAND.gold};">${amountStr}</td></tr>
      </table>
    `),
  };
}

export function outbidNotificationEmail({
  itemTitle,
  newAmount,
  itemUrl,
}: {
  itemTitle: string;
  newAmount: number;
  itemUrl: string;
}) {
  const amountStr = `$${(newAmount / 100).toFixed(2)}`;
  return {
    subject: `You've been outbid on "${itemTitle}"`,
    html: layout(`
      <h2 style="margin:0 0 8px;color:${BRAND.green};">You've Been Outbid</h2>
      <p style="color:${BRAND.muted};margin:0 0 20px;">Someone placed a higher bid on <strong>${itemTitle}</strong>.</p>
      <div style="padding:16px;background:${BRAND.bg};border-radius:8px;text-align:center;margin-bottom:20px;">
        <p style="margin:0 0 4px;font-size:13px;color:${BRAND.muted};">New High Bid</p>
        <p style="margin:0;font-size:28px;font-weight:700;color:${BRAND.green};">${amountStr}</p>
      </div>
      <a href="${itemUrl}" style="display:block;text-align:center;padding:12px 24px;background:${BRAND.green};color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;">Place a New Bid</a>
    `),
  };
}

export function teamJoinRequestEmail({
  requesterName,
  teamName,
  manageUrl,
}: {
  requesterName: string;
  teamName: string;
  manageUrl: string;
}) {
  return {
    subject: `New join request for ${teamName}`,
    html: layout(`
      <h2 style="margin:0 0 8px;color:${BRAND.green};">New Join Request</h2>
      <p style="color:${BRAND.muted};margin:0 0 20px;"><strong>${requesterName}</strong> wants to join <strong>${teamName}</strong>.</p>
      <a href="${manageUrl}" style="display:block;text-align:center;padding:12px 24px;background:${BRAND.green};color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;">Review Request</a>
    `),
  };
}

export function teamJoinApprovedEmail({
  teamName,
  playerName,
}: {
  teamName: string;
  playerName: string;
}) {
  return {
    subject: `You've been added to ${teamName}!`,
    html: layout(`
      <h2 style="margin:0 0 8px;color:${BRAND.green};">Welcome to the Team!</h2>
      <p style="color:${BRAND.muted};margin:0 0 20px;">Hey ${playerName}, your request to join <strong>${teamName}</strong> has been approved. See you on the course!</p>
    `),
  };
}

export function accessRequestEmail({
  requesterName,
  requesterEmail,
  message,
}: {
  requesterName: string;
  requesterEmail: string;
  message?: string;
}) {
  return {
    subject: `Access Code Request from ${requesterName}`,
    html: layout(`
      <h2 style="margin:0 0 8px;color:${BRAND.green};">Access Code Request</h2>
      <p style="color:${BRAND.muted};margin:0 0 20px;">Someone is requesting the event access code.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:8px 0;color:${BRAND.muted};">Name</td><td style="padding:8px 0;text-align:right;font-weight:600;">${requesterName}</td></tr>
        <tr><td style="padding:8px 0;color:${BRAND.muted};">Email</td><td style="padding:8px 0;text-align:right;font-weight:600;">${requesterEmail}</td></tr>
        ${message ? `<tr><td colspan="2" style="padding:12px 0;border-top:1px solid #e5e7eb;"><p style="margin:0 0 4px;color:${BRAND.muted};font-size:13px;">Message</p><p style="margin:0;">${message}</p></td></tr>` : ""}
      </table>
    `),
  };
}
