function setup() {
    createCanvas(500, 700);
    // initialize everything
    shooterX = width/2;
    shooterY = height - 100;
    shooter = 20;
    speedShooter = 2;
    speedInvaderX = 0.3;
    speedInvaderY = 5;
    let res = createInvaderLocations(5, 10, 20, 50);
    locations = res[0];
    size = res[1];
    bulletLength = 20;
    bulletSpeed = 1;
}

// generate m rows and n columns of invaders based on paddingBottom(space between rows) 
// and paddingSides(space between the matrix of invaders and the edge of the canvas)
function createInvaderLocations(m, n, paddingBottom, paddingSides){
    let y = 100; // Y of the top row of invaders
    let locations = [];
    let space = 10
    let size = int((width - 2*paddingSides-n*space)/n);
    for (let i = 0; i < m; i++){
        let row = [];
        let x = paddingSides;
        for (let j = 0; j < n; j++){
            row[j] = [x, y];
            x += size+space;
        }
        locations[i] = row
        y += size + paddingBottom;
    }
    return [locations, size];
}

let shooterX
let shooterY
let shooter
let speedShooter
let speedInvaderX
let speedInvaderY
let direction = 1;
let switched = false;
let switched_check = false;
let locations = [];
let size
let bullets = [];
let bulletLength;
let bulletSpeed;

// check if invaders' moving direction need to change
// if so, change the direction and set direction switched flag
function updateDirection(locations, size){
    let endOfRow = locations[0][locations[0].length - 1][0];
    let startOfRow = locations[0][0][0];
    if (endOfRow + size >= width-speedInvaderX || startOfRow <= speedInvaderX){
        if (!switched_check){
            direction *= -1;
            switched = true;
        } else {
            switched_check = false;
        }
    }
}

function computeNewLocation(locations, size){
    // check if invaders' moving direction need to change
    updateDirection(locations, size);
    // if the direction is switched, move down a unit
    if (switched){
        for (let i = 0; i < locations.length; i++){
            for (let j = 0; j < locations[i].length; j++){
                if (locations[i][j] !== null){
                    locations[i][j][1] += speedInvaderY;
                }
            }
        }
        switched = false;
        switched_check = true;
    // if not, keep moving towards the same direction
    } else {
        for (let i = 0; i < locations.length; i++){
            for (let j = 0; j < locations[i].length; j++){
                if (locations[i][j] !== null){
                    locations[i][j][0] += speedInvaderX * direction;
                }
            }
        }
    }
}

// straightforward
function drawInvaders(locations, size){
    fill('white');
    for (let i = 0; i < locations.length; i++){
        let row = locations[i];
        for (let j = 0; j < row.length; j++){
            coordinates = row[j];
            if (coordinates !== null){
                x = coordinates[0];
                y = coordinates[1];
                if (i%2 == 0){
                    square(x, y, size);
                } else {
                    circle(x+size/2, y+size/2, size)
                }
            }
        }
    }
}

function drawBullets(){
    stroke(255, 204, 0);
    for (let i = 0; i < bullets.length; i++){
        bullet = bullets[i];
        if (bullet !== null){
            line(bullet[0], bullet[1], bullet[2], bullet[3]);
        }
    }
}

function computeNewBulletsLoc(){
    for (let i = 0; i < bullets.length; i++){
        if (bullets[i] !== null){
            bullets[i][1] -= bulletSpeed;
            bullets[i][3] -= bulletSpeed;
            for (let j = 0; j < locations.length; j++){
                for (let k = 0; k < locations[0].length; k++){
                    if (locations[j][k] !== null){
                        if (bullets[i][3] <= locations[j][k][1]+size && bullets[i][0] >= locations[j][k][0] && bullets[i][0] <= locations[j][k][0]+size){
                            bullets[i] = null;
                            locations[j][k] = null;
                            break;
                        }
                    } 
                }
            }
        }
        
    }
}

function keyPressed(){
    if (keyCode == UP_ARROW){
        bullets[bullets.length] = [shooterX, shooterY, shooterX, shooterY-bulletLength];
    }
}

function draw() {
    background(51);

    // invaders
    drawInvaders(locations, size);
    computeNewLocation(locations, size);

    // shooter functionings
    fill(255, 204, 0);
    circle(shooterX, shooterY, shooter);
    drawBullets();
    computeNewBulletsLoc();
    if (keyIsPressed){
        if (keyCode === RIGHT_ARROW) {
            shooterX += speedShooter;
        } else if (keyCode === LEFT_ARROW) {
            shooterX -= speedShooter;
        }
    }
}