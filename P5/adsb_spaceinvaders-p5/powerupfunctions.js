const doubleshot = () => {
    player.numShots = 2;
    setTimeout(() => {
        player.numShots = 1;
    }, 5000); 
}

const tripleshot = () => {
    console.log("eeeeeeeeeelskfjd;")
    player.numShots = 3;
    setTimeout(() => {
        player.numShots = 1;
    }, 5000); 
}

const fastFire = () => {
    player.fireRate = 10;
    setTimeout(() => {
        player.fireRate = 30;
    }, 5000);  
}

const speedUp = () => {
    player.maxSpeed = 8;
    player.accel = 1.3;
    setTimeout(() => {
        player.maxSpeed = 5;
        player.accel = 0.7;
    }, 5000);  
}

const behaviors = [doubleshot, tripleshot, fastFire, speedUp];