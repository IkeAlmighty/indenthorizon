/**
 *
 * @param {typeof import("../functions.js")} api - represents all the possible ways an entity (like a
 * ship) can interact with the game.
 */
export default async function step(api) {
  //  your code here
  const tick = await api.getTick();

  if (tick % 20 == 0) console.log("20 ticks have passed.");
}
