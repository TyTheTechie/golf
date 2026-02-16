export function outbidAlert(itemTitle: string, newAmount: number) {
  return `JMC Golf: You've been outbid on "${itemTitle}"! New high bid: $${(newAmount / 100).toFixed(2)}. Bid now to stay in the lead!`;
}

export function auctionWon(itemTitle: string, winningBid: number) {
  return `JMC Golf: Congrats! You won "${itemTitle}" with a bid of $${(winningBid / 100).toFixed(2)}. We'll be in touch with pickup details.`;
}

export function registrationConfirmation(playerName: string, type: string) {
  return `JMC Golf: Welcome, ${playerName}! Your ${type} registration is confirmed. See you on the course!`;
}

export function checkInReminder(playerName: string, date: string) {
  return `JMC Golf: Hi ${playerName}! Reminder: Check-in starts at 7AM on ${date}. Show your QR code at the registration desk.`;
}

export function raffleWinner(prizeName: string) {
  return `JMC Golf: You won the raffle prize "${prizeName}"! Visit the registration desk to claim your prize.`;
}
