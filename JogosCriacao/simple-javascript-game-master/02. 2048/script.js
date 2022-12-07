var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var width = 640;
var height = width;
var blockSize = width / 4;

function start(){
    document.getElementById("myButton").innerHTML = "RESTART";
    canvas.style.display ="block";
    var game = new myGame();
    window.addEventListener("keypress",function(e) {
        var keyCheck = e.keyCode;
        if(keyCheck >= 37 && keyCheck <= 40) {
            if(game.canMove(keyCheck - 37) == true) {
                game.move(keyCheck - 37);
                document.getElementById("points").innerHTML = "YOUR POINTS " + game.points;
                game.randomizePosition();
            }
        }
    },false);
    
}

class myGame{
    constructor(){
        this.value = [
        [1,1,1,1],
        [1,1,1,1],
        [1,1,1,1],
        [1,1,1,1]
        ];
        this.display = [2];
        for(var i = 0; i < 15; i++) {
            this.display.push(this.display[i] * 2);
        }
        this.color = [
            ['#998E8E','white'],
            ['#EEE4DA','#776E65'],
            ['#EDE0C8','#776E65'],
            ['#F2B179','white'],
            ['#F59563','white'],
            ['#F67C5F','white'],
            ['#F65E3B','white'],
            ['#EDCF72','white'],
        ];
        this.points = 0;
        this.randomizePosition();
    }

    randomizePosition() {
        var x = Math.floor((Math.random() * 15));
        var val = Math.floor((Math.random()) * 2) * 2 + 2;
        var assigned = false;
        for(var i = x; i >= 0; i--) {
            var posX = i % 4;
            var posY = Math.floor(i / 4);
            if(this.value[posY][posX] == 1) {
                this.value[posY][posX] = val;
                assigned = true;
                break;
            }
        }
        if(assigned == false) {
            for(var i = x + 1; i < 16; i++) {
                var posX = i % 4;
                var posY = Math.floor(i / 4);
                if(this.value[posY][posX] == 1) {
                    this.value[posY][posX] = val;
                    assigned = true;
                    break;
                }
            } 
        }
        if(assigned == true) {
            this.drawField();
        }
        else {
            canvas.style.display = "none";
            document.getElementById("status").style.display = "block";
        }
    }
    drawField() {
        for(var row = 0; row < 4; row++) {
            for(var col = 0; col < 4; col++) {
                var shifted = 0;
                for(shifted = 0; (1<<shifted) < this.value[row][col]; shifted++) ;
                //Draw box
                ctx.fillStyle = this.color[shifted][0];
                ctx.fillRect(col * blockSize, row * blockSize, blockSize,blockSize);
                //Draw Border
                ctx.lineWidth = 10;
                ctx.strokeStyle = "#5E5757";
                ctx.strokeRect(col * blockSize, row * blockSize, blockSize,blockSize);
                if(shifted != 0) {
                    //Draw Numbers;
                    ctx.font = "30px Montserrat";
                    ctx.fillStyle = this.color[shifted][1];
                    ctx.fillText(this.value[row][col], col * blockSize + blockSize/2, row * blockSize + blockSize/2);

                }
            }
        }
    }

