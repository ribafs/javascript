## jQueryMobile

Mesmo que tenha jquery em seu nome, jQueryMobile encoraja uma forma inteiramente diferente da que
temos visto com jQuery.

� um framework para desenvolver aplicativos mobile responsives e com ele geralmente n�o usamos CSS 
nem JavaScript, apenas indicamos suas classes e IDs que ele faz o resto.

Para conhecer mais sobre o jQueryMobile veja seus demos na pasta completa do download.

Algo interessante do jQueryMobile � que ele cria opaginas l�gicas em apenas um arquivo html, que
funcional como se fossem v�rios arquivos.

Para criar uma p�gina l�gica precisamos de uma div contendo um ID e um data-role="page", assim:
```html
<section id="Pagina1" data-role="page">
```
Para chamar esta p�gina acima usamos:
```html
<a href="#pagina1">P�gina 1</a>
```
No pacote baixado a jQueryMobile j� traz uns 50 �cones.

Primeira p�gina a ser aberta
Lembrando que a pripeira das p�ginas l�gicas a ser aberta � a primeira na ordem de cria��o.

Exemplo:
```html
<!DOCTYPE html> 
<html> 
<head> 
    <title>jQuery Mobile</title>    
    <meta name="viewport" content="width=device-width, initial-scale=1"> 
    <meta charset="UTF-8"/>
    <link rel="stylesheet" href="http://code.jquery.com/mobile/1.1.1/jquery.mobile-1.1.1.min.css" />
    <script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
    <script src="http://code.jquery.com/mobile/1.1.1/jquery.mobile-1.1.1.min.js"></script>
</head> 
 
<body> 
    <div data-role="page" id="pag1"> 
        <div data-role="header">
            <h1>T�tulo 1</h1>
        </div> 
 
        <div data-role="content">
            <h3>Esta � a p�gina 1</h3>
            <a href="#pag2">P�gina 1...</a>
        </div> 
 
        <div data-role="footer">
            <h1>Rodap� 1</h1>
        </div> 
    </div> 
 
    <div data-role="page" id="pag2"> 
        <div data-role="header">
            <h1>T�tulo 2</h1>
        </div> 
 
        <div data-role="content">
            <h3>Esta � a p�gina 2</h3>
            <a href="#pag1">... P�gina 1</a>
        </div> 
 
        <div data-role="footer">
            <h1>Rodap� 2</h1>
        </div> 
    </div>    

    <div data-role="page" id="pag3"> 
        <div data-role="header">
            <h1>T�tulo 3</h1>
        </div> 
 
        <div data-role="content">
            <h3>Esta � a p�gina 3</h3>
            <a href="#pag2">... P�gina 2</a>
        </div> 
 
        <div data-role="footer">
            <h1>Rodap� 3</h1>
        </div> 
    </div>    
	
</body>
</html>
```

Read more: http://www.linhadecodigo.com.br/artigo/3514/jquery-mobile-estrutura-da-pagina.aspx#ixzz45SlI2MaU

## Plataformas

Algo importante de um framework como o jQueryMobile � que ele suporta plataformas distintas como
iOS e Android. O programador n�o precisa se preocupar com as diferen�as entre as plataformas e seu
c�digo ser� compat�vel com ambas.

