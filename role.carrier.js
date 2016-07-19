var roleCarrier = {};

roleCarrier.run = function(creep, linkMaster) {
    //linkMaster hard coded for now. needs to be refactored into roomController/storageController.
    
    if (!creep.memory.fetch && creep.carry.energy == 0) {
        creep.memory.fetch = true;
        creep.say('Fetch.');
    }
    if (creep.memory.fetch && creep.carry.energy == creep.carryCapacity) {
        creep.memory.fetch = false;
        creep.say('Deposit.');
    }
    
    if (creep.memory.fetch) {
        var links = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_LINK;
                }
        }).sort(sortByRangeToCreep);
        var nonEmptyStorages = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    if (structure.structureType == STRUCTURE_STORAGE) {
                        return structure.store[RESOURCE_ENERGY] > 0;
                    }
                }
        }).sort(sortByRangeToCreep);
        var nonEmptyContainers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    if (structure.structureType == STRUCTURE_CONTAINER) {
                        return structure.store[RESOURCE_ENERGY] > 0;
                    }
                    return false;
                }
        }).sort(sortByRangeToCreep);
        
        if (linkMaster.energy > 0) {
            var targets = [linkMaster].concat(nonEmptyStorages, nonEmptyContainers);
            creep.memory.fetchFromStorages = false;
        } else {
            var targets = [];
            creep.memory.fetchFromStorages = true;
            var targets = nonEmptyStorages.concat(nonEmptyContainers);
        }
        
        if (targets.length > 0) {
            var target = targets[0];
        } else {
            creep.memory.fetch = false;
            creep.memory.fetchFromStorages = false;
            creep.say('Deposit.');
        }
        
        if (!creep.pos.isNearTo(target)) {
            creep.moveTo(target);
        } else {
            creep.withdraw(target, RESOURCE_ENERGY);
        }
    } else {
        
        function sortCreepsByEnergyAndRange (a,b) {
            return 30*(a.carry.energy/a.carryCapacity - b.carry.energy/b.carryCapacity) + 0.7*(creep.pos.getRangeTo(a.pos) - creep.pos.getRangeTo(b.pos));
        }
        function sortByRangeToCreep (a,b) {
            return creep.pos.getRangeTo(a.pos) - creep.pos.getRangeTo(b.pos);
        }
        
        var emptyStorages = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    if (structure.structureType == STRUCTURE_STORAGE) {
                        return structure.store[RESOURCE_ENERGY] < structure.storeCapacity; // can code an energy storage max
                    }
                }
        });
        var emptyContainers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    if (structure.structureType == STRUCTURE_CONTAINER) {
                        return _.sum(structure.store) < structure.storeCapacity;
                    }
                    return false;
                }
        }).sort(sortByRangeToCreep);
        var emptyExtensions = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    if (structure.structureType == STRUCTURE_EXTENSION) {
                            return structure.energy < structure.energyCapacity;
                        }
                    return false;
                }
        }).sort(sortByRangeToCreep);
        var emptySpawns = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    if (structure.structureType == STRUCTURE_SPAWN) {
                        return structure.energy < structure.energyCapacity;
                    }
                    return false;
                }
        }).sort(sortByRangeToCreep);
        var emptyTowers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    if (structure.structureType == STRUCTURE_TOWER) {
                        return structure.energy < structure.energyCapacity * 0.5;
                    }
                }
        }).sort(sortByRangeToCreep);
        var emptyConsumerCreeps = creep.room.find(FIND_CREEPS, {
                filter: (creep) => {
                    if (creep.my) {
                        if (creep.memory.role != 'harvester' && creep.memory.role != 'recycle' && creep.memory.role != 'carrier') {
                            return creep.carry.energy < creep.carryCapacity * 0.9;
                        };
                    }
                }
        });
        
        emptyConsumerCreeps.sort(sortCreepsByEnergyAndRange);
        var targets =   emptyExtensions.concat(
                        emptySpawns,
                        emptyTowers,
                        emptyConsumerCreeps,
                        emptyStorages,
                        emptyContainers);
        if (linkMaster.energy > 500) {
            targets = emptyContainers.concat(
                        emptyStorages,
                        targets);
        }
        
        if(targets.length > 0) {
            var target = targets[0];
            var transferError = creep.transfer(target, RESOURCE_ENERGY);
            if (transferError == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else if (transferError == 0) {
                if (!creep.pos.isNearTo(target[1])) {
                    creep.moveTo(target);
                }
            }
        }
    }
};

module.exports = roleCarrier;