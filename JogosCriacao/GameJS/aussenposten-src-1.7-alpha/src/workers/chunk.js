var gamejs = require('gamejs');
var world = require('../world');

gamejs.ready(function() {
   gamejs.onEvent(function(event) {
      var chunk = new world.Chunk(event);
      world.RiverGenerator.generate(chunk);
      var forestChunk = new world.ForestChunk(chunk);
      gamejs.worker.post({
         chunk: chunk.serialize(),
         forestChunk: forestChunk.serialize()
      });

   });
})