var gamejs = require('gamejs');
var $r = require('gamejs/math/random');
var animate = require('./animate');
var Alea = require('gamejs/math/random').Alea;

var pics = {};
pics.bodys = [
	"./body/dark2.png",
	"./body/dark.png",
	"./body/tanned.png",
	"./body/tanned2.png",
	"./body/light.png",
	"./body/darkelf2.png",
	"./body/darkelf.png"
];

pics.facials = [
	"./facial/bigstache.png",
	"./facial/frenchstache.png",
	"./facial/mustache.png",
	"./facial/fiveoclock.png",
	"./facial/beard.png"
];

pics.hairs = [
	"./hair/bangslong/white-blonde.png",
	"./hair/bangslong/gold.png",
	"./hair/bangslong2/light-blonde.png",
	"./hair/bangslong2/ruby-red.png",
	"./hair/bangsshort/dark-blonde.png",
	"./hair/bangsshort/blue2.png",
	"./hair/plain/pink.png",
	"./hair/plain/gold.png",
	"./hair/plain/brunette.png",
	"./hair/plain/redhead.png",
	"./hair/plain/purple.png",
	"./hair/shoulderl/green2.png",
	"./hair/shoulderl/white-blonde.png",
	"./hair/shoulderl/white.png",
	"./hair/shoulderl/gray.png",
	"./hair/shoulderl/pink.png",
	"./hair/shoulderl/gold.png",
	"./hair/shoulderl/brunette.png",
	"./hair/shoulderl/brown2.png",
	"./hair/shoulderl/brunette2.png",
	"./hair/shoulderl/redhead.png",
	"./hair/shoulderl/dark-blonde.png",
	"./hair/shoulderl/blue2.png",
	"./hair/shoulderl/green.png",
	"./hair/shoulderl/white-cyan.png",
	"./hair/shoulderl/pink2.png",
	"./hair/shoulderl/purple.png",
	"./hair/shoulderl/blue.png",
	"./hair/shoulderl/gray2.png",
	"./hair/shoulderl/brown.png",
	"./hair/shoulderl/raven.png",
	"./hair/shoulderl/raven2.png",
	"./hair/shoulderl/white-blonde2.png",
	"./hair/shoulderl/light-blonde2.png",
	"./hair/shoulderl/blonde.png",
	"./hair/shoulderl/blonde2.png",
	"./hair/shoulderl/redhead2.png",
	"./hair/shoulderl/black.png",
	"./hair/shoulderl/light-blonde.png",
	"./hair/shoulderl/ruby-red.png",
	"./hair/longhawk/gray.png",
	"./hair/longhawk/pink.png",
	"./hair/longknot/dark-blonde.png",
	"./hair/longknot/blue2.png",
	"./hair/longknot/green.png",
	"./hair/mohawk/green.png",
	"./hair/mohawk/white-cyan.png",
	"./hair/mohawk/pink2.png",
	"./hair/bangs/green2.png",
	"./hair/bangs/white-blonde.png",
	"./hair/xlongknot/green2.png",
	"./hair/xlongknot/white-blonde.png",
	"./hair/xlongknot/white.png",
	"./hair/xlongknot/gray.png",
	"./hair/xlongknot/pink.png",
	"./hair/xlongknot/gold.png",
	"./hair/xlongknot/brunette.png",
	"./hair/xlongknot/brown2.png",
	"./hair/xlongknot/brunette2.png",
	"./hair/xlongknot/redhead.png",
	"./hair/xlongknot/dark-blonde.png",
	"./hair/xlongknot/blue2.png",
	"./hair/xlongknot/green.png",
	"./hair/xlongknot/white-cyan.png",
	"./hair/xlongknot/pink2.png",
	"./hair/xlongknot/purple.png",
	"./hair/xlongknot/blue.png",
	"./hair/xlongknot/gray2.png",
	"./hair/xlongknot/brown.png",
	"./hair/xlongknot/raven.png",
	"./hair/xlongknot/raven2.png",
	"./hair/xlongknot/white-blonde2.png",
	"./hair/xlongknot/light-blonde2.png",
	"./hair/xlongknot/blonde.png",
	"./hair/xlongknot/blonde2.png",
	"./hair/xlongknot/redhead2.png",
	"./hair/xlongknot/black.png",
	"./hair/xlongknot/light-blonde.png",
	"./hair/xlongknot/ruby-red.png",
	"./hair/pixie/pink2.png",
	"./hair/pixie/purple.png",
	"./hair/pixie/blue.png",
	"./hair/pixie/ruby-red.png",
	"./hair/loose/light-blonde.png",
	"./hair/loose/ruby-red.png",
	"./hair/xlong/green2.png",
	"./hair/xlong/white-blonde.png",
	"./hair/xlong/white.png",
	"./hair/xlong/gray.png",
	"./hair/xlong/pink.png",
	"./hair/xlong/gold.png",
	"./hair/xlong/brunette.png",
	"./hair/xlong/brown2.png",
	"./hair/xlong/brunette2.png",
	"./hair/xlong/redhead.png",
	"./hair/xlong/dark-blonde.png",
	"./hair/xlong/blue2.png",
	"./hair/xlong/green.png",
	"./hair/xlong/white-cyan.png",
	"./hair/xlong/pink2.png",
	"./hair/xlong/purple.png",
	"./hair/xlong/blue.png",
	"./hair/xlong/gray2.png",
	"./hair/xlong/brown.png",
	"./hair/xlong/raven.png",
	"./hair/xlong/raven2.png",
	"./hair/xlong/white-blonde2.png",
	"./hair/xlong/light-blonde2.png",
	"./hair/xlong/blonde.png",
	"./hair/xlong/blonde2.png",
	"./hair/xlong/redhead2.png",
	"./hair/xlong/black.png",
	"./hair/xlong/light-blonde.png",
	"./hair/xlong/ruby-red.png",
	"./hair/shoulderr/green2.png",
	"./hair/shoulderr/white-blonde.png",
	"./hair/shoulderr/white.png",
	"./hair/shoulderr/gray.png",
	"./hair/shoulderr/pink.png",
	"./hair/shoulderr/gold.png",
	"./hair/shoulderr/brunette.png",
	"./hair/shoulderr/brown2.png",
	"./hair/shoulderr/brunette2.png",
	"./hair/shoulderr/redhead.png",
	"./hair/shoulderr/dark-blonde.png",
	"./hair/shoulderr/blue2.png",
	"./hair/shoulderr/green.png",
	"./hair/shoulderr/white-cyan.png",
	"./hair/shoulderr/pink2.png",
	"./hair/shoulderr/purple.png",
	"./hair/shoulderr/blue.png",
	"./hair/shoulderr/gray2.png",
	"./hair/shoulderr/brown.png",
	"./hair/shoulderr/raven.png",
	"./hair/shoulderr/raven2.png",
	"./hair/shoulderr/white-blonde2.png",
	"./hair/shoulderr/light-blonde2.png",
	"./hair/shoulderr/blonde.png",
	"./hair/shoulderr/blonde2.png",
	"./hair/shoulderr/redhead2.png",
	"./hair/shoulderr/black.png",
	"./hair/shoulderr/light-blonde.png",
	"./hair/shoulderr/ruby-red.png",
	"./hair/bedhead/brown.png",
	"./hair/bedhead/raven.png",
	"./hair/page2/brown.png",
	"./hair/page2/raven.png",
	"./hair/page2/raven2.png",
	"./hair/bunches/redhead2.png",
	"./hair/bunches/black.png",
	"./hair/shortknot/green2.png",
	"./hair/shortknot/white-blonde.png",
	"./hair/shortknot/white.png",
	"./hair/shortknot/gray.png",
	"./hair/shortknot/pink.png",
	"./hair/shortknot/gold.png",
	"./hair/shortknot/brunette.png",
	"./hair/shortknot/brown2.png",
	"./hair/shortknot/brunette2.png",
	"./hair/shortknot/redhead.png",
	"./hair/shortknot/dark-blonde.png",
	"./hair/shortknot/blue2.png",
	"./hair/shortknot/green.png",
	"./hair/shortknot/white-cyan.png",
	"./hair/shortknot/pink2.png",
	"./hair/shortknot/purple.png",
	"./hair/shortknot/blue.png",
	"./hair/shortknot/gray2.png",
	"./hair/shortknot/brown.png",
	"./hair/shortknot/raven.png",
	"./hair/shortknot/raven2.png",
	"./hair/shortknot/white-blonde2.png",
	"./hair/shortknot/light-blonde2.png",
	"./hair/shortknot/blonde.png",
	"./hair/shortknot/blonde2.png",
	"./hair/shortknot/redhead2.png",
	"./hair/shortknot/black.png",
	"./hair/shortknot/light-blonde.png",
	"./hair/shortknot/ruby-red.png",
	"./hair/messy1/white-blonde2.png",
	"./hair/messy1/light-blonde2.png",
	"./hair/messy1/blonde.png",
	"./hair/swoop/green2.png",
	"./hair/swoop/white-blonde.png",
	"./hair/swoop/white.png",
	"./hair/swoop/gray.png",
	"./hair/swoop/pink.png",
	"./hair/swoop/gold.png",
	"./hair/swoop/brunette.png",
	"./hair/swoop/brown2.png",
	"./hair/swoop/brunette2.png",
	"./hair/swoop/redhead.png",
	"./hair/swoop/dark-blonde.png",
	"./hair/swoop/blue2.png",
	"./hair/swoop/green.png",
	"./hair/swoop/white-cyan.png",
	"./hair/swoop/pink2.png",
	"./hair/swoop/purple.png",
	"./hair/swoop/blue.png",
	"./hair/swoop/gray2.png",
	"./hair/swoop/brown.png",
	"./hair/swoop/raven.png",
	"./hair/swoop/raven2.png",
	"./hair/swoop/white-blonde2.png",
	"./hair/swoop/light-blonde2.png",
	"./hair/swoop/blonde.png",
	"./hair/swoop/blonde2.png",
	"./hair/swoop/redhead2.png",
	"./hair/swoop/black.png",
	"./hair/swoop/light-blonde.png",
	"./hair/swoop/ruby-red.png",
	"./hair/messy2/white-cyan.png",
	"./hair/messy2/pink2.png",
	"./hair/messy2/purple.png",
	"./hair/parted/brown.png",
	"./hair/parted/raven.png",
	"./hair/parted/raven2.png",
	"./hair/ponytail/green2.png",
	"./hair/ponytail/purple.png",
	"./hair/ponytail/blonde.png",
	"./hair/page/redhead.png",
	"./hair/page/dark-blonde.png",
	"./hair/page/blue2.png",
	"./hair/page/green.png",
	"./hair/jewfro/pink2.png",
	"./hair/jewfro/purple.png",
	"./hair/shorthawk/brown2.png",
	"./hair/shorthawk/white-cyan.png",
	"./hair/shorthawk/pink2.png",
	"./hair/shorthawk/purple.png",
	"./hair/shorthawk/blue.png",
	"./hair/long/green.png",
	"./hair/long/white-cyan.png",
	"./hair/unkempt/green2.png",
	"./hair/unkempt/white-blonde.png",
	"./hair/unkempt/white.png",
	"./hair/unkempt/gray.png",
	"./hair/unkempt/pink.png",
	"./hair/unkempt/gold.png",
	"./hair/unkempt/brunette.png",
	"./hair/unkempt/brown2.png",
	"./hair/unkempt/brunette2.png",
	"./hair/unkempt/redhead.png",
	"./hair/unkempt/dark-blonde.png",
	"./hair/unkempt/blue2.png",
	"./hair/unkempt/green.png",
	"./hair/unkempt/white-cyan.png",
	"./hair/unkempt/pink2.png",
	"./hair/unkempt/purple.png",
	"./hair/unkempt/blue.png",
	"./hair/unkempt/gray2.png",
	"./hair/unkempt/brown.png",
	"./hair/unkempt/raven.png",
	"./hair/unkempt/raven2.png",
	"./hair/unkempt/white-blonde2.png",
	"./hair/unkempt/light-blonde2.png",
	"./hair/unkempt/blonde.png",
	"./hair/unkempt/blonde2.png",
	"./hair/unkempt/redhead2.png",
	"./hair/unkempt/black.png",
	"./hair/unkempt/light-blonde.png",
	"./hair/unkempt/ruby-red.png"
];

