import { Entity, initDatabase } from "./database.js";
import entityFunctions from "./operations.js";

export const events = []; // global event queue
export const observers = {}; // eventKey -> [callback1, callback2, ...]
export const entities = {};
export let tick = 0;

const MAX_QUEUE_PER_ENTITY = 20;
export const TICK_DURATION_MS = 100;

// a queue of program ops. Organized as a dictionary of entity _ids, with a single operation at each value.
// operations match map to functions available to players.
const ops = Object.create(null); // entity_Id -> [{ opName, args }]

export const engine = {
  pushOp(entityId, functionName, args) {
    const now = Date.now();

    if (!ops[entityId]) ops[entityId] = [];

    const queue = ops[entityId];

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
  for (let e of entitiesList) entities[e._id] = e;
}

// TODO: create a cleanup function to be ran when the engine shuts down

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
  for (let [entityId, queue] of Object.entries(ops)) {
    if (!queue.length) continue;

    if (queue[0].ts > now) return; // only run if the scheduled time has arrived

    const op = queue.shift();

    try {
      const fn = entityFunctions[op.functionName];
      if (typeof fn !== "function") {
        throw new Error(`Unknown op ${op.functionName}`);
      }

      const result = await fn(...op.args);

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

  while (true) {
    const start = Date.now();

    await step();

    const duration = Date.now() - start;
    await new Promise((r) =>
      setTimeout(r, Math.max(0, TICK_DURATION_MS - duration))
    );

    tick++;
  }
}
