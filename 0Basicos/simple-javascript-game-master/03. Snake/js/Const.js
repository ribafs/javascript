const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const WIDTH_CANVAS = 600;
const HEIGHT_CANVAS = 600;
const BLOCKSIZE = 15;
const WIDTH_GAME = WIDTH_CANVAS / BLOCKSIZE;
const HEIGHT_GAME = HEIGHT_CANVAS / BLOCKSIZE;
const STARTX = 5;
const STARTY = HEIGHT_GAME / 2;

//FPS Const
const FPS = 10;
const FPS_INTERVAL = 1000 / FPS;

//Movement Const
const MOVE_UP = -1;
const MOVE_DOWN = 1;
const MOVE_LEFT = -1;
const MOVE_RIGHT = 1;
const X_STAY = 0;
const Y_STAY = 0;

//Keypress Const
const KEYPRESSED_LEFT = 37;
const KEYPRESSED_UP = 38;
const KEYPRESSED_RIGHT = 39;
const KEYPRESSED_DOWN = 40;
const KEYPRESSED_A = 65;
const KEYPRESSED_D = 68;
const KEYPRESSED_S = 83;
const KEYPRESSED_W = 87;

//Color Const
const FOOD_COLOR = "red";
const BACKGROUND_COLOR = "white";
const SNAKE_COLOR = "black";

//Menu Const
const MAIN_MENU = 1;
const IN_GAME = 2;
const DEAD = 3;

//Button Const
const LEFTSIDE = 180;
const UPSIDE = 200;
const HEIGHT_BOX = 140;
const WIDTH_BOX = 175;
const OFFSET = 30;