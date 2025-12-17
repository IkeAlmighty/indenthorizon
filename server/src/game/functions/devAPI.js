import { entities } from "../../engine/core.js";

// DEV API FUNCTIONS (FOR ADMINISTRATORS ONLY)

export function getClassification(callerId) {
  const entity = entities[callerId];
  if (!entity) throw new Error("Entity not found");
  return entity.classification;
}
