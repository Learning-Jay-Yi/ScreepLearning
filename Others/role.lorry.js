module.exports = {
    /**
     * More thing need to improve,
     * resourcesType != energy
     */
    // a function to run the logic for this role
    /** @param {Creep} creep */
    run: function(creep) {

        var dropedEnergy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,{
            filter: (e) => e.resourceType == RESOURCE_ENERGY
        });

        var dropedOtherResource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,{
            filter: (r) => r.resourceType != RESOURCE_ENERGY
        });

        /**
         * working status cant only identify by carry energy.
         */

        // if creep is bringing energy to a structure but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }



        // if creep is supposed to transfer energy to a structure
        if (creep.memory.working == true) {
            // find closest spawn, extension or tower which is not full
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                // the second argument for findClosestByPath is an object which takes
                // a property called filter which can be a function
                // we use the arrow operator to define it
                filter: (s) => (s.structureType == STRUCTURE_SPAWN
                             || s.structureType == STRUCTURE_EXTENSION
                             || s.structureType == STRUCTURE_TOWER)
                             && s.energy < s.energyCapacity
            });

            if (structure == undefined) {
                structure = creep.room.storage;
            }

            // if we found one
            if (structure != undefined) {
                //console.log("STRUCTURE != UNDEFINED");
                // try to transfer energy, if it is not in range

                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        creep.moveTo(structure,{visualizePathStyle: {stroke: '#fffb00'}});
                        creep.say('Transfer');
                    }

                    // else if (creep.transfer(structure,dropedOtherResource) == ERR_NOT_IN_RANGE){
                    //     creep.moveTo(structure,{visualizePathStyle: {stroke: '#fffb00'}});
                    //     creep.say('Others');
                    // }
                    // if (dropedOtherResource != undefined){
                    //     console.log("WTF");
                    //     // dropedEnergy = !dropedEnergy;
                    //     if(creep.transfer(structure, dropedOtherResource) == ERR_NOT_IN_RANGE){
                    //         creep.moveTo(structure,{visualizePathStyle: {stroke: '#ffb8ca'}});
                    //         creep.say('Other');
                    //     }
                    // }
            }
        }
        // if creep is supposed to get energy
        else {
            // find closest container
            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 300
            });

            if (container == undefined) {
                container = creep.room.storage;
            }

            // if one was found
            if (container != undefined) {
                // try to withdraw energy, if the container is not in range
                // var droppedResources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,{
                //     filter: (r) => r.resourceType == RESOURCE_ENERGY
                // });
                if(dropedEnergy) {
                    if(creep.pickup(dropedEnergy) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(dropedEnergy,{visualizePathStyle: {stroke: '#45ff0c'}});
                        creep.say('PickUp');
                    }
                }else {
                    creep.getEnergy(true,false);
                }

            }

        }
    }
};