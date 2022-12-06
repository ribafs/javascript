# teclado-numerico-virtual

## Uso
* Requiere

```html
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js" type="text/javascript"></script>
	<link rel="stylesheet" type="text/css" href="css/virtual-key.css">
```
* JQuery
```JavaScript
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
```
* HTML
```html
  <input type="text" readonly id="campo" class="teclado_text"> 

	<table class="table_teclado">
		<tr>
			<td>1</td>
			<td>2</td>
			<td>3</td>
		</tr>
		<tr>
			<td>4</td>
			<td>5</td>
			<td>6</td>
		</tr>
		<tr>
			<td>7</td>
			<td>8</td>
			<td>9</td>
		</tr>
		<tr>
			<td colspan="2">0</td>
			<td><img class="btn_delete" src="images/borrar.png"></td>
		</tr>
	</table>
```
* Ver <a target="_blank" href="http://rawgit.com/linzero/teclado-numerico-virtual/master/index.html">DEMO</a>

* Autores y contribuidores
<br>
@linzero

