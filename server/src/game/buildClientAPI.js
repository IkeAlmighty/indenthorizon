import * as playerFunctions from "./playerAPI.js";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { TICK_DURATION_MS } from "../engine/core.js";

async function generateAPI() {
  let apiObjString = `import client from "./index.js"\nexport const TICK_DURATION_MS = ${TICK_DURATION_MS}`;

  for (let fName in playerFunctions) {
    // append the function to the api object string
    const f = `export async function ${fName}(...args) { return client.emitOp({ functionName: "${fName}", args })}`;

    apiObjString += `\n${f}`;
  }

  const filepath = "./client/api.js";

  try {
    await mkdir(dirname(filepath), { recursive: true });
    await writeFile(filepath, apiObjString, "utf8");
  } catch (err) {
    console.error(err);
  }
}

generateAPI();
