/**
 * @param {object} api - The API object passed from scriptDriver (dev and player functions)
 */
export default async function starScript(api) {
  // get the classification of the entity running this script
  const classification = await api.getClassification();

  if (classification !== "star") {
    console.log(
      `Entity ${api.entity.name} with classification ${classification} tried to run star script. Exiting.`
    );
    return;
  }

  // store some data in the entity's memory
  api.memory.ts = Date.now();

  api.memory.ticks = (api.memory.ticks || 0) + 1;

  console.log(
    `Star entity ${api.entity.name} has run for ${api.memory.ticks} ticks.`
  );
}
