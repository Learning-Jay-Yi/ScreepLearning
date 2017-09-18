/**
 * a function for harvest role
 *      if target set as home then working at home
 *      else move to other room to work.
 **/

var roleBuilder = require('role.builder');

module.exports = {
    run: function(creep) {
        // set source


        // if creep is bringing energy to a structure but has no energy left
        // working == moving
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // need to transfer resource
        if (creep.memory.working == true) {
            // if creep move from other room
            if (creep.room.home == creep.memory.home) {
                // creep find a structure
                // set structure
                var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_SPAWN ||
                        s.structureType == STRUCTURE_EXTENSION ||
                        s.structureType == STRUCTURE_TOWER)
                        && s.energy < s.energyCapacity
                });

                // if (structure == undefined) {
                //     structure = creep.room.storage;
                // }

                // if we found one
                if (structure != undefined) {
                    // try to transfer energy, if it is not in range
                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        creep.moveTo(structure);
                    }
                }
                else {
                    roleBuilder.run(creep);
                }
            } else {
                // find the way to go home
                var exit = creep.room.findExitTo(creep.memory.home);
                // if (creep.pos.name != creep.memory.home && creep.pos.name != creep.memory.target) {
                    creep.moveTo(creep.pos.findClosestByRange(exit),
                        {visualizePathStyle: {stroke: '#ffaa00'}});
                // }
            }
        }
        // need to find a room to harvest
        else {
            // if creep in the target room
            var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            if (creep.room.name == creep.memory.target) {
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source,{visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                var exit = creep.room.findExitTo(creep.memory.target);
                // if (creep.pos.name != creep.memory.home && creep.pos.name != creep.memory.target) {
                    creep.moveTo(creep.pos.findClosestByRange(exit),{visualizePathStyle: {stroke: '#ffaa00'}});
                // }
            }
        }
    }
};





