beforeEach(function() {
  this.blankBoard = function() {
    var result = [];
    for (var i = 0; i < 8; i++) {
      result.push([]);
      for (var j = 0; j < 8; j++) {
        result[i].push(null);
      }
    }
    return result;
  };
});
