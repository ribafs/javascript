document.addEventListener('keydown', function(event){
	if(event.keyCode == KEYPRESSED_W) { //w character pressed and snake doesn't move down, move up
		PLAYER_1_DIRECTION = MOVE_UP;
	} else if(event.keyCode == KEYPRESSED_S) { //s character pressed, move down
		PLAYER_1_DIRECTION = MOVE_DOWN;
	}
	if(event.keyCode == KEYPRESSED_UP) { //w character pressed and snake doesn't move down, move up
		PLAYER_2_DIRECTION = MOVE_UP;
	} else if(event.keyCode == KEYPRESSED_DOWN) { //s character pressed, move down
		PLAYER_2_DIRECTION = MOVE_DOWN;
	}
});