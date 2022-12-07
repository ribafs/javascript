# Select múltiplo usando o selectize

Site oficial

https://selectize.github.io/selectize.js/

## Exemplo

```html
<!DOCTYPE html>
<!--[if lt IE 7]><html class="no-js lt-ie9 lt-ie8 lt-ie7"><![endif]-->
<!--[if IE 7]><html class="no-js lt-ie9 lt-ie8"><![endif]-->
<!--[if IE 8]><html class="no-js lt-ie9"><![endif]-->
<!--[if gt IE 8]><!--><html class="no-js"><!--<![endif]-->
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<title>Selectize.js Demo</title>
		<meta name="description" content="">
		<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
		<link rel="stylesheet" href="css/normalize.css">
		<link rel="stylesheet" href="css/stylesheet.css">
		<!--[if IE 8]><script src="js/es5.js"></script><![endif]-->
		<script src="js/jquery.min.js"></script>
		<script src="../dist/js/standalone/selectize.js"></script>
		<script src="js/index.js"></script>
	</head>
    <body>
		<div id="wrapper">
			<h1>Selectize.js</h1>

			<div class="demo">
				<h2>&lt;select multiple&gt;</h2>
				<div class="control-group">
					<label for="select-state">States:</label>
					<select id="select-state" name="state[]" multiple class="demo-default" style="width:50%" placeholder="Select a state...">
						<option value="">Select a state...</option>
						<option value="AL">Alabama</option>
						<option value="AK">Alaska</option>
						<option value="AZ">Arizona</option>
						<option value="AR">Arkansas</option>
						<option value="CA" selected>California</option>
						<option value="CO">Colorado</option>
						<option value="CT">Connecticut</option>
						<option value="DE">Delaware</option>
						<option value="DC">District of Columbia</option>
						<option value="FL">Florida</option>
						<option value="GA">Georgia</option>
						<option value="HI">Hawaii</option>
						<option value="ID">Idaho</option>
						<option value="IL">Illinois</option>
						<option value="IN">Indiana</option>
						<option value="IA">Iowa</option>						
					</select>
				</div>
				<script>
				$('#select-state').selectize({
					maxItems: 5
				});
				</script>
			</div>
		</div>
	</body>
</html>
```
## Dica do Johnathan Douglas no Laravel Brasil

Valeu Johnathan :)

## Usando o Select2

https://select2.org/getting-started/installation

Este exemplo funcionou somente baixando o css e o js da página Basic usage com Ctrl+U

https://select2.org/getting-started/basic-usage

## Exemplo adaptado do site

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<link href="./select2.css" rel="stylesheet" />
<script src="./select2.js"></script>

Estados<br>
<select class="js-example-basic-multiple" name="states[]" multiple="multiple">
  <option value="CE">Ceará</option>
  <option value="RJ">Rio de Janeiro</option>
  <option value="SP">São Paulo</option>
</select>

<script>
$(document).ready(function() {
    $('.js-example-basic-multiple').select2();
});
</script>
</body>
</html>
```
## Testando
Faça o download do pequeno exemplo acima e do select2.css e select2.js abaixo

[select2.css](https://raw.githubusercontent.com/ribafs/tutoriais/master/2Frontend/JS/select2.css)

[select2.js](https://raw.githubusercontent.com/ribafs/tutoriais/master/2Frontend/JS/select2.js)
