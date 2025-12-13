#!/usr/bin/env node

import readline from "node:readline/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stdin as input, stdout as output } from "node:process";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rl = readline.createInterface({ input, output });

async function main() {
  try {
    let username = process.env.IH_USERNAME;
    let password = process.env.IH_PASSWORD;
    let entityName = process.env.IH_ENTITY_NAME;

    if (!username) username = await rl.question("Username: ");
    else console.log("pulled username from .env file");

    if (!password) password = await rl.question("Password: ");
    else console.log("pulled password from .env file");

    if (!entityName) entityName = await rl.question("Entity Name: ");
    else console.log("pulled entity name from .env file");

    console.log("Logging in...");

    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, entityName }),
    });

    const data = await res.json();

    if (!res.ok || !data.token) {
      console.error("Login failed:", data.error || "Unknown error");
      rl.close();
      process.exit(1);
    }

    const token = data.token;
    console.log(`Successfully logged in as ${entityName}`);

    rl.close();

    const indexPath = path.resolve(__dirname, "index.js");
    const scriptPath = path.resolve(__dirname, "./scripts/main.js");

    const child = spawn("node", [indexPath, scriptPath, token], {
      stdio: "inherit",
      env: { ...process.env, TOKEN: token },
    });

    child.on("close", (code) => {
      process.exit(code);
    });
  } catch (err) {
    console.error("Error:", err.message);
    rl.close();
    process.exit(1);
  }
}

main();
