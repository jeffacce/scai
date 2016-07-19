workers: getNearestEnergySource (mine or transfer), or waitForEnergyTransfer

harvester: getNearestEnergyDropoff (link, extension, container, storage, carriers, etc.)


message system? hierarchical? looking for someone who can handle the message, like an exception. e.g.
	creep requests energy from container
	request goes to creep manager (cannot handle, relays up top)
	> room manager (handles, relays to storage manager)
	> storage manager (handles, gives container task)
	> container transfers energy to creep

or flat? creep directly requests energy from container, container responds, and creep responds accordingly?

a cost analysis for each creep?


a creep deployment system. (a not so thin creep script with a comparatively fatter controller script?)


statistics 


creep move cost = 
creep body parts energy cost (+ ticks used for spawning the creep?)
/ creep total time to live
* estimated ticks taken to move


Creep manager offers a list of tasks to creeps, and creeps calculate and chooses  the most profitable and least costly one to take (some of the calculations, if universal, can be done at manager side)module for energy expense on repair/upgrade/building/creeps/etc.


creep function: move to closest of equivalent targets?

creep can give other creeps requests (e.g. move out of the way), and other creeps decide whether it executes the request, based on its own priorities.

storage fetch queue.


a score function for sorting targets: e.g. close distance scores higher, etc.

