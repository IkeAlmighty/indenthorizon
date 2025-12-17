import { defineFunctions } from "../engine/functions.js";
import { startEngine } from "../engine/index.js";
import * as playerAPI from "./functions/playerAPI.js";
import * as devAPI from "./functions/devAPI.js";
import { startScriptLoops } from "./scriptDriver.js";

async function main() {
  console.log("Game server starting...");

  defineFunctions(playerAPI);
  defineFunctions(devAPI, "dev");
  await startEngine();

  await startScriptLoops();
}

main();
