Chess.Util = {
  _includesSubArray: function(array, subArray) {
    for (var i = 0; i < array.length; i++) {
      if (this._arrayEquals(array[i], subArray) === true) return true;
    }
    return false;
  },

  _arrayEquals: function(array1, array2) {
    for (var i = 0; i < array2.length; i++) {
      if (array1[i] !== array2[i]) return false;
    }
    return true;
  }
};
