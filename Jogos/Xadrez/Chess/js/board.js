Chess.Board = function(grid) {
  if (typeof grid !== "undefined") {
    this.grid = grid;
  } else {
    this.init();
  }
  this.moves = [];
};

Chess.Board.prototype.init = function() {
  this.grid = [];
  for (var i = 0; i < 8; i++) {
    this.grid.push([]);
    for (var j = 0; j < 8; j++) {
      this.grid[i][j] = this.placePiece(i, j);
    }
  }
};

Chess.Board.prototype.move = function(startPos, endPos) {
  var
  piece1 = this.grid[startPos[0]][startPos[1]],
  piece2 = this.grid[endPos[0]][endPos[1]];

  if (piece1.validMove(startPos, endPos)) {
    this.movePiece(piece1, piece2, startPos, endPos);
    this.didKingCastle(piece1, startPos);
    return true;
  }
  return false;
};

Chess.Board.prototype.movePiece = function(piece1, piece2, startPos, endPos) {
  this.grid[startPos[0]][startPos[1]] = null;
  this.grid[endPos[0]][endPos[1]] = piece1;
  piece1.currentPosition = endPos;
  piece1.moved++;
  this.moves.push([startPos, endPos, piece1, piece2]);
};

Chess.Board.prototype.didKingCastle = function(piece, lastPos) {
  if (piece instanceof Chess.King && piece.didCastle(lastPos)) {
    this.findRook(piece, lastPos);
  }
};

Chess.Board.prototype.findRook = function(king) {
  if (king.color === "white") {
    if (Chess.Util._arrayEquals(king.currentPosition, [7,6])) {
      this.moveRook([7,7], [7,5]);
    } else if (Chess.Util._arrayEquals(king.currentPosition, [7,2])) {
      this.moveRook([7,0], [7,3]);
    }
  } else if (king.color === "black") {
    if (Chess.Util._arrayEquals(king.currentPosition, [0,6])) {
      this.moveRook([0,7], [0,5]);
    } else if (Chess.Util._arrayEquals(king.currentPosition, [0,2])) {
      this.moveRook([0,0], [0,3]);
    }
  }
};

Chess.Board.prototype.moveRook = function(startPos, endPos) {
  var rook = this.getPiece(startPos);

  this.movePiece(rook, null, startPos, endPos);
};

Chess.Board.prototype.reverseLastMove = function() {
  var
  lastMove = this.moves[this.moves.length-1],
  startPos = lastMove[0],
  endPos = lastMove[1],
  piece1 = lastMove[2],
  piece2 = lastMove[3];
  piece1.moved--;

  this.grid[startPos[0]][startPos[1]] = piece1;
  piece1.currentPosition = startPos;

  this.grid[endPos[0]][endPos[1]] = piece2;
  if (piece2 !== null) piece2.currentPosition = endPos;

  this.moves.pop();
};

Chess.Board.prototype.getPiece = function(array) {
  return this.grid[array[0]][array[1]];
};

Chess.Board.prototype.placePiece = function(i, j) {
  var position = [i ,j];
  if (i === 1) {
    return new Chess.Pawn("black", this, position);
  } else if (i === 6) {
    return new Chess.Pawn("white", this, position);
  } else if (i === 0 && (j === 7 || j === 0)) {
    return new Chess.Rook("black", this, position);
  } else if (i === 0 && (j === 6 || j === 1)) {
    return new Chess.Knight("black", this, position);
  } else if (i === 0 && (j === 5 || j === 2)) {
    return new Chess.Bishop("black", this, position);
  } else if (i === 0 && j === 4) {
    return new Chess.King("black", this, position);
  } else if (i === 0 && j === 3) {
    return new Chess.Queen("black", this, position);
  } else if (i === 7 && (j === 7 || j === 0)) {
    return new Chess.Rook("white", this, position);
  } else if (i === 7 && (j === 6 || j === 1)) {
    return new Chess.Knight("white", this, position);
  } else if (i === 7 && (j === 5 || j === 2)) {
    return new Chess.Bishop("white", this, position);
  } else if (i === 7 && j === 4) {
    return new Chess.King("white", this, position);
  } else if (i === 7 && j === 3) {
    return new Chess.Queen("white", this, position);
  } else {
    return null;
  }
};
