import * as functionNames from "./functions.js";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { TICK_DURATION_MS } from "./engine.js";

async function generateAPI() {
  let apiObjString = `import client from "./index.js"\nexport const TICK_DURATION_MS = ${TICK_DURATION_MS}`;

  for (let fName in functionNames) {
    // skip the memory obj, as it is special:
    if (fName === "memory") continue;

    // append the function to the api object string
    const f = `export async function ${fName}(...args) { return client.emitOp({ functionName: "${fName}", args })}`;

    apiObjString += `\n${f}`;
  }

  const filepath = "../../client/functions.js";
  await mkdir(dirname(filepath), { recursive: true });
  await writeFile(filepath, apiObjString, "utf8");
}

generateAPI();
