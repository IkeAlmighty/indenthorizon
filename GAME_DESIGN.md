# Indent Horizon - Game Design

_A spaceship coding game aimed at coding hobbyists_

## Overview

Indent Horizon is a Massively Multiplayer Online Real Time Strategy and Roleplaying Game. Players code automated scripts that direct space drones to explore a virtual galaxy. **The learning curve is higher than normal games**, because it is aimed at hobbyist developers who love to code.

## Gameplay Concepts

### General Design Philosophy

Indent Horizon is a game designed for automation. With that in mind, there are no rules around how scripts are coded, except that **_scripts should not cause harm to real life people or purposefully take advantage security flaws_** in the base code. You want to run your own communication server between drones? Exchange information on the orbits and resources of celestial bodies? Feed game data to an neural net to determine the best trade route? Go for it. Get creative. Just keep the stakes in game.

### Exploration

The Indent Horizon universe consists of a numerous solar systems connected by various types of faster than light travel apparatuses. Wormholes, Deminsional Portals, and many other strange technologies connect vast solar systems together. Each solar system has hundreds or thousands of celestial bodies and NPC entities that run on similar scripts as your own little drone. Planets, comets, asteroids, and the like can be mined for resources, and systems that are occupied by NPCs or other player created drones contain markets where resources can be traded or pooled together for a larger goal.

### Communication

Each drone-ship has access to a communication array that allows it to send messages to other entities in game via plain text.

### Mining Materials

Materials from celestial bodies can be used in combination with Schematics, Factory, and Research modules to create new modules, research new schematics/modules/materials, or synthesize new materials. Here is a simple diagram depicting it:

    [ Materials ] + [ Schematics ] + [ Factory/Research Module ]
          ->
    [ NEW Materials/Schematics/Modules ]

Some materials can only be created by the Research Module by being synthesized from other materials. They follow the same pattern depicted above.

There are thousands of materials in the Indent Horizon unviverse, and even more modules.

### Researching Materials

A material can be research to create a Schematic, which is an in game item that can traded, and is required to create most modules.

### Schematics

Schematics are required for the creation of new modules & synthesized materials.

### Ship Modules and Ship Construction

Each drone-ship is made up of a number of modules. New modules can be discovered through trade, research, and of course pirating or scavenging. In order to create a module, you need to first acquire the schematic nessecary. You can reverse engineer modules by placing them in a research module, which will eventually spit out a schematic for the module.

As mentioned in the _Mining Materials_ section, there are thousands of modules to be discovered in the Indent Horizon universe, all created from different materials.

## Player API Reference

The client directs players to log in, and once logged (one session per spaceship) players can edit the `main.js` file, which contains the following base code:

    /**
      *
      * @param {typeof import("../functions.js")} ship (or entity or api)
      */
      export default async function loop(ship) {
        //  your code here

      }

The `loop` is called repeatedly by the client, with the frequency of each call being equivalent to the duration of each server tick cycle divided by the number of operations sent to the server by the script. **All players need to know is the loop function is called repeatedly**.

`ship` (or whatever else you may name it) represents the robotic space drone you are directing through the galaxy. The following list of functions are available as server operations, with descriptions of what each function does in the official documentation (pending). It should be noted that these functions may be edited/removed as the game is developed, and are not even close to the final API.

## Ship Functions

    // server utilities
    ship.getTick()

    // detailed overview of ship:
    ship.getStatus()

    // low level module management
    ship.attachModule(moduleId, slot)
    ship.detachModuleById(moduleId) // goes to cargo if there is space, otherwise jettisoned
    ship.detachModuleBySlot(slot) // goes to cargo if there is space, otherwise jettisoned

    ship.getModuleStatus(slot)
    ship.getAllModules()

    ship.activateModule(slot)
    ship.deactivateModule(slot)
    ship.activateModuleById(moduleId)
    ship.deactivateModuleById(moduleId)

    ship.setModuleTarget(slot, targetId)
    ship.clearModuleTarget(slot)
    ship.setModuleTargetCoordinates(slot, x, y, z)
    ship.clearModuleTargetCoordinates(slot)

    // slots are just for convenience, modules can be managed by ID as well
    ship.setSlot(slot, moduleId)
    ship.clearSlot(slot)

    // affects the effectiveness of slots like weapons, shields, scanners, etc.
    ship.routePower(system, amount)

    // Higher level ship management, essentially helper functions that internally
    // call the functions described above:

    ship.setForwardThrust(power)
    ship.setBackwardThrust(power)
    ship.setLateralThrust(power)

    ship.setRotationTarget(pitch, yaw, roll)
    ship.setTurnRate(pitchRate, yawRate, rollRate)

    ship.setCourse(x, y, z)

    ship.alignToVector(x, y, z)
    ship.alignToEntity(entityId)

    ship.setWarpTarget(entityId)
    ship.engageWarp()
    ship.disengageWarp()

    ship.getWarpTarget()
    ship.getWarpStatus()
    ship.getPosition()
    ship.getVelocity()
    ship.getRotation()

    ship.scan(slot, range, classification)
    ship.getLocalMap()

    ship.broadcast(message, range, slot)

    ship.getAllCargo()
    ship.acceptCargo(cargoId)
    ship.jettisonCargo(cargoId)
    ship.requestDocking(entityId)

    ship.fireWeapon(slot, targetId)
    ship.fireWeaponAtCoordinates(slot, x, y, z)
    ship.activateShield()
    ship.deactivateShield()
    ship.getShieldStatus()

    // crafting and research
    ship.researchMaterial(materialId)
    ship.manufactureItem(schematicId, quantity)
    ship.synthesizeMaterial(schematicId, quantity)

    ship.getAllSchematics()
