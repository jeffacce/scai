var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        const CONST_WALL_REPAIR_MAX = 50000;
        const CONST_RAMPART_REPAIR_MAX = 50000;
        
        if (!creep.memory.target) {
            var damagedStructures = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.hits < structure.hitsMax * 0.8 && structure.structureType != STRUCTURE_RAMPART && structure.structureType != STRUCTURE_WALL);
                        }
                });
            var walls = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_WALL && structure.hits < CONST_WALL_REPAIR_MAX);
                        }
                });
            var repairTargets = damagedStructures.concat(walls);
            if (repairTargets.length > 0) {
                creep.memory.repairTarget = repairTargets[0];
                creep.memory.repairTargetOriginalHits = repairTargets[0].hits;
                creep.say(repairTargets[0].pos + '.');
            }
        } else {
            repairTarget = Game.getObjectById(creep.memory.repairTarget.id); // seems to be a game problem (storing into memory messes with object possibly)
            // has to convert the memorized target into a variable by doing this, otherwise complains invalid object (-7)
            if(creep.memory.repairing && creep.carry.energy == 0) {
                creep.memory.repairing = false;
                creep.say("I'm empty.");
    	    }
    	    if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
    	        creep.memory.repairing = true;
    	        creep.say('Repairing.');
    	    }
    	    
    	    if(creep.memory.repairing) {
    	        if(creep.repair(repairTarget) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairTarget);
                } else {
                    var repairProgress = (repairTarget.hits - creep.memory.repairTargetOriginalHits) / (repairTarget.hitsMax * 0.95 - creep.memory.repairTargetOriginalHits);
                    if (repairProgress > 1) {
                        repairProgress = 'Done.';
                    } else {
                        repairProgress = parseInt(repairProgress * 100) + '%.';
                    }
                    creep.say(repairProgress); // refactor the 0.8's and 0.95's throughout the code
                }
    	    }
    	    else {
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
                        if (!creep.pos.isNearTo(storages[0])) {
                            creep.moveTo(storages[0]);
                        } else {
                            creep.withdraw(storages[0], RESOURCE_ENERGY);
                        }
                    }
                };
    	    }
    	    
    	    if (repairTarget.structureType == STRUCTURE_RAMPART) {
    	        if (repairTarget.hits >= CONST_RAMPART_REPAIR_MAX) {creep.memory.repairTarget = false};
    	    } else if (repairTarget.structureType == STRUCTURE_WALL) {
    	        if (repairTarget.hits >= CONST_WALL_REPAIR_MAX) {creep.memory.repairTarget = false};
    	    } else if (repairTarget.hits >= repairTarget.hitsMax * 0.95){
        	    creep.memory.repairTarget = false; // should find another target. it's wasting a tick here.
    	    }
        }
	}
};

module.exports = roleRepairer;