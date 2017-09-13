/**
 * spawn type
 */
require('prototype.spawn')();

/**
 * roles
 */
var roleFarmer = require('role.farmer');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWallRepairer = require('role.wallRepairer');

/**
 * set the home as 5 and target address as 1-9
 *
 */
var HOME = 'E32N42';
var ROOM1 = 'E31N43';
var ROOM2 = 'E32N43';
var ROOM3 = 'E33N43';
var ROOM4 = 'E31N42';
var ROOM6 = 'E33N42';
var ROOM7 = 'E31N41';
var ROOM8 = 'E32N41';
var ROOM9 = 'E33N41';

module.exports.loop = function () {
    // check for memory entries of died creeps by iterating over Memory.creeps
    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
            console.log("name: " + name + " Delete.")
            delete Memory.creeps[name];
        }
    }

    // set container store energy
    for (let container in Game.container){
        container.store[RESOURCE_ENERGY];
    }

    for (let name in Game.creeps){
        var creep = Game.creeps[name];

        // if creep is harvester, call harvester script
        if (creep.memory.role == 'farmer') {
            roleFarmer.run(creep);
        }
        // if creep is upgrader, call upgrader script
        else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        // if creep is builder, call builder script
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        // if creep is repairer, call repairer script
        else if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        // if creep is wallRepairer, call wallRepairer script
        else if (creep.memory.role == 'wallRepairer') {
            roleWallRepairer.run(creep);
        }
    }

    var maxNumOfHomeWorkers = 6;

    var maxNumOfHomeFarmers = 3;
    var maxNumOfHomeUpgraders = 2;
    var maxNumOfHomeBuilders = 1;
    var maxNumOfHomerepairers = 1;
    var maxNumOfHomeWallRepairers = 1;

    var maxNumOfROOM1Farmers = 0;
    var maxNumOfROOM2Farmers = 6;
    var maxNumOfROOM3Farmers = 4;
    var maxNumOfROOM4Farmers = 0;
    var maxNumOfROOM6Farmers = 6;
    var maxNumOfROOM7Farmers = 0;
    var maxNumOfROOM8Farmers = 0;
    var maxNumOfROOM9Farmers = 4;


    var numOfHomeFarmers = _.sum(Game.creeps, (c) => c.memory.role == 'farmer' && c.memory.target == 'E32N42');
    var numOfROOM1Farmers = _.sum(Game.creeps, (c) => c.memory.role == 'farmer' && c.memory.target == 'E31N43');
    var numOfROOM2Farmers = _.sum(Game.creeps, (c) => c.memory.role == 'farmer' && c.memory.target == 'E32N43');
    var numOfROOM3Farmers = _.sum(Game.creeps, (c) => c.memory.role == 'farmer' && c.memory.target == 'E33N43');
    var numOfROOM4Farmers = _.sum(Game.creeps, (c) => c.memory.role == 'farmer' && c.memory.target == 'E31N42');
    var numOfROOM6Farmers = _.sum(Game.creeps, (c) => c.memory.role == 'farmer' && c.memory.target == 'E33N42');
    var numOfROOM7Farmers = _.sum(Game.creeps, (c) => c.memory.role == 'farmer' && c.memory.target == 'E31N41');
    var numOfROOM8Farmers = _.sum(Game.creeps, (c) => c.memory.role == 'farmer' && c.memory.target == 'E32N41');
    var numOfROOM9Farmers = _.sum(Game.creeps, (c) => c.memory.role == 'farmer' && c.memory.target == 'E33N41');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader'&& c.memory.target == 'E32N42');
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder'&& c.memory.target == 'E32N42');
    var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer'&& c.memory.target == 'E32N42');
    var numberOfWallRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'wallRepairer'&& c.memory.target == 'E32N42');
    var currentNumOfHomeWorkers = numOfHomeFarmers+numberOfUpgraders+numberOfBuilders+numberOfRepairers+numberOfWallRepairers;

    var energy = Game.spawns.Jbase.room.energyCapacityAvailable;
    var energyUrgent = Game.spawns.Jbase.room.energyAvailable;
    var name = undefined;
    var workParts = 1;

    if(energy > 300){
        workParts = Math.floor(energy / 260);
    }

    // if not enough home farmers
    // if(currentNumOfHomeWorkers < maxNumOfHomeWorkers){
        /**
         * try to spawn home workers
         */
        if (numOfHomeFarmers < maxNumOfHomeFarmers){
            name = Game.spawns.Jbase.worker(energy, 'farmer', workParts, 'E32N42', 'E32N42');
            // if spawning failed and we have no harvesters left
            if (numOfHomeFarmers == 0) {
                // spawn one with what is available
                name = Game.spawns.Jbase.worker(energyUrgent, 'farmer', 1, 'E32N42', 'E32N42');
            }
        }
        // if not enough upgraders
        else if (numberOfUpgraders < maxNumOfHomeUpgraders) {
            // try to spawn one
            name = Game.spawns.Jbase.worker(energy, 'upgrader', workParts, 'E32N42', 'E32N42');
        }
        // if not enough repairers
        else if (numberOfRepairers < maxNumOfHomerepairers) {
            // try to spawn one
            name = Game.spawns.Jbase.worker(energy, 'repairer', workParts, 'E32N42', 'E32N42');
        }
        // if not enough builders
        else if (numberOfBuilders < maxNumOfHomeBuilders) {
            // try to spawn one
            name = Game.spawns.Jbase.worker(energy, 'builder', workParts, 'E32N42', 'E32N42');
        }
        // if not enough wallRepairers
        else if (numberOfWallRepairers < maxNumOfHomeWallRepairers) {
            // try to spawn one
            name = Game.spawns.Jbase.worker(energy, 'wallRepairer', workParts, 'E32N42', 'E32N42');
        }
        // room2 farmer
        else if (numOfROOM2Farmers < maxNumOfROOM2Farmers) {
            // try to spawn one
            name = Game.spawns.Jbase.worker(energy, 'farmer', workParts, 'E32N42', 'E32N43');
        }
        // room4 farmer
        else if (numOfROOM4Farmers < maxNumOfROOM4Farmers) {
            // try to spawn one
            name = Game.spawns.Jbase.worker(energy, 'farmer', workParts, 'E32N42', 'E31N42');
        }
        // room1 farmer
        else if (numOfROOM1Farmers < maxNumOfROOM1Farmers) {
            // try to spawn one
            name = Game.spawns.Jbase.worker(energy, 'farmer', workParts, 'E32N42', 'E31N43');
        }
        // room3 farmer
        else if (numOfROOM3Farmers < maxNumOfROOM3Farmers) {
            // try to spawn one
            name = Game.spawns.Jbase.worker(energy, 'farmer', workParts, 'E32N42', 'E33N43');
        }
        // room6 farmer
        else if (numOfROOM6Farmers < maxNumOfROOM6Farmers) {
            // try to spawn one
            name = Game.spawns.Jbase.worker(energy, 'farmer', workParts, 'E32N42', 'E33N42');
        }
        // room7 farmer
        else if (numOfROOM7Farmers < maxNumOfROOM7Farmers) {
            // try to spawn one
            name = Game.spawns.Jbase.worker(energy, 'farmer', workParts, 'E32N42', 'E31N41');
        }
        // room8 farmer
        else if (numOfROOM8Farmers < maxNumOfROOM8Farmers) {
            // try to spawn one
            name = Game.spawns.Jbase.worker(energy, 'farmer', workParts, 'E32N42', 'E32N41');
        }
        // room9 farmer
        else if (numOfROOM9Farmers < maxNumOfROOM9Farmers) {
            // try to spawn one
            name = Game.spawns.Jbase.worker(energy, 'farmer', workParts, 'E32N42', 'E33N41');
        }
        // all full then spawn home builder
        else{
            name = -1;
        }
    // }

    // find all towers
    var towers = Game.rooms[HOME].find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_TOWER
    });
    // for each tower
    for (let tower of towers) {
        // find closes hostile creep
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        // if one is found...
        if (target != undefined) {
            // ...FIRE!
            tower.attack(target);
        }
    }

    if (!(name < 0)) {
        console.log("Spawned new creep: " + name + "\tRole:" + creep.memory.role + "\tTarget:" + creep.memory.target);
    }
};