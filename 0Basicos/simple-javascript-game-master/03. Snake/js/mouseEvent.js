document.addEventListener('click', function(event){

	var rect = canvas.getBoundingClientRect();
	mouseX = event.clientX - rect.left;
	mouseY = event.clientY - rect.top;
	if(game_state == DEAD && LEFTSIDE <= mouseX && mouseX <= LEFTSIDE + WIDTH_BOX && UPSIDE + 3 * OFFSET <= mouseY && mouseY <= UPSIDE + HEIGHT_BOX) game_state = MAIN_MENU;
	else if(game_state == MAIN_MENU && LEFTSIDE <= mouseX && mouseX <= LEFTSIDE + WIDTH_BOX && UPSIDE + 3 * OFFSET <= mouseY && mouseY <= UPSIDE + HEIGHT_BOX) game_state = IN_GAME, firstPressed = 1;
});