import { randomBytes } from "crypto";

export function generateHireLinkCode(): string {
  const prefix = Date.now().toString(36).toUpperCase().slice(-4);
  const random = randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${random}`;
}
