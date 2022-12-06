document.addEventListener('keydown', function(event){
	if((event.keyCode == KEYPRESSED_W || event.keyCode == KEYPRESSED_UP) && snake.directionY != MOVE_DOWN) { //w character pressed and snake doesn't move down, move up
		snake.directionX = X_STAY;
		snake.directionY = MOVE_UP;
	} else if((event.keyCode == KEYPRESSED_S || event.keyCode == KEYPRESSED_DOWN)  && snake.directionY != MOVE_UP) { //s character pressed, move down
		snake.directionX = X_STAY;
		snake.directionY = MOVE_DOWN;
	} else if((event.keyCode == KEYPRESSED_A || event.keyCode == KEYPRESSED_LEFT)  && snake.directionX != MOVE_RIGHT) { //a character pressed, move left
		snake.directionX = MOVE_LEFT;
		snake.directionY = Y_STAY;
	} else if((event.keyCode == KEYPRESSED_D || event.keyCode == KEYPRESSED_RIGHT)  && snake.directionX != MOVE_LEFT) { //d character pressed, move right
		snake.directionX = MOVE_RIGHT;
		snake.directionY = Y_STAY;
	}
});