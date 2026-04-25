import { createHash, randomBytes } from "crypto";

export function createPlainToken(size = 32) {
  return randomBytes(size).toString("hex");
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
