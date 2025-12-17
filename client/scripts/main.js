/**
 *
 * @param {typeof import("../api.js")} api - represents all the possible ways an entity (like a
 * ship) can interact with the game.
 */
export default async function loop(api) {
  //  your code here

  const status = await api.getStatus();
  // console.log(status);
}
