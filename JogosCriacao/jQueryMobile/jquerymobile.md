## jQueryMobile

Mesmo que tenha jquery em seu nome, jQueryMobile encoraja uma forma inteiramente diferente da que
temos visto com jQuery.

É um framework para desenvolver aplicativos mobile responsives e com ele geralmente não usamos CSS 
nem JavaScript, apenas indicamos suas classes e IDs que ele faz o resto.

Para conhecer mais sobre o jQueryMobile veja seus demos na pasta completa do download.

Algo interessante do jQueryMobile é que ele cria opaginas lógicas em apenas um arquivo html, que
funcional como se fossem vários arquivos.

Para criar uma página lógica precisamos de uma div contendo um ID e um data-role="page", assim:
```html
<section id="Pagina1" data-role="page">
```
Para chamar esta página acima usamos:
```html
<a href="#pagina1">Página 1</a>
```
No pacote baixado a jQueryMobile já traz uns 50 ícones.

Primeira página a ser aberta
Lembrando que a pripeira das páginas lógicas a ser aberta é a primeira na ordem de criação.

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
            <h1>Título 1</h1>
        </div> 
 
        <div data-role="content">
            <h3>Esta é a página 1</h3>
            <a href="#pag2">Página 1...</a>
        </div> 
 
        <div data-role="footer">
            <h1>Rodapé 1</h1>
        </div> 
    </div> 
 
    <div data-role="page" id="pag2"> 
        <div data-role="header">
            <h1>Título 2</h1>
        </div> 
 
        <div data-role="content">
            <h3>Esta é a página 2</h3>
            <a href="#pag1">... Página 1</a>
        </div> 
 
        <div data-role="footer">
            <h1>Rodapé 2</h1>
        </div> 
    </div>    

    <div data-role="page" id="pag3"> 
        <div data-role="header">
            <h1>Título 3</h1>
        </div> 
 
        <div data-role="content">
            <h3>Esta é a página 3</h3>
            <a href="#pag2">... Página 2</a>
        </div> 
 
        <div data-role="footer">
            <h1>Rodapé 3</h1>
        </div> 
    </div>    
	
</body>
</html>
```

Read more: http://www.linhadecodigo.com.br/artigo/3514/jquery-mobile-estrutura-da-pagina.aspx#ixzz45SlI2MaU

## Plataformas

Algo importante de um framework como o jQueryMobile é que ele suporta plataformas distintas como
iOS e Android. O programador não precisa se preocupar com as diferenças entre as plataformas e seu
código será compatível com ambas.

