#!/usr/bin/env node

// Login script: POST to /login and output token
// Usage: node src/login.js [username] [password]

const username = process.argv[2] || "user";
const password = process.argv[3] || "pass";
const entity = process.argv[4] || "SS Driftwood";

fetch("http://localhost:3000/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password, entityName: entity }),
})
  .then((r) => r.json())
  .then((data) => {
    if (data.token) {
      console.log(data.token);
    } else {
      console.error("Login failed:", data.error || "Unknown error");
      process.exit(1);
    }
  })
  .catch((e) => {
    console.error("Login request failed:", e.message);
    process.exit(1);
  });
