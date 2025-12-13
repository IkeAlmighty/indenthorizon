import { initDatabase, Entity, User } from "./database.js";

const sampleEntities = [
  {
    x: 0,
    y: 0,
    name: "SS Driftwood",
    cargo: ["fuel", "supplies"],
    classification: "ship",
  },
  {
    x: 100,
    y: 50,
    name: "Earth",
    cargo: [],
    classification: "planet",
  },
  {
    x: -50,
    y: 25,
    name: "Orbital Station Alpha",
    cargo: ["repairs", "trade goods"],
    classification: "station",
  },
  {
    x: 200,
    y: 100,
    name: "USS Explorer",
    cargo: ["minerals"],
    classification: "ship",
  },
  {
    x: -150,
    y: -75,
    name: "Mars",
    cargo: [],
    classification: "planet",
  },
];

async function seed() {
  try {
    await initDatabase();

    console.log("Seeding user...");

    const user = new User({ username: "user", password: "pass" });
    await user.save();

    console.log("Seeding entities...");

    for (const data of sampleEntities) {
      const entity = new Entity({ ...data, owner: user });
      await entity.save();
      console.log(`Created entity: ${entity.name} (${entity._id})`);
    }

    console.log("Seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
