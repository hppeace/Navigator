import "dotenv/config";

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";

const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const databasePath = resolveSqlitePath(databaseUrl);
const prismaCliPath = path.join(process.cwd(), "node_modules", "prisma", "build", "index.js");

mkdirSync(path.dirname(databasePath), { recursive: true });

if (existsSync(databasePath)) {
  rmSync(databasePath);
}

const sql = execFileSync(process.execPath, [prismaCliPath, "migrate", "diff", "--from-empty", "--to-schema", "prisma/schema.prisma", "--script"], {
  cwd: process.cwd(),
  env: process.env,
  encoding: "utf8",
});

const database = new Database(databasePath);
database.pragma("foreign_keys = ON");
database.exec(sql);
database.close();

console.log(`SQLite schema synced to ${databasePath}`);

function resolveSqlitePath(url: string) {
  if (!url.startsWith("file:")) {
    throw new Error(`Only SQLite file URLs are supported. Received: ${url}`);
  }

  const filePath = url.slice("file:".length);
  return path.resolve(process.cwd(), filePath);
}
