Chess.inheritsFromPiece = function(child) {
  child.prototype = Object.create(Chess.Piece.prototype);
};

Chess.Piece = function(color, board, position) {
  this.init(color, board, position);
};

Chess.Piece.prototype.init = function(color, board, position) {
  this.color = color;
  this.board = board;
  this.currentPosition = position;
  this.moved = 0;
  this.moves = [];
};

Chess.Piece.prototype.availableMoves = function() {
  this.moves = [];

  for (var i = 0; i < this.board.grid.length; i++) {
    for (var j = 0; j < this.board.grid[i].length; j++) {
      if (this.validMove(this.currentPosition, [i, j])) this.moves.push([i, j]);
    }
  }
  return this.moves;
};

Chess.Piece.prototype.validMove = function(startPos, endPos) {
  var
  a = startPos[0],
  b = startPos[1],
  x = endPos[0],
  y = endPos[1];

  if (this.board.getPiece(endPos) !== null && this.color === this.board.getPiece(endPos).color) return false;

  if (this.board.getPiece(startPos) instanceof Chess.Knight) return true;

  if (this.collisionCheck(startPos, endPos) === false) return false;

  return true;
};

Chess.Piece.prototype.pieceDirection = function(startPos, endPos) {
  var
  a = startPos[0],
  b = startPos[1],
  x = endPos[0],
  y = endPos[1];

  if ( x < a && y == b) {
    return "up";
  } else if (x > a && y == b) {
    return "down";
  } else if (x == a && y < b) {
    return "left";
  } else if (x == a && y > b) {
    return "right";
  } else if (x < a && y > b) {
    return "upright";
  } else if (x < a && y < b) {
    return "upleft";
  } else if (x > a && y > b) {
    return "downright";
  } else if (x > a && y < b) {
    return "downleft";
  }
};

Chess.Piece.prototype.collisionCheck = function(startPos, endPos) {
  var
  a = startPos[0],
  b = startPos[1],
  x = endPos[0],
  y = endPos[1],
  start,
  end,
  pathLength;

  pathLength = Math.abs(y - b);

  switch (this.pieceDirection(startPos, endPos)) {

    case "up":
      start = a - 1;
      end = x;
      for (var i = start; i > end; i--){
        if (this.board.getPiece([i,  y]) !== null) return false;
      }
      break;

    case "down":
      start = a + 1;
      end = x;
      for (i = start; i < end; i++){
        if (this.board.getPiece([i,  y]) !== null) return false;
      }
      break;

    case "left":
      start = b - 1;
      end = y;
      for (i = start; i > end; i--){
        if (this.board.getPiece([x,  i]) !== null) return false;
      }
      break;

    case "right":
      start = b + 1;
      end = y;
      for (i = start; i < end; i++){
        if (this.board.getPiece([x,  i]) !== null) return false;
      }
      break;

    case "upright":
      for (i = 1; i < pathLength; i++) {
        if (this.board.getPiece([a - i,  b + i]) !== null) return false;
      }
      break;

    case "downright":
      for (i = 1; i < pathLength; i++) {
        if (this.board.getPiece([a + i,  b + i]) !== null) return false;
      }
      break;

    case "downleft":
      for (i = 1; i < pathLength; i++) {
        if (this.board.getPiece([a + i,  b - i]) !== null) return false;
      }
      break;

    case "upleft":
      for (i = 1; i < pathLength; i++) {
        if (this.board.getPiece([a - i,  b - i]) !== null) return false;
      }
      break;
  }

  return true;
};



Chess.Queen = function(color, board, position) {
  this.init(color, board, position);
  this.show = this.color === "black" ? "♛" : "♕";
};

Chess.inheritsFromPiece(Chess.Queen);

Chess.Queen.prototype.validMove = function(startPos, endPos) {
  var
  a = startPos[0],
  b = startPos[1],
  x = endPos[0],
  y = endPos[1];

  if (Math.abs(x - a) === Math.abs(y - b) || x === a || y === b) {
    return Chess.Piece.prototype.validMove.call(this, startPos, endPos);
  } else {
    return false;
  }
};



Chess.King = function(color, board, position) {
  this.init(color, board, position);
  this.show = this.color === "black" ? "♚" : "♔";
};

Chess.inheritsFromPiece(Chess.King);

Chess.King.prototype.validMove = function(startPos, endPos) {
  var
  a = startPos[0],
  b = startPos[1],
  x = endPos[0],
  y = endPos[1];

  if (this.checkIfCastleMove(endPos)) return true;

  if (Math.abs(x - a) < 2 && Math.abs(y - b) < 2) {
    return Chess.Piece.prototype.validMove.call(this, startPos, endPos);
  } else {
    return false;
  }
};

