/**
 * a function for harvest role
 *      if target set as home then working at home
 *      else move to other room to work.
 **/

var roleBuilder = require('role.builder');

module.exports = {
    run: function(creep) {


        let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
        });

        // set structure
        var structure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_SPAWN ||
                s.structureType == STRUCTURE_EXTENSION ||
                s.structureType == STRUCTURE_CONTAINER ||
                s.structureType == STRUCTURE_TOWER)
                && s.energy < s.energyCapacity
        });
        // set source
        var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);




        //findClosestByRange(FIND_SOURCES_ACTIVE);


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


        // working at home room
        if (creep.memory.target == creep.room.home) {
            // if creep need to transfer source
            if (creep.memory.working == true) {
                // and creep find our structure
                if (structure != undefined) {
                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        // move to it
                        creep.moveTo(structure,{visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }else {
                    roleBuilder.run(creep);
                }

            } else {
                // try to harvest it
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source,{visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
        // working at other rooms
        else {
            // need to transfer resource
            if (creep.memory.working == true) {
                // if creep move from other room
                if (creep.room.name == creep.memory.home) {
                    // creep find a structure
                    if (structure != undefined) {
                        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            // move to it
                            creep.moveTo(structure,{visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }else {
                        roleBuilder.run(creep);
                    }
                } else {
                    // find the way to go home
                    var exit = creep.room.findExitTo(creep.memory.home);
                    if (creep.pos.name != creep.memory.home && creep.pos.name != creep.memory.target) {
                        creep.moveTo(creep.pos.findClosestByPath(exit),{visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
            // need to find a room to harvest
            else {
                // if creep in the target room
                if (creep.room.name == creep.memory.target) {
                    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source,{visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                } else {
                    var exit = creep.room.findExitTo(creep.memory.target);
                    if (creep.pos.name != creep.memory.home && creep.pos.name != creep.memory.target) {
                        creep.moveTo(creep.pos.findClosestByPath(exit),{visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            }
        }
    }
};





