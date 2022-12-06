function Food() {
	this.x = WIDTH_GAME - STARTX;
	this.y = STARTY;
	drawFood(this.x, this.y);
	this.ateBySnake = function(snake) {
		var head = snake.position[0];
		return ((this.x == head[0]) && (this.y == head[1]));
	}
	this.generate = function(snake) { //randomly generate possible position for new food
		var init = [];
		for(var i = 0;i < WIDTH_GAME;i++) {
			var tmp = new Array(HEIGHT_GAME);
			init.push(tmp);
		}
		var total = WIDTH_GAME * HEIGHT_GAME;
		for(var snakeBody of snake.position) {
			init[snakeBody[0]][snakeBody[1]] = 1;
			total--;
		}
		var num = Math.floor(Math.random() * total);
		for(var x = 0;x < WIDTH_GAME;x++) {
			for(var y = 0;y < HEIGHT_GAME;y++) {
				if(init[x][y] == 1) continue;
				if(num == 0) {
					this.x = x;
					this.y = y;
					drawFood(this.x, this.y);
					return ;
				}
				num--;
			}
		}
	}
}