pics.torsos = [
	"./torso/white_longsleeve.png",
	"./torso/teal_longsleeve.png",
	"./torso/brown_longsleeve.png",
	"./torso/maroon_longsleeve.png"
];


pics.pants = [
	"./pants/magenta_pants_male.png",
	"./pants/teal_pants_male.png",
	"./pants/white_pants_male.png",
	"./pants/red_pants_male.png"
];

pics.feets = [

	"./feet/black_shoes_male.png",
	"./feet/maroon_shoes_male.png",
	"./feet/brown_shoes_male.png"
];

pics.heads = [
	"./head/golden_helm_male.png",
	"./head/tiaras_gold.png",
]

var prefix = './images/bodybuilder/';
exports.getPreloadAssets = function() {
	return pics.facials.concat(pics.hairs).concat(pics.torsos)
				.concat(pics.bodys).concat(pics.pants).concat(pics.feets).concat(pics.heads).map(function(path) {
					return prefix + path;
				});
};

exports.getAnimation = function(seed, unitType) {
	var alea = new Alea(seed || Date.now());

	var base = null;
	['bodys', 'feets', 'pants', 'torsos', 'hairs', 'facials', 'heads'].forEach(function(key) {
		if (key == 'facials' && alea.random() > 0.3) {
			return;
		}
		if (key == 'torsos' && alea.random() > 0.9) {
			return;
		}
		// only for mighty
		if (key === 'heads' && unitType !== 'mighty') {
			return;
		}
		if (base === null) {
			base = gamejs.image.load(prefix + alea.choose(pics[key]));
		} else {
			base.blit(gamejs.image.load(prefix + alea.choose(pics[key])));
		}
	});
	var unitSize = 32;

    var spriteSheet = new animate.SpriteSheet(base, {width: 64, height: 64, scaleTo: [unitSize, unitSize]});

    /*
	total: 13x21
	*/

	var upX = 8;
	var leftX = 9;
	var downX = 10;
	var rightX = 11;
	var idleX = 6;
	var dieX = 21;

    var rate = 20;
    var aniSteps = [0,1,2,3,4,5,6,7,8];
    var createFrames = function(startX) {
    	return aniSteps.map(function(x) {
    		return (startX * 13) + x;
    	})
    }
    var lpcConfig = {
        idle: {frames: createFrames(idleX), rate: rate, loop: true},
        up: {frames: createFrames(upX), rate: rate, loop: true},
        left: {frames: createFrames(leftX), rate: rate, loop: true},
        down: {frames: createFrames(downX), rate: rate, loop: true},
        right: {frames: createFrames(rightX), rate: rate, loop:true},
        die: {frames: createFrames(rightX), rate: rate, loop:true}
    };
    var animation = new animate.Animation(spriteSheet, "idle", lpcConfig);
	return animation;
}