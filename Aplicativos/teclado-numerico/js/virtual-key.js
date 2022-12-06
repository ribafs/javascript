$(document).ready(function(){
	$('.table_teclado tr td').click(function(){
		var number = $(this).text();
		
		if (number == '')
		{
			$('#campo').val($('#campo').val().substr(0, $('#campo').val().length - 1)).focus();
		}
		else
		{
			$('#campo').val($('#campo').val() + number).focus();
		}

	});
});