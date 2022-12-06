What is a variable `var`
---

This is a way for the program to remember things for the future. Programmers use them to break difficult problems into steps. For example, how much is 13% of $450 minus $10 comission?
This is how a programmer would break down the problem.

	var seekedPercent = 0.13
	var totalMoney = 450
	var comission = 10
	
	var seekedPercentOfMoney = seekedPercent * totalMoney
	var finalResult =  seekedPercentOfMoney - comission

Notice that 1st 3 variables are used to store particular values, and last 2 are used to break up the actual calculation into smaller tasks. This hopefully makes it much easier than doing everything in 1 step.

===

What is a `function`?
---

You can think of functions as of formulas or recipes to do something in a few steps. You can give that recipe a name and use it as many time as you like. Let's have a look at an example:

	function drawLine() {
	  takePencil()
		pressToPaper()
		moveHand()
	}
	
	drawLine()
	drawLine()

So as you see, a function `drawLine` is used to describe steps necessary to draw a line. But this is not all about function. They are really good at changing things you give to them into other things. Each function is a small machine, that can take some ingredients, do something with them, and return a product. Think of a simple multiplying machine.

	function multiplyBy100(num) {
		return num * 100
	}
	
	multiplyBy100(2) => 200
	multiplyBy100(-1.232) => -123.2

You can pass more arguments, just separate them with a comma:

	function addTwoThings(a, b) {
		return a + b
	}
	
	addTwoThings(10, 20) => 30
	addTwoThings(-1, 1) => 0


