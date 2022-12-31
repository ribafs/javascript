var Building = {};
Building.TYPES = {
   'elevator': {
      width: 4,
      height: 4,
      energyNeed: 0,
      constantDamage: 0,
      stone: 30,
      maxWorkers: 3,
      cost: 20,
      display: 'Elevator',
      description: 'Down and up from the old cities underground.'
   },
   'storage': {
      width: 7,
      height: 7,
      update: 'storage',
      updateDelta: 5 *1000,
      constantDamage: 1/8000,
      workerFullness: 0, // handled by Unit.moveFullness
      workerHappiness: -0.001,
      maxWorkers: 2,
      energyNeed: 0,
      display: 'Storage',
      stone: 10,
      cost: 0,
      maxStorage: 20*8,
      description: "Carrierbots collect resources from production buildings."
   },
   'living': {
      width: 5,
      height: 5,
      update: 'relax',
      updateDelta: 2.5 *1000,
      updateDamage: 2/5000,
      improveHappiness: 0.1,
      maxWorkers: 3,
      energyNeed: 0,
      display: 'Habitat',
      stone: 5,
      cost: 0,
      description: "Open living places will be filled as long as the average fullness is greater than 80%."
   },
   'quarter': {
      width: 6,
      height: 6,
      update: 'relax',
      updateDelta: 2.5 *1000,
      updateDamage: 0.002,
      improveHappiness: 0.1,
      maxWorkers: 3,
      energyNeed: 0.1,
      display: 'Luxury Quarters',
      stone: 15,
      cost: 0,
      description: 'For mighty colonists only. Open living places will be filled as long as the average fullness is greater than 80%.'
   },
   /** GATHER **/
   'mine': {
      width: 7,
      height: 7,
      update: 'gather',
      updateDelta: 10 * 1000,
      updateDamage: 0.01,
      maxWorkers: 2,
      perWorkerBuilding: 'mineshaft',
      perWorkerBuildingMaxRadius: 20,
      workerHappiness: -0.01,
      workerFullness: -0.01,
      output: {
         resource: 'stone',
         perWorker: 0.5,
         max: 15
      },
      energyNeed: 0,
      display: 'Stone processing',
      stone: 5,
      cost: 0,
      description: "Processes stone debris into stone blocks for construction."
   },
   'oremine': {
      width: 6,
      height: 6,
      planetProperty: 'isOreMineable',
      update: 'gather',
      updateDelta: 4 * 1000,
      updateDamage: 0.01,
      maxWorkers: 2,
      workerHappiness: -0.01,
      workerFullness: -0.01,
      output: {
         resource: 'ore',
         perWorker: 0.5,
         max: 15
      },
      energyNeed: 0.4,
      display: 'Ice drilling',
      stone: 20,
      cost: 0,
      description: 'Extracts iron ore by piercing deep into the ice.'
   },
   'farm': {
      width: 7,
      height: 7,
      update: 'gather',
      updateDelta: 10 * 1000,
      maxWorkers: 2,
      updateDamage: 0.01,
      perWorkerBuilding: 'farmarea',
      perWorkerBuildingMaxRadius: 20,
      workerHappiness: -0.004,
      workerFullness: -0.006,
      output: {
         resource: 'nutrition',
         perWorker: 1,
         max: 15
      },
      energyNeed: 0,
      display: 'Food processing',
      stone: 3,
      cost: 0,
      description: "Processes nutrition into concentrated nutrition for the Mighty."
   },
   /** PER WORKER **/
   'mineshaft': {
      width: 4,
      height: 4,
      isWorkerBuilding: true,
      planetProperty: 'isMineable',
      energyNeed: 0,
      display: 'Stone collector',
      stone: 4,
      cost: 0,
      description: 'Supplies raw stone debris to a stone processing building.'
   },
   'farmarea': {
      width: 4,
      height: 4,
      isWorkerBuilding: true,
      planetProperty: 'isFarmable',
      energyNeed: 0,
      display: 'Greenhouse',
      stone: 2,
      cost: 0,
      description: 'Supplies nutritional resources to a food processing building.'
   },
   /** PRODUCTION **/
   'factory': {
      width: 6,
      height: 6,
      update: 'produce',
      updateDelta: 20 * 1000,
      updateDamage: 0.15,
      maxWorkers: 3,
      workerHappiness: -0.025,
      workerFullness: -0.02,
      input: {
         resource: 'ore',
         perWorker: 2
      },
      output: {
         resource: 'money',
         max: 20,
         perWorker: 1
      },
      energyNeed: 0.5,
      display: 'Metal foundry',
      stone: 8,
      cost: 8,
      description: 'Processes iron ore into metal for constrution. Only the mighty know how to operate a foundry.'
   },
   'kitchen': {
      width: 10,
      height: 10,
      update: 'produce',
      updateDelta: 15 * 1000,
      updateDamage: 0.15,
      maxWorkers: 3,
      workerHappiness: -0.025,
      workerFullness: -0.02,
      input: {
         resource: 'nutrition',
         perWorker: 2
      },
      output: {
         resource: 'drugs',
         max: 20,
         perWorker: 1
      },
      energyNeed: 0.5,
      display: 'Cooking Area',
      stone: 5,
      cost: 8,
      description: 'Nutrition is turned into addictively delicious concentrated nutrition for the mighty.'
   },
   'cantine': {
      width: 7,
      height: 7,
      update: 'eat',
      updateDelta: 3 * 1000,
      maxWorkers: 4,
      addFullness: 0.1,
      input: {
         resource: 'nutrition',
         perWorker: 1
      },
      energyNeed: 0,
      display: 'Cantine',
      stone: 3,
      cost: 0,
      description: 'Delivers food to hungry colonists.'
   },
   'bar': {
      width: 8,
      height: 8,
      update: 'relax',
      updateDelta: 3 * 1000,
      maxWorkers: 4,
      energyNeed: 0.2,
      improveHappiness: 0.5,
      input: {
         resource: 'drugs',
         perWorker: 0.1
      },
      display: 'High Culture',
      stone: 1,
      cost: 3,
      description: 'The mighty recreationally consume concentrated nutrition in these establishments.'
   },
   'maintenance': {
      width: 7,
      height: 7,
      maxWorkers: 2,
      energyNeed: 0,
      update: 'repair',
      updateDelta: 3 * 1000,
      display: 'Repair service',
      cost: 0,
      stone: 5,
      workerFullness: -0.01,
      workerHappiness: -0.01,
      description: 'Repairbots remove damage from any building.'
   },
   'authority': {
      width: 5,
      height: 5,
      maxWorkers: 1,
      energyNeed: 0.1,
      update: 'incident',
      updateDelta: 2 * 1000,
      display: 'Authority',
      workerFullness: -0.02,
      workerHappiness: -0.02,
      cost: 9,
      stone: 1,
      description: 'Defend the perimeter with mechs. Only mighty can operate mechs.'
   },
   'solar': {
      width: 3,
      height: 3,
      energyNeed: 0,
      constantDamage: 2/5000,
      display: 'Wind turbine',
      stone: 3,
      cost: 0,
      description: 'Produces energy used by advanced buildings.'
   },
   'oxygen': {
      width: 5,
      height: 5,
      energyNeed: 0,
      constantDamage: 1/3000,
      display: 'Oxygen recycler',
      stone: 3,
      cost: 0,
      description: 'The oxygen need rises with each new colonists and building.'
   },
   'teleport': {
      width: 4,
      height: 4,
      updateDelta: 3 *1000,
      update: 'teleport',
      energyNeed: 0.1,
      constantDamage: 1/3000,
      maxWorkers: 1,
      display: 'Teleport',
      maxStorage: 6*8,
      stone: 20,
      cost: 10,
      description: 'Trade resources with other domes (you obviously need one teleport in each dome to trade).'
   }
};

Object.keys(Building.TYPES).forEach(function(type) {
    var b = Building.TYPES[type];
    console.log("##" + b.display + '\n');
    console.log("<img src='./images/buildings/" + type + "'>\n");
    console.log(b.description);
    console.log("\n\n");
});