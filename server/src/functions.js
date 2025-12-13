import { entities, events, tick } from "./engine.js";

// EXPORTED FUNCTIONS (USER WRITTEN PROGRAMS CAN USE, SO SENSITIVE FUNCTIONS NOT ALLOWED)

export function getTick() {
  return tick;
}
export function getStatus(_id) {}

export function setForwardThrust(_id, power) {}
export function setBackwardThrust(_id, power) {}
export function setLateralThrust(_id, power) {}

export function setRotationTarget(_id, pitch, yaw, roll) {}
export function setTurnRate(_id, pitchRate, yawRate, rollRate) {}

export function setCourse(_id, x, y, z) {}

export function alignToVector(_id, x, y, z) {}
export function alignToEntity(_id, entityId) {}

export function setWarpTarget(_id, entityId) {}
export function engageWarp(_id) {}
export function disengageWarp(_id) {}

export function getWarpTarget(_id) {}
export function getWarpStatus(_id) {}
export function getPosition(_id) {}
export function getVelocity(_id) {}
export function getRotation(_id) {}

export function scan(_id, slot, range, classification) {}
export function getLocalMap(_id) {}

export function broadcast(_id, message, range, slot) {}

export function getAllCargo(_id) {}
export function acceptCargo(_id, cargoId) {}
export function jettisonCargo(_id, cargoId) {}
export function requestDocking(_id, entityId) {}

export function fireWeapon(_id, slot, targetId) {}
export function fireWeaponAtCoordinates(_id, slot, x, y, z) {}
export function activateShield(_id) {}
export function deactivateShield(_id) {}
export function getShieldStatus(_id) {}

// affects the effectiveness of slots like weapons, shields, scanners, etc.
export function routePower(_id, system, amount) {}

// crafting and research
export function researchMaterial(_id, materialId) {}
export function manufactureItem(_id, schematicId, quantity) {}
export function synthesizeMaterial(_id, schematicId, quantity) {}

export function getAllSchematics(_id) {}

// low level module management
export function attachModule(_id, moduleId, slot) {}
export function detachModuleById(_id, moduleId) {} // goes to cargo if there is space, otherwise jettisoned
export function detachModuleBySlot(_id, slot) {} // goes to cargo if there is space, otherwise jettisoned

export function getModuleStatus(_id, slot) {}
export function getAllModules(_id) {}

export function activateModule(_id, slot) {}
export function deactivateModule(_id, slot) {}
export function activateModuleById(_id, moduleId) {}
export function deactivateModuleById(_id, moduleId) {}

export function setModuleTarget(_id, slot, targetId) {}
export function clearModuleTarget(_id, slot) {}
export function setModuleTargetCoordinates(_id, slot, x, y, z) {}
export function clearModuleTargetCoordinates(_id, slot) {}

// slots are just for convenience, modules can be managed by ID as well
export function setSlot(_id, slot, moduleId) {}
export function clearSlot(_id, slot) {}
