var towerRoutine = {

    /** @param {Creep} creep **/
    run: function(tower) {
        
        const CONST_WALL_REPAIR_MAX = 300000;
        const CONST_RAMPART_REPAIR_MAX = 300000;
        
        var enemies = tower.room.find(FIND_CREEPS, {
                    filter: (creep) => {
                        return !creep.my;
                    }
        })
        
        if (enemies.length > 0) {
            tower.attack(enemies[0]); // should attack closest and healers first instead
            return;
        }
        
        var damagedStructures = tower.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.hits < structure.hitsMax * 0.8 && structure.structureType != STRUCTURE_RAMPART && structure.structureType != STRUCTURE_WALL);
                    }
            });
        var walls = tower.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_WALL && structure.hits < CONST_WALL_REPAIR_MAX);
                    }
            });
        var ramparts = tower.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_RAMPART && structure.hits < CONST_RAMPART_REPAIR_MAX);
                    }
            });
        
        var repairTargets = ramparts.concat(walls, damagedStructures);
            
    	var repairError = tower.repair(repairTargets[0]);
    	
	}
}

module.exports = towerRoutine;