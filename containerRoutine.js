var containerRoutine = {

    /** @param {Creep} creep **/
    run: function(container) {

        if(container.store[RESOURCE_ENERGY] > 0) {
            var positions = [
                new RoomPosition(container.pos.x - 1,   container.pos.y - 1,    container.pos.roomName),
                new RoomPosition(container.pos.x,       container.pos.y - 1,    container.pos.roomName),
                new RoomPosition(container.pos.x + 1,   container.pos.y - 1,    container.pos.roomName),
                new RoomPosition(container.pos.x - 1,   container.pos.y,        container.pos.roomName),
                new RoomPosition(container.pos.x,       container.pos.y,        container.pos.roomName),
                new RoomPosition(container.pos.x + 1,   container.pos.y,        container.pos.roomName),
                new RoomPosition(container.pos.x - 1,   container.pos.y + 1,    container.pos.roomName),
                new RoomPosition(container.pos.x,       container.pos.y + 1,    container.pos.roomName),
                new RoomPosition(container.pos.x + 1,   container.pos.y + 1,    container.pos.roomName),
            ];
            var creepsNearMe = false;
            for (var i in positions) {
                position = positions[i];
                var found = position.lookFor(LOOK_CREEPS, {
                        filter: (creep) => {
                            return creep.my;
                        }
                });
                if (found.length > 0) {
                    creepsNearMe = true;
                    var target = found[0];
                    var transferScheduled = false;
                    if (target.memory.role != 'harvester' && target.carry.energy < target.carryCapacity)
                    {
                        if (target.memory.role != 'carrier') {
                            transferScheduled = true;
                        } else if (target.memory.fetch && target.memory.fetchFromStorages) {
                            transferScheduled = true;
                        }
                    }
                    if (transferScheduled) {
                        container.transfer(target, RESOURCE_ENERGY);
                        break;
                    }
                }
            };
            
            return;
            
            if (!creepsNearMe) {
                for (var i in positions) {
                    position = positions[i];
                    var found = position.lookFor(LOOK_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_CONTAINER);
                            }
                    });
                    if (found.length > 0) {
                        for (var j in found) {
                            target = found[j];
                            var difference = container.store[RESOURCE_ENERGY] - target.store[RESOURCE_ENERGY];
                            if (!difference) {
                                continue;
                            } else {
                                if (difference > 1) {
                                    container.transfer(target, RESOURCE_ENERGY, parseInt(difference / 2));
                                }
                            }
                        }
                    }
                }
            }
        };
	}
};

module.exports = containerRoutine;