Chess.King.prototype.checkmate = function() {
  var startPos, endPos, piece;
  for (var i = 0; i < this.board.grid.length; i++) {
    for (var j = 0; j < this.board.grid[i].length; j++) {
      startPos = [i,j];
      piece = this.board.getPiece(startPos);

      if (piece !== null && piece.color === this.color) {

        for (var k = 0; k < this.board.grid.length; k++) {
          for (var l = 0; l < this.board.grid[i].length; l++) {

            endPos = [k,l];

            if (this.board.move(startPos, endPos)) {
              if (!this.inCheck()) {
                this.board.reverseLastMove();
                return false;
              }
              this.board.reverseLastMove();
            }
          }
        }
      }
    }
  }
  return true;
};

Chess.King.prototype.inCheck = function(position) {
  var piece;

  if (typeof position === "undefined") position = this.currentPosition;

  for (var i = 0; i < this.board.grid.length; i++) {
    for (var j = 0; j < this.board.grid[i].length; j++) {
      piece = this.board.getPiece([i, j]);
      if (piece !== null && piece.color !== this.color && !(piece instanceof Chess.King)) {
        if (Chess.Util._includesSubArray(piece.availableMoves(), position)) return true;
      }
    }
  }
  return false;
};

Chess.King.prototype.didCastle = function(lastPos) {
  if (
    this.color === "white" &&
    Chess.Util._arrayEquals(lastPos, [7,4]) &&
    Chess.Util._arrayEquals(this.currentPosition, [7, 6]) &&
    this.moved === 1
  ) {
    return true;
  } else if (
    this.color === "white" &&
    Chess.Util._arrayEquals(lastPos, [7,4]) &&
    Chess.Util._arrayEquals(this.currentPosition, [7, 2]) &&
    this.moved === 1
  ) {
    return true;
  } else if (
    this.color === "black" &&
    Chess.Util._arrayEquals(lastPos, [0,4]) &&
    Chess.Util._arrayEquals(this.currentPosition, [0, 6]) &&
    this.moved === 1
  ) {
    return true;
  } else if (
    this.color === "black" &&
    Chess.Util._arrayEquals(lastPos, [0,4]) &&
    Chess.Util._arrayEquals(this.currentPosition, [0, 2]) &&
    this.moved === 1
  ) {
    return true;
  }

  return false;
};

Chess.King.prototype.checkIfCastleMove = function(endPos) {
  var castlingDirection =  this.castlingDirection();
  if (this.color === "white" && Chess.Util._arrayEquals(endPos, [7,2]) && castlingDirection[0]) {
    return true;
  } else if (this.color === "white" && Chess.Util._arrayEquals(endPos, [7,6]) && castlingDirection[1]) {
    return true;
  } else if (this.color === "black" && Chess.Util._arrayEquals(endPos, [0,2]) && castlingDirection[0]) {
    return true;
  } else if (this.color === "black" && Chess.Util._arrayEquals(endPos, [0,6]) && castlingDirection[1]) {
    return true;
  }
  return false;
};

Chess.King.prototype.castlingDirection = function() {
  var rooks = this.getRooks();
  var result = [];

  result[0] = this.canCastle(rooks[0]) && this.castlingCollisionCheck("left");
  result[1] = this.canCastle(rooks[1]) && this.castlingCollisionCheck("right");

  return result;
};

Chess.King.prototype.castlingCollisionCheck = function(direction) {

  for (var i = 0; i < 2; i++){
    if (this.color === "white" && direction === "left") {
      if (this.board.getPiece([7,3-i]) !== null || this.inCheck([7,3-i])) return false;
    } else if (this.color === "white" && direction === "right") {
      if (this.board.getPiece([7,5+i]) !== null || this.inCheck([7,5+i])) return false;
    } else if (this.color === "black" && direction === "right") {
      if (this.board.getPiece([0,5+i]) !== null || this.inCheck([0,5+i])) return false;
    } else if (this.color === "black" && direction === "left") {
      if (this.board.getPiece([0,3-i]) !== null || this.inCheck([0,3-i])) return false;
    }
  }

  return true;
};

Chess.King.prototype.canCastle = function(rook) {
  if (this.moved > 0 || this.inCheck()) {
    return false;
  } else if (rook === null || rook.moved > 0) {
    return false;
  } else {
    return true;
  }
};

Chess.King.prototype.getRooks = function() {
  if (this.color === "white") {
    return [this.board.getPiece([7,0]), this.board.getPiece([7,7])];
  } else if (this.color === "black") {
    return [this.board.getPiece([0,0]), this.board.getPiece([0,7])];
  }
};



