import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning existing data...");
  await prisma.auctionFavorite.deleteMany();
  await prisma.bid.deleteMany();
  await prisma.teamJoinRequest.deleteMany();
  await prisma.auctionItem.deleteMany();
  await prisma.golferRegistration.deleteMany();
  await prisma.sponsorRegistration.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.photo.deleteMany();
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
    },
  });

  const player1 = await prisma.user.create({
    data: {
      name: "Mike Johnson",
      email: "mike@example.com",
      username: "mikej",
      password: userPassword,
      role: "user",
    },
  });

  const player2 = await prisma.user.create({
    data: {
      name: "Sarah Williams",
      email: "sarah@example.com",
      username: "sarahw",
      password: userPassword,
      role: "user",
    },
  });

  console.log("Creating site settings...");
  await prisma.siteSetting.create({
    data: { key: "EVENT_ACCESS_CODE", value: "GOLF2025" },
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
      },
    });
  }

  console.log("Creating golfer registrations...");
  // Individual registration 1
  await prisma.golferRegistration.create({
    data: {
      type: "individual",
      player1Name: "Mike Johnson",
      player1Email: "mike@example.com",
      player1Phone: "314-555-0101",
      amount: 12500,
      paymentId: "seed_golfer_1",
      paymentStatus: "completed",
    },
  });

  // Individual registration 2
  await prisma.golferRegistration.create({
    data: {
      type: "individual",
      player1Name: "Sarah Williams",
      player1Email: "sarah@example.com",
      player1Phone: "314-555-0102",
      amount: 12500,
      paymentId: "seed_golfer_2",
      paymentStatus: "completed",
    },
  });

  // Team registration 1 (Mike is captain)
  await prisma.golferRegistration.create({
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
    },
  });

  // Team registration 2 (Sarah is captain, full team)
  await prisma.golferRegistration.create({
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
    },
  });

  console.log("Creating auction items...");
  const now = new Date();
  const futureEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  const pastEnd = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000); // 1 day ago

  const item1 = await prisma.auctionItem.create({
    data: {
      title: "Signed Cardinal Jersey",
      description: "Authentic game-worn jersey signed by the entire 2025 roster. Comes with certificate of authenticity.",
      startingBid: 5000,
      currentBid: 15000,
      bidIncrement: 500,
      status: "active",
      endTime: futureEnd,
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
    },
  });

  await prisma.auctionItem.create({
    data: {
      title: "Spa Day Package",
      description: "Full-day spa experience for two at The Ritz-Carlton. Includes massage, facial, and lunch.",
      startingBid: 15000,
      bidIncrement: 1000,
      status: "draft",
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
    },
  });

  console.log("Creating bids...");
  // Bids on item1 (Signed Jersey)
  await prisma.bid.create({ data: { amount: 5000, userId: player1.id, auctionItemId: item1.id } });
  await prisma.bid.create({ data: { amount: 10000, userId: player2.id, auctionItemId: item1.id } });
  await prisma.bid.create({ data: { amount: 15000, userId: player1.id, auctionItemId: item1.id } });

  // Bids on item2 (Lake Getaway)
  await prisma.bid.create({ data: { amount: 10000, userId: player2.id, auctionItemId: item2.id } });
  await prisma.bid.create({ data: { amount: 25000, userId: player1.id, auctionItemId: item2.id } });

  // Bids on item3 (TaylorMade Driver)
  await prisma.bid.create({ data: { amount: 20000, userId: player1.id, auctionItemId: item3.id } });
  await prisma.bid.create({ data: { amount: 35000, userId: player2.id, auctionItemId: item3.id } });

  // Bids on completed item
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
