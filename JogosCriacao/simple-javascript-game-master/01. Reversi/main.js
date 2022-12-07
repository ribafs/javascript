var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var width = 640;
var height = 640;
var blocksize = width / 8;
var white = 0;
var black = 1;
var board = [
    [-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,white,black,-1,-1,-1],
    [-1,-1,-1,black,white,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1]
    ];
var turn = 0;
var totalBlack = 2;
var totalWhite = 2;

function init(){
    document.getElementById("btnStart").innerHTML = "RESTART";
    c.style.display = "block";
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0,0,width,height);
    board = [
    [-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,white,black,-1,-1,-1],
    [-1,-1,-1,black,white,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1]
    ];
    turn = 0;
    totalBlack = 2;
    totalWhite = 2;
    gameSet();
}

function gameSet(){
    noMove(turn);
    display();
    status();
    info();
    listener();
}

function drawSquare(row,col){
    c.style.display = "block";
    ctx.fillStyle = "green";
    ctx.fillRect(col * blocksize,row * blocksize,blocksize,blocksize);
    ctx.strokeStyle = "black";
    ctx.strokeRect(col * blocksize,row * blocksize,blocksize,blocksize);
}

function drawCircle(row,col,fillcolor){
    ctx.beginPath();
    ctx.arc(col * blocksize + blocksize/2, row * blocksize + blocksize/2, blocksize/2, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = fillcolor;
    ctx.fill();
}

function drawSmallCircle(row,col,fillcolor){
    ctx.beginPath();
    ctx.arc(col * blocksize + blocksize/2, row * blocksize + blocksize/2, blocksize/8, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = fillcolor;
    ctx.fill();
}

function display(){
    var row,col;
    for(row = 0;row < 8;row++){
        for(col = 0;col < 8;col++){
            drawSquare(row,col);
            if(board[row][col] === 0) drawCircle(row,col,"white");
            if(board[row][col] === 1) drawCircle(row,col,"black");
        }
    }
}

function listener(){
    c.addEventListener('click', function(e) {
        var mousePos = c.getBoundingClientRect();
        var mouseCoord = {x: e.clientX - mousePos.left, y: e.clientY - mousePos.top};
        var posY = Math.floor(mouseCoord.y / blocksize);
        var posX = Math.floor(mouseCoord.x / blocksize);
        checkValidity(posX,posY);
    }, false);
}

function noMove(turn){
    var adaMove = false;
    for(var y = 0;y < 8; y++){
        for(var x = 0;x < 8;x++){
            if(board[y][x] != -1) continue;
            var posX = x, posY = y;
            for(var dy = -1; dy <= 1; dy++) {
                for(var dx = -1; dx <= 1; dx++) {
                    if(dy == 0 && dx == 0) continue;
                    var ada = false;
                    for(var occ = 0, tmpX = posX + dx,tmpY = posY + dy;
                        tmpY >= 0 && tmpX >= 0 && tmpY < 8 && tmpX < 8; 
                        tmpX += dx, tmpY += dy,occ++) {
                        if(board[tmpY][tmpX] == -1) break;
                        if(board[tmpY][tmpX] == turn) {
                            if(occ >= 1) ada = true;
                            else break;
                        }
                        if(ada == true){
                            if(turn == 1) drawSmallCircle(y,x,"black");
                            else drawSmallCircle(y,x,"white");
                            break;
                        }
                    }
                    if(ada == true) adaMove = true;
                }
            }
        }
    }
    return (adaMove == false);
}

function checkValidity(posX,posY){
    //if valid
    document.getElementById("information").style.display = "none";
    //alert(posy + " " + posX);
    var adaFinal = false;
    if(board[posY][posX] == -1)
    for(var dy = -1; dy <= 1; dy++) {
        for(var dx = -1; dx <= 1; dx++) {
            if(dy == 0 && dx == 0) continue;
            var ada = false;
            for(var occ = 0, tmpX = posX + dx,tmpY = posY + dy;
                tmpY >= 0 && tmpX >= 0 && tmpY < 8 && tmpX < 8; 
                tmpX += dx, tmpY += dy,occ++) {
                if(board[tmpY][tmpX] == -1) break;
                if(board[tmpY][tmpX] == turn) {
                    if(occ >= 1) ada = true;
                    else break;
                }
                if(ada == true){
                    for(var revX = tmpX,revY = tmpY; 
                        revX != posX || revY != posY; 
                        revX -= dx, revY -= dy) {
                        board[revY][revX] = turn;
                        if(revX != tmpX || revY != tmpY) {
                            if(turn == 0) totalWhite++, totalBlack--;
                            else totalBlack++,totalWhite--;
                        }
                    }
                    break;
                }
            }
            if(ada == true) adaFinal = true;
        }
    }
    if(adaFinal == true){
        board[posY][posX] = turn;
        if(turn == 0) totalWhite++;
        else totalBlack++;
        turn = 1 - turn;
    }
    display();
    info();
    status();
}

function status() {
    var stats = document.getElementById("status");
    stats.style.display = "block";
    stats.innerHTML = "WHITE " + totalWhite + " BLACK " + totalBlack;
}

function info() {
    if(noMove(turn) == true){
        var colornow;
        document.getElementById("information").style.display = "block";
        if(noMove(1 - turn) == true){
            if(totalWhite > totalBlack) colornow = "WHITE";
            else if(totalWhite < totalBlack) colornow = "BLACK";
            else colornow = "TIE";
            document.getElementById("information").innerHTML = "The game has ended because no valid moves. Winner = " + colornow;
            return ;
        }
        if(turn == 0) colornow = "WHITE";
        else colornow = "BLACK";
        document.getElementById("information").innerHTML = colornow + " has no valid moves";
        turn = 1 - turn;
    }else{
        document.getElementById("information").style.display = "block";
        var colornow;
        if(turn == 0) colornow = "WHITE";
        else colornow = "BLACK";
        document.getElementById("information").innerHTML = colornow + " TURN";
    }
}