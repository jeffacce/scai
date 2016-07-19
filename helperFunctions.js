var HelperFunctions = {};

HelperFunctions.getNextExpectedDeath = function() {
	var ttl = 100000;
	var dyingCreep;
	
	for(var i in Game.creeps) {
		var creep = Game.creeps[i];

		if(creep.my && creep.ticksToLive < ttl) {
			ttl = creep.ticksToLive;
			dyingCreep = creep;
		};
	};
	
	return dyingCreep;
}

HelperFunctions.prettyError = function(errorObject, errorCode, printInConsole) {
    var error = '[ERROR] ' + errorObject + ': ' + HelperFunctions.convertErrorToMessage(errorCode) + '.';
    if (printInConsole) {
        console.log(error);
    }
    return error;
}

HelperFunctions.garbageCollection = function() {
	var counter = 0;
	for(var n in Memory.creeps) {
		var c = Game.creeps[n];
		if(!c) {
			delete Memory.creeps[n];
			counter++;
		}
	}
}

HelperFunctions.creepBodyArray = function(bodyString) {
    var config = bodyString.toLowerCase();
    var regexLetters = /^[A-Za-z]+$/;
    var regexNumbers = /^[0-9]+$/;
    var remaining = config;
    var result = [];
    
    while (remaining.length > 0) {
        var part = remaining.substring(0, 1);
        var i = 1;
        while (regexNumbers.test(remaining[i])) {
            i++;
        }
        var count = remaining.substring(1, i);
        remaining = remaining.substring(i);
        if (regexLetters.test(part) && regexNumbers.test(count)) {
            switch(part) {
                case 'w': part = WORK; break;
                case 'm': part = MOVE; break;
                case 'c': part = CARRY; break;
                case 'a': part = ATTACK; break;
                case 'r': part = RANGED_ATTACK; break;
                case 'h': part = HEAL; break;
                case 'c': part = CLAIM; break;
                case 't': part = TOUGH; break;
            };
            count = parseInt(count);
            while (count--) {
                result.push(part);
            }
        } else {
            result = ERR_INVALID_ARGS;
            console.log('[ERROR] Invalid argument for creating creep body part: "' + bodyString + '".');
        };
    };
    
    return result;
}

HelperFunctions.calcCreepBodyCost = function(creepBody) {
    var result = 0;
    var creepBodyPartCosts = {
        WORK: 100,
        MOVE: 50,
        CARRY: 50,
        ATTACK: 80,
        RANGED_ATTACK: 150,
        HEAL: 250,
        CLAIM: 600,
        TOUGH: 10,
    };
    for (i in creepBody) {
        var part = creepBody[i];
        result += parseInt(creepBodyPartCosts.part);
    }
    
    return result;
}

HelperFunctions.convertErrorToMessage = function(error) {
    var message = error;
    
    switch(error) {
        case 0: message = 'OK'; break;
        case -1: message = 'not owner'; break;
        case -2: message = 'no path'; break;
        case -3: message = 'name already exists'; break;
        case -4: message = 'busy'; break;
        case -5: message = 'not found'; break;
        case -6: message = 'not enough resources'; break;
        case -7: message = 'invalid target'; break;
        case -8: message = 'full'; break; 
        case -9: message = 'target not in range'; break;
        case -10: message = 'invalid arguments'; break;
        case -11: message = 'tired'; break;
        case -12: message = 'no body part'; break;
        case -13: break;
        case -14: message = 'RCL not enough'; break;
        case -15: message = 'GCL not enough'; break;
    }
    
    return message;
}

module.exports = HelperFunctions;