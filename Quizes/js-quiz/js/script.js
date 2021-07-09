//need to create the submitAnswers() function for the quizForm form
function submitAnswers(){
	var total = 5; //total number of question
	var score = 0;

	//get user input through name of form and names of inputs
	var q1 = document.forms['quizForm']['q1'].value;
	var q2 = document.forms['quizForm']['q2'].value;
	var q3 = document.forms['quizForm']['q3'].value;
	var q4 = document.forms['quizForm']['q4'].value;
	var q5 = document.forms['quizForm']['q5'].value;
	//alert(q1);


	//now validation to see if all have been checked
	for (i=1; i<=total; i++) {

		if(eval('q'+i)==null || eval('q'+i)==''){
			alert('You havent selected anything for question '+i+'!');
			return false; //does not allow the form to submit
		}

	}

	//set corret answers in an array
	var answers = ['b','a','d','b','d'];

	//check answers
	for (i=1; i<=total; i++){
		if(eval('q'+i)==answers[i-1]){
			score++;
		}
	}

	var result = document.getElementById('results');
	results.innerHTML = '<h3>You scored <span>'+score+'</span> out of <span>' +total+ '</span>!';

	alert('You scored ' + score + ' out of ' + total);

	return false; //we're not actually submittin a form
	//when submitting a form it will usually go to a PHP file or some kind of server side file that can actually process it
	//when using javascript we are catching that submission before it actually goes through


}