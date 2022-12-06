function isCollision(snake) {
	var head = snake.position[0];
	var hit = false;
	for(var i = 1;i < snake.position.length;i++) {
		if((head[0] == snake.position[i][0]) && (head[1] == snake.position[i][1])) hit = true;
	}
	return hit;
}