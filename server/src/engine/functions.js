export const devFunctions = Object.create(null);
export const playerFunctions = Object.create(null);

// defaults to player permissions. Can specify dev permission to allow
// only entities owned by the dev User to use the function
export function defineFunctions(functions, permission = "player") {
  for (let [fnName, fn] of Object.entries(functions)) {
    const color = permission === "dev" ? "\x1b[35m" : "\x1b[34m";
    console.log(`${color}%s\x1b[0m`, `Defining ${permission} op: ${fnName} `);

    // aways define the function in the dev functions:
    devFunctions[fnName] = fn;

    // only define it in the playerFunctions if it is a player function:
    if (permission === "player") playerFunctions[fnName] = fn;
  }
}
