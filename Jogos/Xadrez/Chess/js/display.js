Chess.Display = function(board) {
  this.board = board;
  this.chessboard = document.getElementById("chessboard");
  this.currentState = 1;
  this.states = {
    Game: 1,
    End: 0
  };
  this.winner = "";
  this.render(null);
};

Chess.Display.prototype.render = function(selectedPiece) {
  this.empty();
  for (var i = 0; i < this.board.grid.length; i++) {
    for (var j = 0; j < this.board.grid[i].length; j++) {
      this.appendSquare(i, j, this.board.grid[i][j], selectedPiece);
    }
  }
  if (this.currentState === this.states.End) this.gameOver(this.winner);
};

Chess.Display.prototype.empty = function() {
  while (this.chessboard.firstChild) {
    this.chessboard.removeChild(this.chessboard.firstChild);
  }
};

Chess.Display.prototype.appendSquare = function(i, j, piece, selectedPiece) {
  var square = document.createElement("div");

  if (piece instanceof Chess.Pawn) piece.promotion();


  if (selectedPiece !== null && Chess.Util._includesSubArray(selectedPiece.moves, [i, j])) {
    square.className = "green";
  } else if ((i + j) % 2 === 0) {
    square.className = "white";
  } else {
    square.className = "brown";
  }

  square.id = "[" + i + "," + j + "]";

  if (piece !== null) square.innerHTML = piece.show;

  if (Chess.startPos !== null && Chess.startPos[0] === i && Chess.startPos[1] === j) {
    square.className = square.className + " selected-piece";
  }

  square.addEventListener('click', function() {
    Chess.selectPosition(JSON.parse(square.id));
  });

  this.chessboard.appendChild(square);
};

Chess.Display.prototype.pawnPromotion = function(piece) {
  var modalBackground = document.createElement("div");
  var modal = document.createElement("section");
  var prompt = document.createElement("p");

  modalBackground.className = "chessboard-modal-background";
  modal.className = "chessboard-modal";
  prompt.className = "piece-select-prompt";

  prompt.innerHTML = "What piece would you like";

  modal.appendChild(prompt);

  this.generateButton(piece, "Queen", modal);
  this.generateButton(piece, "Bishop", modal);
  this.generateButton(piece, "Rook", modal);
  this.generateButton(piece, "Knight", modal);

  this.chessboard.appendChild(modalBackground);
  this.chessboard.appendChild(modal);
};

Chess.Display.prototype.clearPromotion = function() {
  this.render(null);
};

Chess.Display.prototype.gameOver = function(color) {
  var modalBackground = document.createElement("div");
  var modal = document.createElement("section");
  var prompt = document.createElement("p");
  var button = document.createElement("input");


  modalBackground.className = "chessboard-modal-background";
  modal.className = "chessboard-modal";
  prompt.className = "piece-select-prompt";

  prompt.innerHTML = "Checkmate, " + color + " wins!";

  modal.appendChild(prompt);

  button.type = "button";
  button.value = "New Game";
  button.className = "new-game";
  button.onclick = Chess.newGame.bind(Chess);

  modal.appendChild(button);

  this.chessboard.appendChild(modalBackground);
  this.chessboard.appendChild(modal);


};

Chess.Display.prototype.showWinner = function(color) {
  this.currentState = this.states.End;
  this.winner = color;
};

Chess.Display.prototype.generateButton = function(piece, choice, element) {
  var button = document.createElement("input");
  button.type = "button";
  button.value = choice;
  button.className = "piece-select";

  switch (choice) {
    case "Queen":
      button.onclick = piece.toQueen.bind(piece);
      break;
    case "Bishop":
      button.onclick = piece.toBishop.bind(piece);
      break;
    case "Knight":
      button.onclick = piece.toKnight.bind(piece);
      break;
    case "Rook":
      button.onclick = piece.toRook.bind(piece);
      break;
  }

  element.appendChild(button);
};
