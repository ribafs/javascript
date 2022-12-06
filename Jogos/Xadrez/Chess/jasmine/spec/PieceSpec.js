describe("Piece", function() {
  beforeEach(function() {
    board = new Chess.Board(this.blankBoard());
  });

  describe("#init", function() {
    it("should set the pieces color, currentPosition, and board it's on", function() {
      var king = new Chess.King("black", board, [0, 1]);
      expect(king.color).toEqual("black");
      expect(king.board).not.toBeNull();
      expect(king.currentPosition[0]).toEqual(0);
      expect(king.currentPosition[1]).toEqual(1);
    });
  });

  describe("#availableMoves", function(){
    it("should return the available positions the piece can move to", function() {
      var piece = new Chess.Knight("black", board, [4,4]);
      board.grid[4][4] = piece;
      var expectedMoves = [[2,3], [2,5], [3,2], [3,6], [5,2], [5,6], [6,3], [6,5]];
      var availableMoves = piece.availableMoves();

      for (var i = 0; i < availableMoves.length; i++) {
        expect(Chess.Util._arrayEquals(availableMoves[i], expectedMoves[i])).toBe(true);
      }
    });
  });

  describe("#validMove", function() {
    it("returns true if the move is valid", function() {
      var piece = new Chess.Knight("black", board, [4,4]);
      board.grid[4][4] = piece;

      expect(piece.validMove(piece.currentPosition, [2,3])).toBe(true);
    });

    it("returns false if the move is invalid", function() {
      var piece = new Chess.Knight("black", board, [4,4]);
      board.grid[4][4] = piece;

      expect(piece.validMove(piece.currentPosition, [2,2])).toBe(false);
    });
  });

  describe("#pieceDirection", function() {
    it("returns the direction the piece is moving", function() {
      var piece = new Chess.Queen("black", board, [4,4]);
      board.grid[4][4] = piece;

      expect(piece.pieceDirection(piece.currentPosition, [7,4])).toEqual("down");
      expect(piece.pieceDirection(piece.currentPosition, [5,5])).toEqual("downright");
      expect(piece.pieceDirection(piece.currentPosition, [4,5])).toEqual("right");
      expect(piece.pieceDirection(piece.currentPosition, [3,5])).toEqual("upright");
      expect(piece.pieceDirection(piece.currentPosition, [2,4])).toEqual("up");
      expect(piece.pieceDirection(piece.currentPosition, [2,2])).toEqual("upleft");
      expect(piece.pieceDirection(piece.currentPosition, [4,1])).toEqual("left");
      expect(piece.pieceDirection(piece.currentPosition, [5,3])).toEqual("downleft");
    });
  });

  describe("#collisionCheck", function() {
    beforeEach(function() {
      piece = new Chess.Queen("black", board, [4,4]);
      board.grid[4][4] = piece;
    });

    it("returns false if there is a collision", function() {
      board.grid[3][3] = new Chess.Pawn("black", board, [3,3]);
      expect(piece.collisionCheck(piece.currentPosition, [2,2])).toBe(false);
    });

    it("returns true if there is no collision", function() {
      board.grid[3][3] = new Chess.Pawn("black", board, [2,2]);

      expect(piece.collisionCheck(piece.currentPosition, [3,3])).toBe(true);
    });

    it("it does not check the end position", function() {
      board.grid[3][3] = new Chess.Pawn("black", board, [3,3]);

      expect(piece.collisionCheck(piece.currentPosition, [3,3])).toBe(true);
    });
  });

  describe("#inCheck", function() {
    beforeEach(function() {
      piece = new Chess.King("black", board, [0,0]);
      board.grid[0][0] = piece;
    });

    it("returns true if the king is in check", function() {
      board.grid[0][1] = new Chess.Rook("white", board, [0,1]);
      expect(piece.inCheck()).toBe(true);
    });

    it("returns false if the king is not in check", function() {
      board.grid[0][1] = new Chess.Rook("black", board, [0,1]);
      expect(piece.inCheck()).toBe(false);
    });
  });

  describe("#checkmate", function() {
    beforeEach(function() {
      piece = new Chess.King("black", board, [0,0]);
      board.grid[0][0] = piece;

    });

    it("returns true if the king is in checkmate", function() {
      board.grid[2][2] = new Chess.Queen("white", board, [2,2]);
      board.grid[0][2] = new Chess.Rook("white", board, [0,2]);
      board.grid[2][0] = new Chess.Rook("white", board, [2,0]);
      expect(piece.checkmate()).toBe(true);
    });

    it("returns false if the king is not in checkmate", function() {
      board.grid[2][2] = new Chess.Queen("black", board, [2,2]);
      board.grid[0][2] = new Chess.Rook("black", board, [0,2]);
      board.grid[2][0] = new Chess.Rook("black", board, [2,0]);
      expect(piece.checkmate()).toBe(false);
    });
  });

  describe("#toQueen", function() {
    beforeEach(function() {
      piece = new Chess.Pawn("white", board, [0,0]);
      board.grid[0][0] = piece;
    });

    it("should convert the piece to a queen with the same attributes it has", function() {
      var color = piece.color;
      var currentPosition = piece.currentPosition;

      piece.toQueen();
      var queen = board.getPiece(currentPosition);

      expect(queen instanceof Chess.Queen).toBe(true);
      expect(queen.color).toEqual(color);
      expect(Chess.Util._arrayEquals(queen.currentPosition, currentPosition)).toBe(true);
    });
  });

  describe("#toKnight", function() {
    beforeEach(function() {
      piece = new Chess.Pawn("white", board, [0,0]);
      board.grid[0][0] = piece;
    });

    it("should convert the piece to a knight with the same attributes it has", function() {
      var color = piece.color;
      var currentPosition = piece.currentPosition;

      piece.toKnight();
      var knight = board.getPiece(currentPosition);

      expect(knight instanceof Chess.Knight).toBe(true);
      expect(knight.color).toEqual(color);
      expect(Chess.Util._arrayEquals(knight.currentPosition, currentPosition)).toBe(true);
    });
  });

  describe("#toBishop", function() {
    beforeEach(function() {
      piece = new Chess.Pawn("white", board, [0,0]);
      board.grid[0][0] = piece;
    });

    it("should convert the piece to a bishop with the same attributes it has", function() {
      var color = piece.color;
      var currentPosition = piece.currentPosition;

      piece.toBishop();
      var bishop = board.getPiece(currentPosition);

      expect(bishop instanceof Chess.Bishop).toBe(true);
      expect(bishop.color).toEqual(color);
      expect(Chess.Util._arrayEquals(bishop.currentPosition, currentPosition)).toBe(true);
    });
  });

  describe("#toRook", function() {
    beforeEach(function() {
      piece = new Chess.Pawn("white", board, [0,0]);
      board.grid[0][0] = piece;
    });

    it("should convert the piece to a rook with the same attributes it has", function() {
      var color = piece.color;
      var currentPosition = piece.currentPosition;

      piece.toRook();
      var rook = board.getPiece(currentPosition);

      expect(rook instanceof Chess.Rook).toBe(true);
      expect(rook.color).toEqual(color);
      expect(Chess.Util._arrayEquals(rook.currentPosition, currentPosition)).toBe(true);
    });
  });
});
