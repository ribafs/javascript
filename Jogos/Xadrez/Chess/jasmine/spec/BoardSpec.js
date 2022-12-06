describe("Board", function() {

  beforeEach(function() {
    board = new Chess.Board();
  });

  describe("#placePiece", function() {
    it("should return the correct piece for a given starting position", function() {
      expect(board.placePiece(0, 0) instanceof Chess.Rook).toEqual(true);
      expect(board.placePiece(7, 6) instanceof Chess.Knight).toEqual(true);
      expect(board.placePiece(0, 4) instanceof Chess.King).toEqual(true);
      expect(board.placePiece(4, 4)).toBeNull();
    });
  });

  describe("#init", function() {
    it("should generate an 8x8 array", function() {
      expect(board.grid.length).toEqual(8);
      for (var i = 0; i < board.grid.length; i++) {
        expect(board.grid[i].length).toEqual(8);
      }
    });

    it("should contain nulls and pieces", function() {
      var position;
      for (var i = 0; i < board.grid.length; i++) {
        for (var j = 0; j < board.grid[i].length; j++) {
          if (i > 1 && i < 6) {
            expect(board.grid[i][j]).toBeNull();
          } else {
            expect(typeof board.grid[i][j]).toEqual("object");
          }
        }
      }
    });
  });

  describe("#getPiece", function() {
    it("should get the piece at the specified position", function() {
      expect(board.getPiece([0,0]) instanceof Chess.Rook).toEqual(true);
      expect(board.getPiece([7,3]) instanceof Chess.Queen).toEqual(true);
      expect(board.getPiece([4,4])).toBeNull();
    });
  });

  describe("#move", function() {
    it("moves the piece on the board if it is a valid move", function() {
      var startPos = [0,1];
      var endPos = [2,0];

      expect(board.getPiece(startPos) instanceof Chess.Knight).toEqual(true);
      expect(board.getPiece(endPos) instanceof Chess.Knight).toEqual(false);
      board.move(startPos, endPos);
      expect(board.getPiece(startPos) instanceof Chess.Knight).toEqual(false);
      expect(board.getPiece(endPos) instanceof Chess.Knight).toEqual(true);

      startPos = [1,1];
      endPos = [2,1];

      expect(board.getPiece(startPos) instanceof Chess.Pawn).toEqual(true);
      expect(board.getPiece(endPos) instanceof Chess.Pawn).toEqual(false);
      board.move(startPos, endPos);
      expect(board.getPiece(startPos) instanceof Chess.Pawn).toEqual(false);
      expect(board.getPiece(endPos) instanceof Chess.Pawn).toEqual(true);
    });

    it("does not move the piece if it is not a valid move", function() {
      var startPos = [0,0];
      var endPos = [0,5];

      expect(board.getPiece(startPos) instanceof Chess.Rook).toEqual(true);
      expect(board.getPiece(endPos) instanceof Chess.Rook).toEqual(false);
      board.move(startPos, endPos);
      expect(board.getPiece(startPos) instanceof Chess.Rook).toEqual(true);
      expect(board.getPiece(endPos) instanceof Chess.Rook).toEqual(false);
    });

    it("returns true on move success", function() {
      var startPos = [0,1];
      var endPos = [2,0];

      expect(board.move(startPos, endPos)).toEqual(true);
    });

    it("returns false on move success", function() {
      var startPos = [0,0];
      var endPos = [2,0];

      expect(board.move(startPos, endPos)).toEqual(false);
    });
  });

  describe("#reverseLastMove", function() {
    it("reverses the last successful move", function() {
      var startPos = [0,1];
      var endPos = [2,0];

      expect(board.getPiece(startPos) instanceof Chess.Knight).toEqual(true);
      board.move(startPos, endPos);
      expect(board.getPiece(endPos) instanceof Chess.Knight).toEqual(true);
      board.reverseLastMove();
      expect(board.getPiece(startPos) instanceof Chess.Knight).toEqual(true);
    });
  });
});
