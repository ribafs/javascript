const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//Screen Settings
const SCREEN_WIDTH = window.innerWidth - 20;
const SCREEN_HEIGHT = window.innerHeight - 20;
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

//FPS Settings
const FPS = 100000;
const FPS_INTERVAL = 1000 / FPS;

//Pong Const
const LENGTH = Math.floor(SCREEN_HEIGHT / 3); // length of stick
const HALF_LENGTH = Math.floor(LENGTH / 2); // get half length of stick
const MID_HEIGHT = Math.floor(SCREEN_HEIGHT / 2);
const MID_WIDTH = Math.floor(SCREEN_WIDTH / 2);
const PADDING = Math.floor(SCREEN_WIDTH / 20); // distance from the border side
const THICKNESS = 5;
const RADIUS_BALL = 1;
const INCREMENT = 0.5;

//Move 
const MOVE_UP = -1;
const MOVE_DOWN = 1;

//Color
const PONG_COLOR = "black";
const BACKGROUND_COLOR = "white";

//Keyboard Pressed
const KEYPRESSED_UP = 38;
const KEYPRESSED_DOWN = 40;
const KEYPRESSED_S = 83;
const KEYPRESSED_W = 87;

//Scoreboard
const OFFSET = 40;
const LOCATION_SCORE_Y = 80;
const INFO_Y = 40;