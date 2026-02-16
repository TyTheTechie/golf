import { SquareClient, SquareEnvironment } from "square";

const globalForSquare = globalThis as unknown as {
  square: SquareClient | undefined;
};

export const square =
  globalForSquare.square ??
  new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN,
    environment:
      process.env.NODE_ENV === "production"
        ? SquareEnvironment.Production
        : SquareEnvironment.Sandbox,
  });

if (process.env.NODE_ENV !== "production") globalForSquare.square = square;

export const PRICES = {
  individual: 12500, // $125.00 in cents
  team: 50000, // $500.00 in cents
} as const;

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
