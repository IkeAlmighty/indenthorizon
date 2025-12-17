// This is a driver for sending dev created scripts to the engine via pushOp(...args, isDev=true)
// It loads every single script in the scripts folder recursively, and runs them in seperate threads
// using functions/devAPI.js and functions/playerAPI.js as reference.

import { readdir } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { engine, entities, TICK_DURATION_MS } from "../engine/core.js";
import * as devAPI from "./functions/devAPI.js";
import * as playerAPI from "./functions/playerAPI.js";
import { fileURLToPath } from "node:url";

// combine devAPI and playerAPI for server-side scripts
const allAPI = { ...devAPI, ...playerAPI };

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCRIPTS_DIR = join(__dirname, "scripts");

console.log("Scripts directory:", SCRIPTS_DIR);

// Recursively find all .js files in a directory
async function findScriptFiles(dir) {
  let scriptFiles = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      const subDirFiles = await findScriptFiles(fullPath);
      scriptFiles = scriptFiles.concat(subDirFiles);
    } else if (entry.isFile() && extname(entry.name) === ".js") {
      scriptFiles.push(fullPath);
    }
  }
  return scriptFiles;
}

console.log("Found script files:", await findScriptFiles(SCRIPTS_DIR));

// API object to pass to scripts, similar to client/api.js but server-side
function makeServerAPI(entityId) {
  const api = {};
  for (const [fnName] of Object.entries(allAPI)) {
    api[fnName] = async (...args) => {
      return engine.pushOp(entityId, fnName, args, true);
    };
  }
  api.TICK_DURATION_MS = TICK_DURATION_MS;
  api.entity = entities[entityId];
  api.memory = entities[entityId].memory || {}; //TODO this should be loaded/saved from/to the database, for some reason it's not persisting
  return api;
}

async function findTargetEntities(scriptFile) {
  // Extract entityId or classification from filename
  const id = scriptFile.split(/[/\\]/).pop().split(".")[0];
  let targetEntities = []; // Array of entity IDs to run the script for
  const entityById = entities[id];
  if (entityById) {
    // Case 1: direct entity ID match
    targetEntities.push(entityById._id);
    console.log(`Target entity found by ID: ${entityById.name} (${id})`);
  } else {
    // Case 2: classification match
    for (const entity of Object.values(entities)) {
      if (entity.classification === id) {
        targetEntities.push(entity._id);
      }
    }
    console.log(
      `${targetEntities.length} target entities found with classification: ${id}`
    );
  }

  return targetEntities;
}

export async function startScriptLoops() {
  // assume that either 1) the object id of the entity running the script is in the filename,
  // or 2) grab all entities from the database with a matching classification to the script filename.
  // For case 2, this function starts a loop for each entity found with that classification.
  // Each loop calls the script's default exported function every TICK_DURATION_MS.

  const scriptFiles = await findScriptFiles(SCRIPTS_DIR);

  for (const scriptFile of scriptFiles) {
    const scriptModule = await import(`file://${scriptFile}`);
    const scriptFunction = scriptModule.default;
    if (typeof scriptFunction !== "function") {
      console.warn(`No default function exported in script: ${scriptFile}`);
      continue;
    }

    const targetEntities = await findTargetEntities(scriptFile);

    if (targetEntities.length === 0) {
      console.warn(`No target entities found for script: ${scriptFile}`);
      continue;
    }

    // Start a loop for each target entity
    for (const callerId of targetEntities) {
      const api = makeServerAPI(callerId);

      console.log(
        `Starting script loop for entity ${callerId} from file: ${scriptFile}`
      );

      setImmediate(async function scriptLoop() {
        const start = Date.now();
        try {
          await scriptFunction(api, callerId);
        } catch (err) {
          console.error(
            `Error in script ${scriptFile} for entity ${callerId}:`,
            err
          );
        }
        const duration = Date.now() - start;
        await new Promise((r) =>
          setTimeout(r, Math.max(0, TICK_DURATION_MS - duration))
        );
        scriptLoop();
      });
    }
  }
}