Chess.Knight = function(color, board, position) {
  this.init(color, board, position);
  this.show = this.color === "black" ? "♞" : "♘";
};

Chess.inheritsFromPiece(Chess.Knight);

Chess.Knight.prototype.validMove = function(startPos, endPos) {
  var
  a = startPos[0],
  b = startPos[1],
  x = endPos[0],
  y = endPos[1];

  if ((Math.abs(x - a) === 1 && Math.abs(y - b) === 2) || (Math.abs(x - a) === 2 && Math.abs(y - b) === 1)) {
    return Chess.Piece.prototype.validMove.call(this, startPos, endPos);
  } else {
    return false;
  }
};



Chess.Bishop = function(color, board, position) {
  this.init(color, board, position);
  this.show = this.color === "black" ? "♝" : "♗";
};

Chess.inheritsFromPiece(Chess.Bishop);

Chess.Bishop.prototype.validMove = function(startPos, endPos) {
  var
  a = startPos[0],
  b = startPos[1],
  x = endPos[0],
  y = endPos[1];

  if (Math.abs(x - a) === Math.abs(y - b)) {
    return Chess.Piece.prototype.validMove.call(this, startPos, endPos);
  } else {
    return false;
  }
};



Chess.Rook = function(color, board, position) {
  this.init(color, board, position);
  this.show = this.color === "black" ? "♜" : "♖";
};

Chess.inheritsFromPiece(Chess.Rook);

Chess.Rook.prototype.validMove = function(startPos, endPos) {
  var
  a = startPos[0],
  b = startPos[1],
  x = endPos[0],
  y = endPos[1];

  if (x === a || y === b) {
    return Chess.Piece.prototype.validMove.call(this, startPos, endPos);
  } else {
    return false;
  }

};



Chess.Pawn = function(color, board, position) {
  this.init(color, board, position);
  this.show = this.color === "black" ? "♟" : "♙";
};

Chess.inheritsFromPiece(Chess.Pawn);

Chess.Pawn.prototype.validMove = function(startPos, endPos) {
  var
  a = startPos[0],
  b = startPos[1],
  x = endPos[0],
  y = endPos[1];

  if (this.board.grid[x][y] !== null && b === y) return false;

  if (this.color === "white" && a === 6 && y === b && Math.abs(x - a) === 2 && this.board.getPiece([a-1, b]) === null) {
    return true;
  } else if (this.color === "black" && a == 1 && y==b && Math.abs(x - a) === 2 && this.board.getPiece([a+1, b]) === null) {
    return true;
  }

  if (this.color === "white" &&  a - x === 1 && Math.abs(b - y) === 1 && this.board.grid[x][y] !== null && this.board.grid[x][y].color != this.color) {
    return true;
  } else if (this.color === "black" && a - x === -1 && Math.abs(b - y) === 1 && this.board.grid[x][y] !== null && this.board.grid[x][y].color !== this.color) {
    return true;
  }

  var expression = this.color === "black" ? x - a === 1 && y === b : x - a === -1 && y === b;

  if (expression) return Chess.Piece.prototype.validMove.call(this, startPos, endPos);
};

Chess.Pawn.prototype.promotion = function() {
  if (this. color === "white" && this.currentPosition[0] === 0) {
    Chess.display.pawnPromotion(this);
  } else if (this. color === "black" && this.currentPosition[0] === 7) {
    Chess.display.pawnPromotion(this);
  }
};

Chess.Pawn.prototype.toQueen = function() {
  var x = this.currentPosition[0];
  var y = this.currentPosition[1];
  this.board.grid[x][y] = new Chess.Queen(this.color, this.board, this.currentPosition);
  if (typeof Chess.display !== "undefined") Chess.display.clearPromotion();
};

Chess.Pawn.prototype.toBishop = function() {
  var x = this.currentPosition[0];
  var y = this.currentPosition[1];
  this.board.grid[x][y] = new Chess.Bishop(this.color, this.board, this.currentPosition);
  if (typeof Chess.display !== "undefined") Chess.display.clearPromotion();
};

Chess.Pawn.prototype.toKnight = function() {
  var x = this.currentPosition[0];
  var y = this.currentPosition[1];
  this.board.grid[x][y] = new Chess.Knight(this.color, this.board, this.currentPosition);
  if (typeof Chess.display !== "undefined") Chess.display.clearPromotion();
};

Chess.Pawn.prototype.toRook = function() {
  var x = this.currentPosition[0];
  var y = this.currentPosition[1];
  this.board.grid[x][y] = new Chess.Rook(this.color, this.board, this.currentPosition);
  if (typeof Chess.display !== "undefined") Chess.display.clearPromotion();
};
