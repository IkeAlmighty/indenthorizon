import { defineOperations } from "../engine/operations.js";
import { startEngine } from "../engine/index.js";
import * as playerAPI from "./playerAPI.js";

defineOperations("player", playerAPI);
startEngine();
