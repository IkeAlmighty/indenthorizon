import { initDatabase } from "./db/connection.js";
import { Entity } from "./db/models/entity.js";
import { playerFunctions, devFunctions } from "./functions.js";

export const events = []; // global event queue
export const observers = {}; // eventKey -> [callback1, callback2, ...]
export const entities = {};
export let tick = 0;

const MAX_QUEUE_PER_ENTITY = 20;
export const TICK_DURATION_MS = 100;

// Maps of entity ids to function queues per entity. The server places functions from dev entities in
// the dev function queue, which has access to all possible functions in the game.
const functionQueues = Object.create(null); // entity_Id -> [{ fnName, args }]
const devFunctionQueues = Object.create(null);

export const engine = {
  pushOp(entityId, functionName, args, isDev = false) {
    const now = Date.now();
    let queue;

    if (isDev) {
      if (!devFunctionQueues[entityId]) devFunctionQueues[entityId] = [];
      queue = devFunctionQueues[entityId];
    } else {
      if (!functionQueues[entityId]) functionQueues[entityId] = [];
      queue = functionQueues[entityId];
    }

    if (queue.length >= MAX_QUEUE_PER_ENTITY) {
      throw new Error(
        `Too many queued ops for entity ${entityId}. Max is ${MAX_QUEUE_PER_ENTITY}.`
      );
    }

    // calculate next available tick boundary
    // (either one tick after the last op pushed in,
    // or right now if there are no ops queued)
    const lastTs = queue.length ? queue[queue.length - 1].ts : now;
    const ts = Math.max(now, lastTs + TICK_DURATION_MS);

    return new Promise((resolve, reject) => {
      queue.push({
        entityId,
        functionName,
        args,
        ts,
        resolve,
        reject,
      });
    });
  },
};

async function loadEntitiesFromDatabase() {
  let entitiesList = await Entity.find({}).lean();
  console.log(`Loaded ${entitiesList.length} entities from database.`);
  for (let e of entitiesList) entities[e._id] = e;
}

// Save entities back to the database
export async function updateEntitiesToDatabase() {
  console.log("Saving entities to database...");
  // Save any necessary data back to the database
  for (let entityId in entities) {
    let entityData = entities[entityId];
    console.log(entityData);
    await Entity.updateOne({ _id: entityId }, entityData);
  }
}

/**
 * One tick of the engine. Executes at most one op per entity per tick window.
 */
async function step() {
  // Process events that were emitted in the last tick
  while (events.length > 0) {
    const { key, args } = events.shift();
    if (observers[key]) {
      for (const callback of observers[key]) {
        try {
          callback(...args);
        } catch (err) {
          console.error(`Error in event observer for ${key}:`, err);
        }
      }
    }
  }

  // Execute all operations:
  const now = Date.now();
  for (let [entityId, queue] of [
    ...Object.entries(functionQueues),
    ...Object.entries(devFunctionQueues),
  ]) {
    if (!queue.length) continue;

    if (queue[0].ts > now) return; // only run if the scheduled time has arrived

    const op = queue.shift();

    try {
      const fn =
        playerFunctions[op.functionName] || devFunctions[op.functionName];
      if (typeof fn !== "function") {
        throw new Error(`Unknown op ${op.functionName}`);
      }

      const result = await fn(entityId, ...op.args);

      op.resolve(result);
    } catch (err) {
      op.reject(err);
    }
  }
}

export async function startCoreRuntime() {
  // load in entities from database:
  await initDatabase();
  await loadEntitiesFromDatabase();

  console.log("Starting core runtime...");

  setImmediate(async () => {
    while (true) {
      const start = Date.now();

      await step();

      const duration = Date.now() - start;
      await new Promise((r) =>
        setTimeout(r, Math.max(0, TICK_DURATION_MS - duration))
      );

      tick++;
    }
  });
}
