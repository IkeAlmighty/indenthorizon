#!/usr/bin/env node

import readline from "node:readline/promises";
import { spawn } from "node:child_process";
import { stdin as input, stdout as output } from "node:process";
import "dotenv/config";

const rl = readline.createInterface({ input, output });

async function main() {
  try {
    let username = process.env.IH_USERNAME;
    let password = process.env.IH_PASSWORD;
    let entityName = process.env.IH_ENTITY_NAME;

    console.log(username, password, entityName);

    if (!username) username = await rl.question("Username: ");
    if (!password) password = await rl.question("Password: ");
    if (!entityName) entityName = await rl.question("Entity Name: ");

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
    console.log("Login successful. Token:", token);

    rl.close();

    // Run npm run main.js <token> (but since no main.js, run the client)
    // Assuming "main" script is added to package.json as "node client/client.js examplePrograms/explore.js"
    const child = spawn(
      "node",
      ["client/index.js", "client/scripts/main.js", token],
      {
        stdio: "inherit",
        env: { ...process.env, TOKEN: token },
      }
    );

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
