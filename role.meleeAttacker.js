var roleMeleeAttacker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if (creep.room != creep.memory.targetRoom) {
            creep.moveTo(creep.memory.targetRoom);
        } else {
            var enemies = creep.room.find(FIND_CREEPS, {
                        filter: (creep) => {
                            return !creep.my;
                        }
            });
            function sortEnemiesByDistance (a,b) {
                return creep.getRangeTo(a) - creep.getRangeTo(b);
            }
            enemies.sort(sortEnemiesByDistance);
            
            if (enemies.length > 0) {
                enemies.sort(sortEnemiesByDistance);
                creep.attack(enemies[0]);
            }
        }
        
        var walls = tower.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_WALL);
                    }
            });
        var ramparts = tower.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_RAMPART);
                    }
            });
    	
	}
}

module.exports = roleMeleeAttacker;