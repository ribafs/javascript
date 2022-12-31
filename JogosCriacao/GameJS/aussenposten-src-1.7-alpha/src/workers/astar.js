var gamejs = require('gamejs');
var astar = require('gamejs/pathfinding/astar');
var AChunk = require('../world').AChunk;
var $v = require('gamejs/utils/vectors');

self.achunk = null;

var handleEvent = function(event) {
   //gamejs.log('Astar event', event.type);

   if (event.type === 'mapdata') {
      self.achunk = new AChunk(event.map);
   } else if (event.type === 'findRoute') {
      var startMs = Date.now();
      var route = astar.findRoute(self.achunk, event.origin, event.destination, 120 * 1000);
      var r = [];
      while (route) {
         r.push(route.point);
         route = route.from;
      }
      r.reverse();
      r = r.map(function(p) {
         p = $v.multiply(p, 16);
         return p;
      }).filter(function(_, idx) {
         return idx < 1 || idx === r.length -1 || idx % 6 === 0;
      });
      gamejs.worker.post({
         route: r.splice(0),
         id: event.id,
         duration: (Date.now() - startMs)
      });
   }
}

gamejs.ready(function() {
   gamejs.onEvent(handleEvent);
   //gamejs.log('Astar worker present');
});