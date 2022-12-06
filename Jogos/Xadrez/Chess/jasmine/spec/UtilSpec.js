describe("Util", function() {
  describe("#_arrayEquals", function() {
    it("returns true if the 1 dimensional arrays equal each other", function() {
      expect(Chess.Util._arrayEquals([1,1,2], [1,1,2])).toBe(true);
    });

    it("returns false if the 1 dimensional arrays do not equal each other", function() {
      expect(Chess.Util._arrayEquals([1,2,2], [1,1,2])).toBe(false);
    });
  });

  describe("#_includesSubArray", function() {
    it("returns true if the array includes the sub array", function() {
      expect(Chess.Util._includesSubArray([[1,2], [3,4]], [1,2])).toBe(true);
    });

    it("returns false if the array does not include the sub array", function() {
      expect(Chess.Util._includesSubArray([[1,2], [3,4]], [5,2])).toBe(false);
    });
  });
});
