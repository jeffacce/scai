var helperFunctions = require('helperFunctions');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep, targetSource) {
        if(!creep.memory.harvesting && creep.carry.energy == 0) {
	        creep.memory.harvesting = true;
	        creep.say('Harvest.');
        }
        if(creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
            creep.say('Deposit.');
        }
        
	    if(creep.memory.harvesting) {
            var target = targetSource;
            var harvestError = creep.harvest(target);
            if (harvestError == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else if (harvestError != 0) {
                helperFunctions.prettyError(creep, harvestError, true);
            }
        }
        else {
            var linksNearToMe = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_LINK && structure.pos.isNearTo(creep);
                    }
            })
            
            var linksInRangeToTargetSource = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_LINK && structure.pos.inRangeTo(targetSource, 3);
                    }
            })
            
            var emptyExtensions = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        if (structure.structureType == STRUCTURE_EXTENSION) {
                                return structure.energy < structure.energyCapacity;
                            }
                        return false;
                    }
            });
            var emptySpawns = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        if (structure.structureType == STRUCTURE_SPAWN) {
                            return structure.energy < structure.energyCapacity;
                        }
                        return false;
                    }
            });
            var emptyTowers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        if (structure.structureType == STRUCTURE_TOWER) {
                            return structure.energy < structure.energyCapacity * 0.5;
                        }
                    }
            });
            var emptyContainers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        if (structure.structureType == STRUCTURE_CONTAINER) {
                            return structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                        }
                        return false;
                    }
            });
            var emptyStorages = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        if (structure.structureType == STRUCTURE_STORAGE) {
                            return structure.store[RESOURCE_ENERGY] < structure.storeCapacity; // can code an energy storage max
                        }
                    }
            });
            
            var carrierCount = creep.room.find(FIND_CREEPS, {
                    filter: (creep) => {
                        if (creep.my) {
                            return creep.memory.role == 'carrier'
                        };
                    }
            }).length;
            
            if (carrierCount == 0) {
    
                var targets =   emptyExtensions.concat(
                                emptySpawns,
                                emptyTowers,
                                linksNearToMe,
                                linksInRangeToTargetSource, 
                                emptyContainers, 
                                emptyStorages); // prioritizes
            
            } else {
                var targets =   linksNearToMe.concat(
                                linksInRangeToTargetSource, 
                                emptyStorages, 
                                emptyContainers); // because there's a working carrier
            }     
                
            
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
        
        var positions = [
            new RoomPosition(creep.pos.x - 1,   creep.pos.y - 1,    creep.pos.roomName),
            new RoomPosition(creep.pos.x,       creep.pos.y - 1,    creep.pos.roomName),
            new RoomPosition(creep.pos.x + 1,   creep.pos.y - 1,    creep.pos.roomName),
            new RoomPosition(creep.pos.x - 1,   creep.pos.y,        creep.pos.roomName),
            new RoomPosition(creep.pos.x,       creep.pos.y,        creep.pos.roomName),
            new RoomPosition(creep.pos.x + 1,   creep.pos.y,        creep.pos.roomName),
            new RoomPosition(creep.pos.x - 1,   creep.pos.y + 1,    creep.pos.roomName),
            new RoomPosition(creep.pos.x,       creep.pos.y + 1,    creep.pos.roomName),
            new RoomPosition(creep.pos.x + 1,   creep.pos.y + 1,    creep.pos.roomName),
        ];
        for(var key in positions) {
            position = positions[key];
            var found = position.lookFor(LOOK_ENERGY);
            if (found.length > 0) {
                var target = found[0];
                creep.pickup(target);
            }
        };
	}
};

module.exports = roleHarvester;