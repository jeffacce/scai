var roleBuilder = {};

roleBuilder.run = function(creep) {
        
    if(creep.memory.building && creep.carry.energy == 0) {
        creep.memory.building = false;
        creep.say("I'm empty.");
    }
    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
        creep.memory.building = true;
        creep.say('Building.');
    }

    if(creep.memory.building) {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(targets.length) {
            var target = targets[0];
            if (!creep.pos.isNearTo(target)) {
                creep.moveTo(target);
            } else {
                creep.build(target);
            }
        }
    } else {
        var sources = creep.room.find(FIND_SOURCES);
        var storages = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE);
                }
        });
        var nonEmptyStorages = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    if (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) {
                        return structure.store[RESOURCE_ENERGY] > 0;
                    }
                    return false;
                }
        });
        var storagesEnergy = [];
        for (key in nonEmptyStorages) {
            tempStorage = nonEmptyStorages[key];
            storagesEnergy.push(tempStorage.store[RESOURCE_ENERGY]);
        }
        var availableStoredEnergy = _.sum(storagesEnergy);
        
        if (availableStoredEnergy >= creep.carryCapacity) {
            if (!creep.pos.isNearTo(nonEmptyStorages[0])) {
                creep.moveTo(nonEmptyStorages[0]);
            }
        } else {
            if (storages.length == 0) {
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            } else {
                var target = storages[0];
                if (!creep.pos.isNearTo(target)) {
                    creep.moveTo(target);
                } else {
                    creep.withdraw(target, RESOURCE_ENERGY);
                }
            }
        };
    }

};

module.exports = roleBuilder;