import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "footballhub-secret-key-change-in-production";
const SALT_ROUNDS = 10;

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: Omit<User, "password">): string {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string): Omit<User, "password"> | null {
  try {
    return jwt.verify(token, JWT_SECRET) as Omit<User, "password">;
  } catch {
    return null;
  }
}

const STORAGE_KEY = "fh_users";

export function getUsers(): User[] {
  if (typeof window !== "undefined") return [];
  try {
    const fs = require("fs");
    const path = require("path");
    const filePath = path.join(process.cwd(), "data", "users.json");
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
}

export function saveUser(user: User): void {
  const fs = require("fs");
  const path = require("path");
  const dir = path.join(process.cwd(), "data");
  const filePath = path.join(dir, "users.json");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const users = getUsers();
  users.push(user);
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

export function findUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}
