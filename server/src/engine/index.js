import { startServer } from "./server.js";
import { startCoreRuntime } from "./core.js";

export function startEngine() {
  startServer(() => {
    try {
      startCoreRuntime();
    } catch (err) {
      console.err("Error starting engine: ", err);
    }
  });
}
