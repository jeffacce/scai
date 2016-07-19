var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleCarrier = require('role.carrier');
var roleClaimer = require('role.claimer');
var roleMeleeAttacker = require('role.meleeAttacker');
var containerRoutine = require('containerRoutine');
var towerRoutine = require('towerRoutine');
var linkRoutine = require('linkRoutine');
var helperFunctions = require('helperFunctions');

module.exports.loop = function () {
    
    helperFunctions.garbageCollection();
    
    var prioritizedSpawnList_0 = [
        ['harvester', 3, 'w1c1m1'],
    ]; // start, rcl 1
    var prioritizedSpawnList_1 = [
        ['harvester', 3, 'w2c2m2'], 
        ['upgrader', 2, 'w2c2m2'],
        ['builder', 2, 'w2c2m2'],
        ['repairer', 0, 'w2c2m2'],
    ]; // extensions built, rcl 2
    var prioritizedSpawnList_2 = [
        ['harvester', 3, 'w3c3m3'], // 7
        ['upgrader', 0, 'w4c2m3'], // 3
        ['builder', 0, 'w4c2m3'], // 1
        ['repairer', 0, 'w3c3m3'],
    ]; // more extensions built, rcl 3
    var prioritizedSpawnList_3 = [
        ['harvester', 5, 'w4c4m4'],
        ['upgrader', 2, 'w6c3m5'],
        ['builder', 1, 'w4c4m4'],
        ['repairer', 0, 'w5c3m4'],
    ]; // more extensions built, rcl 4
    var prioritizedSpawnList_4 = [
        ['harvester', 2, 'w6c6m6'],
        ['carrier', 2, 'c6m3'],
        ['upgrader', 2, 'w8c4m6'],
        ['builder', 1, 'w1c1m1'],
    ]; // links and more extensions built, rcl 5
    
    // refactor into room population controller
    
    var prioritizedSpawnList = prioritizedSpawnList_4;
    
    console.log('===============================');
    
    var dyingCreep = helperFunctions.getNextExpectedDeath();
    console.log('Next death: ' + dyingCreep.name + ' in ' + dyingCreep.ticksToLive + ' tick(s).');
    
    var ptr = 0;
    while (ptr < prioritizedSpawnList.length) {
        var spawnRole = prioritizedSpawnList[ptr][0]
        var spawnNum = prioritizedSpawnList[ptr][1]
        var spawnBody = prioritizedSpawnList[ptr][2]
        var currentNum = _.filter(Game.creeps, (creep) => creep.memory.role == spawnRole).length;
        console.log(spawnRole + ': ' + currentNum + '/' + spawnNum);
        if (currentNum < spawnNum) {
            var spawnName = spawnRole + '_' + String(Math.random()).substring(2, 5);
            var spawn = Game.spawns.Spawn1;
            var spawnError = spawn.createCreep(helperFunctions.creepBodyArray(spawnBody), spawnName, {role: spawnRole});
            if (spawnError == spawnName) {
                break;
            } else {
                if (spawnError != -4) {
                    helperFunctions.prettyError(spawn, spawnError, true);
                }
            }
        }
        ptr++;
    }
    
    if (Game.spawns.Spawn1.spawning != null) {
        console.log('Spawning ' + Game.spawns.Spawn1.spawning.name + ' in ' + Game.spawns.Spawn1.spawning.remainingTime + ' tick(s).');
    }
    
    // !! hard coded part
    var sourceHarvesterCounts = [0, 0]; 
    const sourceHarvesterCountConfigs = [1, 1];
    const linkMaster = Game.getObjectById('57733803b05aca4841f1e8d6'); // !! obviously not robust for multiple rooms.
   
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        if(creep.my) {
        
            if(creep.ticksToLive <= 30 && creep.carry.energy > 0) {
                creep.memory.role = 'recycle';
            }
            
            if(creep.memory.role == 'recycle') {
                creep.say('Recycle.');
                var emptyContainers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        if (structure.structureType == STRUCTURE_CONTAINER) {
                            return structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                        }
                    }
                });
                creep.moveTo(emptyContainers[0]);
                if (creep.pos.inRangeTo(emptyContainers[0], 0)) {
                    creep.suicide();
                }
            }
            
            if(creep.memory.role == 'harvester') {
                var sources = creep.room.find(FIND_SOURCES);
                
                // !! temporary hard-coded part, need to be more flexible
                
                for (var i in sourceHarvesterCounts) {
                    if (sourceHarvesterCounts[i] < sourceHarvesterCountConfigs[i]) {
                        targetSource = sources[i];
                        sourceHarvesterCounts[i]++;
                        break;
                    }
                }
                // var targetSource = sources[0];
                roleHarvester.run(creep, targetSource);
                
                // /end of hard-coded part
            }
            if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            if(creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
            if(creep.memory.role == 'repairer') {
                roleRepairer.run(creep);
            }
            if(creep.memory.role == 'carrier') {
                roleCarrier.run(creep, linkMaster);
            }
            if(creep.memory.role == 'claimer') {
                roleClaimer.run(creep);
            }
        }
    }
    
    for(var key in Game.rooms) {
    
        var tempRoom = Game.rooms[key];
        var containers = tempRoom.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER;
            }
        });
        var storageTank = tempRoom.storage;
        var containersEnergy = [];
        
        var availableStoredEnergy;
        
        if (containers.length > 0) {
            for (var i in containers) {
                tempContainer = containers[i];
                containersEnergy.push(tempContainer.store[RESOURCE_ENERGY]);
            }
        }
        if (storageTank != null) {
            containerRoutine.run(storageTank);
            availableStoredEnergy = _.sum(containersEnergy) + storageTank.store[RESOURCE_ENERGY];
        }
        console.log(tempRoom + ' stored energy: ' + availableStoredEnergy);
        // /bad code reuse, also changed variables names from storagesEnergy to containersEnergy, inconsistent
        
        for (var i in containers) {
            var container = containers[i];
            containerRoutine.run(container);
        };
    
        var towers = tempRoom.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_TOWER;
            }
        });
        for (var i in towers) {
            var tower = towers[i];
            towerRoutine.run(tower);
        }
        
        var links = tempRoom.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_LINK;
            }
        });
        for (var i in links) {
            var link = links[i];
            linkRoutine.run(link, linkMaster);
        }
        
        var constructions = tempRoom.find(FIND_CONSTRUCTION_SITES);
        var constructionEnergyRequired = 0;
        for (var i in constructions) {
            var constructionSite = constructions[i];
            constructionEnergyRequired += constructionSite.progressTotal - constructionSite.progress;
        }
        if (constructionEnergyRequired > 0) {
            console.log(tempRoom + ' construction sites need ' + constructionEnergyRequired + ' energy.');
        }
    }
}