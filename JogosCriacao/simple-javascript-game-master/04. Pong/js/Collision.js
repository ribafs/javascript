function hitYBound(y) {
	return ((y == 0) || (y == SCREEN_HEIGHT));
}

function hitPlayer(player, rightside, ball) {
	var new_x = ball.x + ball.deltax;
	var new_y = ball.y;
	if(new_y < 0) new_y = 0;
	if(new_y > SCREEN_HEIGHT) new_y = SCREEN_HEIGHT;
	var lower_y = player.y;
	var upper_y = player.y + LENGTH;
	var bound_x = player.x + ((rightside == 1)?THICKNESS : 0);
	if(new_x == bound_x) {
		return ((lower_y <= new_y) && (new_y <= upper_y));
	}
	return false;
}

function checkBorder(x) {
	if(x == 0) return 1;
	if(x == SCREEN_WIDTH) return 2;
	return 0;
}