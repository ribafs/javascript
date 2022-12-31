var Stats = exports.Stats = function(dome) {

    this.dome = dome;

    this.clear = function() {
        this.production = {
            stone: [],
            nutrition: [],
            ore: [],
            money: [],
            drugs: []
        };

        this.storage = {
            stone: [],
            nutrition: [],
            ore: [],
            money: [],
            drugs: []
        };

        this.intermediateResource = {};

        this.population = {
            count: [],
            happiness: [],
            fullness: []
        };
        this.buildings = {
            count: [],
            damage: []
        };
        this.cooldown = 0;

    };
    this.clear();

    var self = this;
    this.TYPES = {
        production: {
            stone: function() {
                return self.intermediateResource.stone || 0;
            },
            nutrition: function() {
                return self.intermediateResource.nutrition || 0;
            },
            ore: function() {
                return self.intermediateResource.ore || 0;
            },
            money: function() {
                return self.intermediateResource.money || 0;
            },
            drugs: function() {
                return self.intermediateResource.drugs || 0;
            }
        },
        storage: {
            stone: function() {
                return self.dome.testForResource('stone', Infinity);
            },
            nutrition: function() {
                return self.dome.testForResource('nutrition', Infinity);
            },
            ore: function() {
                return self.dome.testForResource('ore', Infinity);
            },
            money: function() {
                return self.dome.testForResource('money', Infinity);
            },
            drugs: function() {
                return self.dome.testForResource('drugs', Infinity);
            }
        },
        population: {
            count: function() {
                return self.dome.units.length;
            },
            happiness: function() {
                return self.dome.getAverageHappiness() * 100 || 0;
            },
            fullness: function(){
                return self.dome.getAverageFullness() * 100 || 0;
            }
        },
        buildings: {
            count: function() {
                return self.dome.buildings.length;
            },
            damage: function() {
                return self.dome.buildings.reduce(function(prev, next) {
                        return (next.damage * 100) + prev;
                }, 0)
            }
        }
    }

    return this;
}

Stats.COOLDOWN = 30 * 1000;
Stats.prototype.update = function(msDuration) {
    this.cooldown -= msDuration;
    if (this.cooldown <= 0) {
        this.cooldown = Stats.COOLDOWN;
        this.step();
    }
}

Stats.MAX = 60;
Stats.prototype.step = function() {
    Object.keys(this.TYPES).forEach(function(major) {
        Object.keys(this[major]).forEach(function(minor) {
            var newVal = Math.round(this.TYPES[major][minor]());
            this[major][minor].push(newVal);
            this[major][minor] = this[major][minor].slice(-Stats.MAX);
        }, this);
    }, this);
    this.intermediateResource = {};
};

Stats.prototype.serialize = function() {
    var d = {};
    Object.keys(this.TYPES).forEach(function(major) {
        d[major] = this[major];
    }, this);
    return d;
}

Stats.unserialize = function(s, dome) {
    var stats = new Stats(dome);
    Object.keys(stats.TYPES).forEach(function(major) {
        stats[major] = s[major];
    });
    return stats;
}

Stats.prototype.change = function(result) {
    this.intermediateResource[result.resource] = (this.intermediateResource[result.resource] || 0) + result.amount;
}
