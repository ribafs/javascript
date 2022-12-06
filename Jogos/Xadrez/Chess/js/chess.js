window.Chess = window.Chess || {
  newGame: function() {
    this.startPos = null;
    this.endPos = null;
    this.board = new this.Board();
    this.display = new this.Display(this.board);
    this.bKing = this.board.grid[0][4];
    this.wKing = this.board.grid[7][4];
    this.currentTurn = "white";
  },

  selectPosition: function(array) {
    var piece = this.board.getPiece(array);
    if (this.startPos === null && piece !== null && piece.color === this.currentTurn) {
      this.startPos = array;
      piece.availableMoves();
    } else if (this.Util._arrayEquals(this.startPos, array)) {
      this.startPos = null;
      this.moves = [];
      piece = null;
    } else if (this.startPos !== null) {
      this.endPos = array;
      this.move(this.startPos, this.endPos);
      piece = null;
    }
    this.display.render(piece);
  },

  move: function() {
    if (this.board.move(this.startPos, this.endPos)) {
      this.reverseIfInCheck(this.changeTurns.bind(this));
      this.gameOver();
    }
    this.startPos = null;
    this.endPos = null;
  },

  changeTurns: function() {
    if (this.currentTurn === "white") {
      this.currentTurn = "black";
    } else {
      this.currentTurn = "white";
    }
  },

  reverseIfInCheck: function(callback) {
    if (this.currentTurn === "white" && this.wKing.inCheck()) {
      this.board.reverseLastMove();
      return;
    } else if (this.currentTurn === "black" && this.bKing.inCheck()) {
      this.board.reverseLastMove();
      return;
    }
    callback();
  },

  gameOver: function() {
    if (this.currentTurn === "white") {
      if (this.wKing.checkmate()) this.display.showWinner("Black");
    } else {
      if (this.bKing.checkmate()) this.display.showWinner("White");
    }
  }
};
