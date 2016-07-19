var linkRoutine = {

    /** @param {Creep} creep **/
    run: function(link, master) {

        if (link != master) {
            if (master.energy < 790) {
                link.transferEnergy(master);
            }
        }
        
        if(link.energy > 0) {
            var positions = [
                new RoomPosition(link.pos.x - 1,   link.pos.y - 1,    link.pos.roomName),
                new RoomPosition(link.pos.x,       link.pos.y - 1,    link.pos.roomName),
                new RoomPosition(link.pos.x + 1,   link.pos.y - 1,    link.pos.roomName),
                new RoomPosition(link.pos.x - 1,   link.pos.y,        link.pos.roomName),
                new RoomPosition(link.pos.x,       link.pos.y,        link.pos.roomName),
                new RoomPosition(link.pos.x + 1,   link.pos.y,        link.pos.roomName),
                new RoomPosition(link.pos.x - 1,   link.pos.y + 1,    link.pos.roomName),
                new RoomPosition(link.pos.x,       link.pos.y + 1,    link.pos.roomName),
                new RoomPosition(link.pos.x + 1,   link.pos.y + 1,    link.pos.roomName),
            ];
            for (var i in positions) {
                position = positions[i];
                var found = position.lookFor(LOOK_CREEPS, {
                        filter: (creep) => {
                            return creep.my;
                        }
                });
                if (found.length > 0) {
                    var target = found[0];
                    if (target.memory.role != 'harvester' && target.carry.energy < target.carryCapacity) {
                        link.transferEnergy(target);
                        return;
                    }
                }
            };
        };
	}
};

module.exports = linkRoutine;