var roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // if (creep.room != creep.memory.target.room) {
        //     creep.moveTo(Game.map.findRoute(creep.room, creep.memory.target.room)[0]);
        // }
        claimError = creep.claimController(creep.memory.target);
        console.log(claimError);
        if (claimError = ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.memory.target);
        }
    }
}

module.exports = roleClaimer;