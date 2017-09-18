module.exports = {
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
            var structure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                // the second argument for findClosestByPath is an object which takes
                // a property called filter which can be a function
                // we use the arrow operator to define it
                filter: (s) => (s.structureType == STRUCTURE_SPAWN
                             // || s.structureType == STRUCTURE_EXTENSION
                             || s.structureType == STRUCTURE_TOWER)
                             && s.energy < s.energyCapacity
            });

            if (structure == undefined) {
                structure = creep.room.storage;
                //  _.filter(Object.keys(creep.room.storage.store), resource => creep.room.storage.store[resource] > 0)
                // let otherResource = creep.pos.carry(FIND_DROPPED_RESOURCES,{
                //     filter: (r) =>(r.resourceType == RESOURCE_CATALYST
                //         || r.resourceType == RESOURCE_GHODIUM_OXIDE
                //         || r.resourceType == RESOURCE_HYDROGEN
                //         || r.resourceType == RESOURCE_ZYNTHIUM
                //         || r.resourceType == RESOURCE_HYDROXIDE
                //         || r.resourceType == RESOURCE_KEANIUM
                //         || r.resourceType == RESOURCE_LEMERGIUM
                //     )
                // });


            }

            // if we found one
            if (structure != undefined) {
                // try to transfer energy, if it is not in range
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure,{visualizePathStyle: {stroke: '#ff0b00'}});
                    creep.say('Transfer');
                }
                const otherResource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                if(otherResource) {
                    if (creep.transfer(structure, otherResource) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        creep.moveTo(structure);
                        creep.say('OtherResource');
                    }
                }
            }
        }
        // if creep is supposed to get energy
        else {

            // var droppedResources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,{
            //     filter: (r) => r.resourceType == RESOURCE_ENERGY
            // });
            if(dropedEnergy) {
                if(creep.pickup(dropedEnergy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropedEnergy,{visualizePathStyle: {stroke: '#45ff0c'}});
                    creep.say('PickUp');
                }
            }

            /**
             * improve
             */
            // else {
            //     if(creep.pickup(!droppedResources) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(!droppedResources,{visualizePathStyle: {stroke: '#9c92ff'}});
            //         creep.say('otherResource');
            //     }
            // }
        }
    }
};