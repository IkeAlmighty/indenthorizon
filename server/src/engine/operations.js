const operations = Object.create(null);
export default operations;

export function defineOperations(permission, functions) {
  // TODO: integrate permissions for dev vs player entity operations
  console.warn("\x1b[33m%s\x1b[0m", "WARNING: permissions not yet implemented");
  for (let [fnName, fn] of Object.entries(functions)) {
    console.log("\x1b[34m%s\x1b[0m", `Defining ${permission} op: ${fnName} `);
    operations[fnName] = fn;
  }
}
