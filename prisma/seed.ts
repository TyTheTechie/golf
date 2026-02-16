import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning existing data...");
  await prisma.score.deleteMany();
  await prisma.eventResult.deleteMany();
  await prisma.rafflePrize.deleteMany();
  await prisma.raffleTicket.deleteMany();
  await prisma.volunteer.deleteMany();
  await prisma.waitlistEntry.deleteMany();
  await prisma.promoCode.deleteMany();
  await prisma.auctionFavorite.deleteMany();
  await prisma.bid.deleteMany();
  await prisma.teamJoinRequest.deleteMany();
  await prisma.auctionItem.deleteMany();
  await prisma.golferRegistration.deleteMany();
  await prisma.sponsorRegistration.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.event.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.siteSetting.deleteMany();

  console.log("Creating users...");
  const adminPassword = await hash("admin123", 12);
  const userPassword = await hash("player123", 12);

  const admin = await prisma.user.create({
    data: {
      name: "Tournament Admin",
      email: "admin@jmccharities.org",
      username: "admin",
      password: adminPassword,
      role: "admin",
      phone: "314-555-0100",
      smsOptIn: true,
    },
  });

  const player1 = await prisma.user.create({
    data: {
      name: "Mike Johnson",
      email: "mike@example.com",
      username: "mikej",
      password: userPassword,
      role: "user",
      phone: "314-555-0101",
      smsOptIn: true,
    },
  });

  const player2 = await prisma.user.create({
    data: {
      name: "Sarah Williams",
      email: "sarah@example.com",
      username: "sarahw",
      password: userPassword,
      role: "user",
      phone: "314-555-0102",
      smsOptIn: false,
    },
  });

  console.log("Creating site settings...");
  await prisma.siteSetting.create({
    data: { key: "EVENT_ACCESS_CODE", value: "GOLF2025" },
  });
  await prisma.siteSetting.create({
    data: { key: "MAX_REGISTRATIONS", value: "100" },
  });

  console.log("Creating events...");
  const activeEvent = await prisma.event.create({
    data: {
      name: "2025 JMC Charity Golf Classic",
      year: 2025,
      date: new Date("2025-09-15"),
      venue: "Forest Park Golf Course",
      description: "Annual charity golf tournament benefiting local youth programs.",
      isActive: true,
    },
  });

  const pastEvent = await prisma.event.create({
    data: {
      name: "2024 JMC Charity Golf Classic",
      year: 2024,
      date: new Date("2024-09-16"),
      venue: "Forest Park Golf Course",
      description: "Our inaugural charity golf tournament was a huge success!",
      isActive: false,
    },
  });

  console.log("Creating event results for past event...");
  await prisma.eventResult.createMany({
    data: [
      { eventId: pastEvent.id, place: 1, teamName: "The Par-fectors", playerNames: "Tom Brady, Aaron Rodgers, Patrick Mahomes, Josh Allen", score: 58 },
      { eventId: pastEvent.id, place: 2, teamName: "Hole-in-Fun", playerNames: "Tiger Woods, Phil Mickelson, Rory McIlroy, Jon Rahm", score: 61 },
      { eventId: pastEvent.id, place: 3, teamName: "Birdie Bunch", playerNames: "Jack Nicklaus, Arnold Palmer, Gary Player, Lee Trevino", score: 63 },
    ],
  });

  console.log("Creating promo codes...");
  await prisma.promoCode.createMany({
    data: [
      { code: "EARLY25", type: "percentage", value: 25, maxUses: 0, active: true },
      { code: "SAVE10", type: "fixed", value: 1000, maxUses: 0, active: true },
      { code: "LIMITED", type: "percentage", value: 50, maxUses: 5, currentUses: 2, active: true },
    ],
  });

  console.log("Creating sponsors...");
  const sponsorData = [
    { companyName: "Acme Corp", contactName: "John Doe", contactEmail: "john@acme.com", tier: "platinum", amount: 500000 },
    { companyName: "Summit Financial", contactName: "Jane Smith", contactEmail: "jane@summit.com", tier: "gold", amount: 300000 },
    { companyName: "Lakeside Realty", contactName: "Bob Lee", contactEmail: "bob@lakeside.com", tier: "silver", amount: 150000 },
    { companyName: "Metro Auto", contactName: "Tim Brown", contactEmail: "tim@metroauto.com", tier: "bronze", amount: 75000 },
    { companyName: "Fairway Grill", contactName: "Lisa Chen", contactEmail: "lisa@fairwaygrill.com", tier: "hole", amount: 25000 },
  ];

  for (const s of sponsorData) {
    await prisma.sponsorRegistration.create({
      data: {
        ...s,
        paymentStatus: "completed",
        paymentId: `seed_sponsor_${s.tier}`,
        eventId: activeEvent.id,
      },
    });
  }

  console.log("Creating golfer registrations...");
  // Individual registration 1 - checked in
  const reg1 = await prisma.golferRegistration.create({
    data: {
      type: "individual",
      player1Name: "Mike Johnson",
      player1Email: "mike@example.com",
      player1Phone: "314-555-0101",
      amount: 12500,
      paymentId: "seed_golfer_1",
      paymentStatus: "completed",
      checkedIn: true,
      checkedInAt: new Date(),
      eventId: activeEvent.id,
    },
  });

  // Individual registration 2 - checked in
  const reg2 = await prisma.golferRegistration.create({
    data: {
      type: "individual",
      player1Name: "Sarah Williams",
      player1Email: "sarah@example.com",
      player1Phone: "314-555-0102",
      amount: 12500,
      paymentId: "seed_golfer_2",
      paymentStatus: "completed",
      checkedIn: true,
      checkedInAt: new Date(),
      eventId: activeEvent.id,
    },
  });

  // Team registration 1 (Mike is captain)
  const reg3 = await prisma.golferRegistration.create({
    data: {
      type: "team",
      teamName: "Eagle Strikers",
      inviteCode: "TEAM-EAGL",
      captainUserId: player1.id,
      openForJoinRequests: true,
      player1Name: "Mike Johnson",
      player1Email: "mike@example.com",
      player1Phone: "314-555-0101",
      player2Name: "Dave Martinez",
      player2Email: "dave@example.com",
      player2Phone: "314-555-0103",
      amount: 50000,
      paymentId: "seed_golfer_3",
      paymentStatus: "completed",
      eventId: activeEvent.id,
    },
  });

  // Team registration 2 (Sarah is captain, full team)
  const reg4 = await prisma.golferRegistration.create({
    data: {
      type: "team",
      teamName: "Birdie Brigade",
      inviteCode: "TEAM-BIRD",
      captainUserId: player2.id,
      openForJoinRequests: false,
      player1Name: "Sarah Williams",
      player1Email: "sarah@example.com",
      player1Phone: "314-555-0102",
      player2Name: "Amy Taylor",
      player2Email: "amy@example.com",
      player3Name: "Chris Davis",
      player3Email: "chris@example.com",
      player4Name: "Pat Wilson",
      player4Email: "pat@example.com",
      amount: 50000,
      paymentId: "seed_golfer_4",
      paymentStatus: "completed",
      eventId: activeEvent.id,
    },
  });

  console.log("Creating scores...");
  // Full 18-hole scores for reg1 (Mike individual)
  const reg1Scores = [4, 3, 5, 4, 3, 4, 5, 3, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4];
  for (let i = 0; i < 18; i++) {
    await prisma.score.create({
      data: { registrationId: reg1.id, hole: i + 1, strokes: reg1Scores[i] },
    });
  }

  // Front 9 scores only for reg3 (Eagle Strikers team)
  const reg3Scores = [3, 4, 4, 3, 5, 4, 3, 4, 5];
  for (let i = 0; i < 9; i++) {
    await prisma.score.create({
      data: { registrationId: reg3.id, hole: i + 1, strokes: reg3Scores[i] },
    });
  }

  console.log("Creating auction items...");
  const now = new Date();
  const futureEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const pastEnd = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);

  const item1 = await prisma.auctionItem.create({
    data: {
      title: "Signed Cardinal Jersey",
      description: "Authentic game-worn jersey signed by the entire 2025 roster. Comes with certificate of authenticity.",
      startingBid: 5000,
      currentBid: 15000,
      bidIncrement: 500,
      status: "active",
      endTime: futureEnd,
      eventId: activeEvent.id,
    },
  });

  const item2 = await prisma.auctionItem.create({
    data: {
      title: "Lake of the Ozarks Weekend Getaway",
      description: "3-night stay at a luxury lakefront condo. Includes boat rental and dinner for two.",
      startingBid: 10000,
      currentBid: 25000,
      bidIncrement: 1000,
      status: "active",
      endTime: futureEnd,
      eventId: activeEvent.id,
    },
  });

  const item3 = await prisma.auctionItem.create({
    data: {
      title: "TaylorMade Driver + Fitting",
      description: "Brand new TaylorMade Qi35 driver with a custom club fitting session at Golf Galaxy.",
      startingBid: 20000,
      currentBid: 35000,
      bidIncrement: 2500,
      status: "active",
      endTime: futureEnd,
      eventId: activeEvent.id,
    },
  });

  await prisma.auctionItem.create({
    data: {
      title: "Spa Day Package",
      description: "Full-day spa experience for two at The Ritz-Carlton. Includes massage, facial, and lunch.",
      startingBid: 15000,
      bidIncrement: 1000,
      status: "draft",
      eventId: activeEvent.id,
    },
  });

  const completedItem = await prisma.auctionItem.create({
    data: {
      title: "Private Golf Lesson with PGA Pro",
      description: "One-hour private lesson with PGA Tour instructor. Includes video analysis.",
      startingBid: 7500,
      currentBid: 20000,
      bidIncrement: 500,
      status: "completed",
      endTime: pastEnd,
      winnerId: player1.id,
      eventId: activeEvent.id,
    },
  });

  console.log("Creating bids...");
  await prisma.bid.create({ data: { amount: 5000, userId: player1.id, auctionItemId: item1.id } });
  await prisma.bid.create({ data: { amount: 10000, userId: player2.id, auctionItemId: item1.id } });
  await prisma.bid.create({ data: { amount: 15000, userId: player1.id, auctionItemId: item1.id } });

  await prisma.bid.create({ data: { amount: 10000, userId: player2.id, auctionItemId: item2.id } });
  await prisma.bid.create({ data: { amount: 25000, userId: player1.id, auctionItemId: item2.id } });

  await prisma.bid.create({ data: { amount: 20000, userId: player1.id, auctionItemId: item3.id } });
  await prisma.bid.create({ data: { amount: 35000, userId: player2.id, auctionItemId: item3.id } });

  await prisma.bid.create({ data: { amount: 20000, userId: player1.id, auctionItemId: completedItem.id } });

  console.log("Creating donations...");
  await prisma.donation.create({
    data: { name: "John Smith", email: "john@example.com", amount: 5000, message: "Great cause!", paymentStatus: "completed" },
  });
  await prisma.donation.create({
    data: { name: "Jane Doe", email: "jane@example.com", amount: 10000, message: "Happy to support the kids!", paymentStatus: "completed" },
  });
  await prisma.donation.create({
    data: { name: "Bob Johnson", email: "bob@example.com", amount: 25000, paymentStatus: "completed" },
  });

  console.log("Creating favorites...");
  await prisma.auctionFavorite.create({ data: { userId: player1.id, auctionItemId: item1.id } });
  await prisma.auctionFavorite.create({ data: { userId: player1.id, auctionItemId: item2.id } });
  await prisma.auctionFavorite.create({ data: { userId: player2.id, auctionItemId: item3.id } });

  console.log("Creating raffle prizes and tickets...");
  const prize1 = await prisma.rafflePrize.create({
    data: { name: "65\" Samsung Smart TV", description: "Brand new 4K QLED Smart TV with wall mount kit." },
  });
  const prize2 = await prisma.rafflePrize.create({
    data: { name: "Yeti Cooler Package", description: "Tundra 45 cooler loaded with $200 worth of drinks and snacks." },
  });
  const prize3 = await prisma.rafflePrize.create({
    data: { name: "$500 Golf Galaxy Gift Card", description: "Shop for new clubs, apparel, and accessories." },
  });

  // Create 50 sold raffle tickets - 25 for each player
  for (let i = 1; i <= 50; i++) {
    await prisma.raffleTicket.create({
      data: {
        number: i,
        userId: i <= 25 ? player1.id : player2.id,
        status: "sold",
        price: 500,
      },
    });
  }

  console.log("Creating waitlist entries...");
  await prisma.waitlistEntry.createMany({
    data: [
      { name: "Alex Rivera", email: "alex@example.com", phone: "314-555-0201", type: "individual" },
      { name: "Team Thunderbirds", email: "thunder@example.com", phone: "314-555-0202", type: "team" },
      { name: "Casey Morgan", email: "casey@example.com", type: "individual" },
    ],
  });

  console.log("Creating volunteers...");
  await prisma.volunteer.createMany({
    data: [
      { name: "Emily Chen", email: "emily@example.com", phone: "314-555-0301", roles: JSON.stringify(["setup", "registration desk"]), shirtSize: "M" },
      { name: "Marcus Thompson", email: "marcus@example.com", phone: "314-555-0302", roles: JSON.stringify(["beverage cart", "cleanup"]), shirtSize: "L" },
      { name: "Priya Patel", email: "priya@example.com", phone: "314-555-0303", roles: JSON.stringify(["scoring", "registration desk"]), shirtSize: "S" },
      { name: "Jake Wilson", email: "jake@example.com", roles: JSON.stringify(["setup", "auction helper", "cleanup"]), shirtSize: "XL" },
      { name: "Sophia Lee", email: "sophia@example.com", phone: "314-555-0305", roles: JSON.stringify(["registration desk"]), shirtSize: "M", notes: "Available morning only" },
    ],
  });

  console.log("Seed complete!");
  console.log("  Admin: admin@jmccharities.org / admin123");
  console.log("  Player 1: mike@example.com / player123");
  console.log("  Player 2: sarah@example.com / player123");
  console.log("  Access Code: GOLF2025");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