    canMove(directions) {
        if(directions == 0) { //left
            for(var row = 0; row < 4; row++) {
                for(var col = 0; col < 4; col++) {
                    if(this.value[row][col] == 1) {
                        var touch = false;
                        for(var temp = col ; temp < 4; temp++) {
                            if(this.value[row][temp] != 1) {
                                return true;
                            }
                        }
                    }
                    else {
                        for(var temp = col + 1; temp < 4; temp++) {
                            if(this.value[row][temp] == 1) continue;
                            if(this.value[row][temp] == this.value[row][col]) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        else if(directions == 1) { //up
            for(var col = 0; col < 4; col++) {
                for(var row = 0; row < 4; row++) {
                    if(this.value[row][col] == 1) {
                        var touch = false;
                        for(var temp = row ; temp < 4; temp++) {
                            if(this.value[temp][col] != 1) {
                                return true;
                            }
                        }
                    }
                    else {
                        for(var temp = row + 1; temp < 4; temp++) {
                            if(this.value[temp][col] == 1) continue;
                            if(this.value[temp][col] == this.value[row][col]) {
                                return true;
                            }
                            break;
                        }
                    }
                }
            }
        }
        else if(directions == 2) { //right
            for(var row = 0; row < 4; row++) {
                for(var col = 3; col >= 0; col--) {
                    if(this.value[row][col] == 1) {
                        var touch = false;
                        for(var temp = col ; temp >= 0; temp--) {
                            if(this.value[row][temp] != 1) {
                                return true;
                            }
                        }
                    }
                    else {
                        for(var temp = col - 1; temp >= 0; temp--) {
                            if(this.value[row][temp] == 1) continue;
                            if(this.value[row][temp] == this.value[row][col]) {
                                return true;
                            }
                            break;
                        }
                    }
                }
            }
        }
        else { //down
            for(var col = 0; col < 4; col++) {
                for(var row = 3; row >= 0; row--) {
                    if(this.value[row][col] == 1) {
                        for(var temp = row ; temp >= 0; temp--) {
                            if(this.value[temp][col] != 1) {
                                return true;
                            }
                        }
                    }
                    else {
                        for(var temp = row  -1; temp >= 0; temp--) {
                            if(this.value[temp][col] == 1) continue;
                            if(this.value[temp][col] == this.value[row][col]) {
                                return true;
                            }
                            break;
                        }
                    }
                }
            }
        }
        return false;
    }

    move(directions) {
        if(directions == 0) { //left
            for(var row = 0; row < 4; row++) {
                for(var col = 0; col < 4; col++) {
                    if(this.value[row][col] == 1) {
                        var touch = false;
                        for(var temp = col ; temp < 4; temp++) {
                            if(this.value[row][temp] != 1) {
                                this.value[row][col] = this.value[row][temp];
                                this.value[row][temp] = 1;
                                touch = true;
                                break;
                            }
                        }
                        if(touch == true) col--;
                    }
                    else {
                        for(var temp = col + 1; temp < 4; temp++) {
                            if(this.value[row][temp] == 1) continue;
                            if(this.value[row][temp] == this.value[row][col]) {
                                this.value[row][col] *= 2;
                                this.points += this.value[row][col];
                                this.value[row][temp] = 1;
                            }
                            break;
                        }
                    }
                }
            }
        }
        else if(directions == 1) { //up
            for(var col = 0; col < 4; col++) {
                for(var row = 0; row < 4; row++) {
                    if(this.value[row][col] == 1) {
                        var touch = false;
                        for(var temp = row ; temp < 4; temp++) {
                            if(this.value[temp][col] != 1) {
                                this.value[row][col] = this.value[temp][col];
                                this.value[temp][col] = 1;
                                touch = true;
                                break;
                            }
                        }
                        if(touch == true) row--;
                    }
                    else {
                        for(var temp = row + 1; temp < 4; temp++) {
                            if(this.value[temp][col] == 1) continue;
                            if(this.value[temp][col] == this.value[row][col]) {
                                this.value[row][col] *= 2;
                                this.points += this.value[row][col];
                                this.value[temp][col] = 1;
                            }
                            break;
                        }
                    }
                }
            }
        }
        else if(directions == 2) { //right
            for(var row = 0; row < 4; row++) {
                for(var col = 3; col >= 0; col--) {
                    if(this.value[row][col] == 1) {
                        var touch = false;
                        for(var temp = col ; temp >= 0; temp--) {
                            if(this.value[row][temp] != 1) {
                                this.value[row][col] = this.value[row][temp];
                                this.value[row][temp] = 1;
                                touch = true;
                                break;
                            }
                        }
                        if(touch == true) col++;
                    }
                    else {
                        for(var temp = col - 1; temp >= 0; temp--) {
                            if(this.value[row][temp] == 1) continue;
                            if(this.value[row][temp] == this.value[row][col]) {
                                this.value[row][col] *= 2;
                                this.points += this.value[row][col];
                                this.value[row][temp] = 1;
                            }
                            break;
                        }
                    }
                }
            }
        }
        else { //down
            for(var col = 0; col < 4; col++) {
                for(var row = 3; row >= 0; row--) {
                    if(this.value[row][col] == 1) {
                        var touch = false;
                        for(var temp = row ; temp >= 0; temp--) {
                            if(this.value[temp][col] != 1) {
                                this.value[row][col] = this.value[temp][col];
                                this.value[temp][col] = 1;
                                touch = true;
                                break;
                            }
                        }
                        if(touch == true) row++;
                    }
                    else {
                        for(var temp = row  -1; temp >= 0; temp--) {
                            if(this.value[temp][col] == 1) continue;
                            if(this.value[temp][col] == this.value[row][col]) {
                                this.value[row][col] *= 2;
                                this.points += this.value[row][col];
                                this.value[temp][col] = 1;
                            }
                            break;
                        }
                    }
                }
            }
        }
    }
}