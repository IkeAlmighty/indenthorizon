import { tick, entities } from "../../engine/core.js";

// EXPORTED FUNCTIONS (USER WRITTEN PROGRAMS CAN USE, SO SENSITIVE FUNCTIONS NOT ALLOWED)

export function getTick() {
  return tick;
}

/**
 *
 * @param {ObjectId} callerId
 * @returns the comprehensive status of the ship calling the function.
 * It might get deprecated in favor of smaller per module functions if it is too slow
 */
export function getStatus(callerId) {
  const ship = entities[callerId];
  const allModuleStatuses = {};
  for (let m of ship.modules) {
    allModuleStatuses[m] = getStatus(m);
  }

  return allModuleStatuses;
}

// low level module management
export function attachModule(callerId, moduleId, slot) {}
export function detachModuleById(callerId, moduleId) {} // goes to cargo if there is space, otherwise jettisoned
export function detachModuleBySlot(callerId, slot) {} // goes to cargo if there is space, otherwise jettisoned

export function getModuleStatus(callerId, slot) {}
export function getAllModules(callerId) {}

export function activateModule(callerId, slot) {}
export function deactivateModule(callerId, slot) {}
export function activateModuleById(callerId, moduleId) {}
export function deactivateModuleById(callerId, moduleId) {}

export function setModuleTarget(callerId, slot, targetId) {}
export function clearModuleTarget(callerId, slot) {}
export function setModuleTargetCoordinates(callerId, slot, x, y, z) {}
export function clearModuleTargetCoordinates(callerId, slot) {}

// slots are just for convenience, modules can be managed by ID as well
export function setSlot(callerId, slot, moduleId) {}
export function clearSlot(callerId, slot) {}

// Higher level functions, they essentially are helper functions that call
// the lower level functions above:
export function setForwardThrust(callerId, power) {}
export function setBackwardThrust(callerId, power) {}
export function setLateralThrust(callerId, power) {}

export function setRotationTarget(callerId, pitch, yaw, roll) {}
export function setTurnRate(callerId, pitchRate, yawRate, rollRate) {}

export function setCourse(callerId, x, y, z) {}

export function alignToVector(callerId, x, y, z) {}
export function alignToEntity(callerId, entityId) {}

export function setWarpTarget(callerId, entityId) {}
export function engageWarp(callerId) {}
export function disengageWarp(callerId) {}

export function getWarpTarget(callerId) {}
export function getWarpStatus(callerId) {}
export function getPosition(callerId) {}
export function getVelocity(callerId) {}
export function getRotation(callerId) {}

export function scan(callerId, slot, range, classification) {}
export function getLocalMap(callerId) {}

export function broadcast(callerId, message, range, slot) {}

export function getAllCargo(callerId) {}
export function acceptCargo(callerId, cargoId) {}
export function jettisonCargo(callerId, cargoId) {}
export function requestDocking(callerId, entityId) {}

export function fireWeapon(callerId, slot, targetId) {}
export function fireWeaponAtCoordinates(callerId, slot, x, y, z) {}
export function activateShield(callerId) {}
export function deactivateShield(callerId) {}
export function getShieldStatus(callerId) {}

// affects the effectiveness of slots like weapons, shields, scanners, etc.
export function routePower(callerId, system, amount) {}

// crafting and research
export function researchMaterial(callerId, materialId) {}
export function manufactureItem(callerId, schematicId, quantity) {}
export function synthesizeMaterial(callerId, schematicId, quantity) {}

export function getAllSchematics(callerId) {}
