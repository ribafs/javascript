## jQueryMobile Resumo

http://jquerymobile.com

CDN
```html
<link rel="stylesheet" href="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css" />
<script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
<script src="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>
```

É um framework para a interface do usuário, que é criada usando o core da jQuery e da jQuery UI.
É usada para desenvolver aplicativos mobile e sites web responsives.
Criado pela equipe da jQuery em 2010.

## Características:

- Usada da mesma forma em dispositivos mobile, tablets e desktop.
- Compatível com os frameworks Ionic, Phonegap, Whitelight, etc
- Traz um conjunto de inputs de forms touch-friendly e widgets UI
- É open source e cross plataforma e cross browser
- É escrito em JavaScript e usa recursos da jQuery e jQuery UI para criar sites mobile-friendly
- Ele integra HTML5, CSS3 jQuery e jQuery UI em um único framework para a criação de páginas com o mínimo de scripts.
- Inclue o sistema de navegação com Ajax que usa animação nas mudanças de página

## Vantagens

- Fácil de aprender e desenvolver aplicações para quem conhece HTML e CSS.
- Podemos criar o tema personalizado usando ThemeRoller sem escrever nenhuma linha de código. Suporta todos os HTML5 navegadores.
- Escreva o mesmo código para mobile e desktop

## Exemplo:
```html
<!DOCTYPE html>
<html>
    <head>
        <meta name = "viewport" content = "width = device-width, initial-scale = 1">
        <link rel = "stylesheet" href = "https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css">
        <script src = "https://code.jquery.com/jquery-1.11.3.min.js"></script>
        <script src = "https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>
    </head>
    <body>
        <div data-role = "page" id = "pageone">
            <div data-role = "header">
                <h1>Header Text</h1>
            </div>
            <div data-role = "main" class = "ui-content">
                <h2>Welcome to TutorialsPoint</h2>
            </div>
            <div data-role = "footer">
                <h1>Footer Text</h1>
            </div>
        </div>
    </body>
</html>
```

## Demos
http://demos.jquerymobile.com/1.4.5/

## Diálogos

<a href="dialog.html" class="ui-shadow ui-btn ui-corner-all ui-btn-inline" data-transition="pop">Open dialog</a> 

<a href="dialog.html" role="button" class="ui-shadow ui-btn ui-corner-all ui-btn-inline" data-transition="slidedown">data-transition="slidedown"</a> 

http://demos.jquerymobile.com/1.4.0/pages-dialog/
https://api.jquerymobile.com/dialog/

## Botões

http://demos.jquerymobile.com/1.4.5/button-markup/
```html	
<a href="#" class="ui-btn">Anchor</a>
<button class="ui-btn">Button</button>

<a href="#" class="ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all">No text</a>
<div id="custom-border-radius">
    <a href="#" class="ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all">No text</a>
</div>

<a href="#" class="ui-btn ui-btn-inline">Anchor</a>
<button class="ui-btn ui-btn-inline">Button</button>

<a href="#" class="ui-btn">Anchor - Inherit</a>
<a href="#" class="ui-btn ui-btn-a">Anchor - Theme swatch A</a>
<a href="#" class="ui-btn ui-btn-b">Anchor - Theme swatch B</a>
<button class="ui-btn">Button - Inherit</button>
<button class="ui-btn ui-btn-a">Button - Theme swatch A</button>
<button class="ui-btn ui-btn-b">Button - Theme swatch B</button>
```

## PopUps
```html	
<a href="#popupBasic" data-rel="popup" class="ui-btn ui-corner-all ui-shadow ui-btn-inline" data-transition="pop">Basic Popup</a>
<div data-role="popup" id="popupBasic">
<p>This is a completely basic popup, no options set.</p>
</div>
```

## ToolTip
```html
<p>A paragraph with a tooltip. <a href="#popupInfo" data-rel="popup" data-transition="pop" class="my-tooltip-btn ui-btn ui-alt-icon ui-nodisc-icon ui-btn-inline ui-icon-info ui-btn-icon-notext" title="Learn more">Learn more</a></p>
<div data-role="popup" id="popupInfo" class="ui-content" data-theme="a" style="max-width:350px;">
  <p>Here is a <strong>tiny popup</strong> being used like a tooltip. The text will wrap to multiple lines as needed.</p>
</div>
```

## Menu
```html
<a href="#popupMenu" data-rel="popup" data-transition="slideup" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-gear ui-btn-icon-left ui-btn-a">Actions...</a>
<div data-role="popup" id="popupMenu" data-theme="b">
        <ul data-role="listview" data-inset="true" style="min-width:210px;">
            <li data-role="list-divider">Choose an action</li>
            <li><a href="#">View details</a></li>
            <li><a href="#">Edit</a></li>
            <li><a href="#">Disable</a></li>
            <li><a href="#">Delete</a></li>
        </ul>
</div>
```

## Form

```html
<a href="#popupLogin" data-rel="popup" data-position-to="window" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-check ui-btn-icon-left ui-btn-a" data-transition="pop">Sign in</a>
<div data-role="popup" id="popupLogin" data-theme="a" class="ui-corner-all">
    <form>
        <div style="padding:10px 20px;">
            <h3>Please sign in</h3>
            <label for="un" class="ui-hidden-accessible">Username:</label>
            <input name="user" id="un" value="" placeholder="username" data-theme="a" type="text">
            <label for="pw" class="ui-hidden-accessible">Password:</label>
            <input name="pass" id="pw" value="" placeholder="password" data-theme="a" type="password">
            <button type="submit" class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-btn-icon-left ui-icon-check">Sign in</button>
        </div>
    </form>
</div>
```

## Diálogo
```html
<a href="#popupDialog" data-rel="popup" data-position-to="window" data-transition="pop" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-delete ui-btn-icon-left ui-btn-b">Delete page...</a>
<div data-role="popup" id="popupDialog" data-overlay-theme="b" data-theme="b" data-dismissible="false" style="max-width:400px;">
    <div data-role="header" data-theme="a">
    <h1>Delete Page?</h1>
    </div>
    <div role="main" class="ui-content">
        <h3 class="ui-title">Are you sure you want to delete this page?</h3>
    <p>This action cannot be undone.</p>
        <a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back">Cancel</a>
        <a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back" data-transition="flow">Delete</a>
    </div>
</div>
```

## ToolBar
```html
<div data-role="header">
    <a href="#" class="ui-btn-left ui-btn ui-btn-inline ui-mini ui-corner-all ui-btn-icon-left ui-icon-delete">Cancel</a>
<h1>My App</h1>
    <button class="ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-mini ui-corner-all ui-btn-icon-right ui-icon-check">Save</button>
</div>

<div data-role="header">
    <div data-role="controlgroup" data-type="horizontal" class="ui-mini ui-btn-left">
        <a href="#" class="ui-btn ui-btn-icon-right ui-icon-plus">Add</a>
        <a href="#" class="ui-btn ui-btn-icon-right ui-icon-arrow-u">Up</a>
        <a href="#" class="ui-btn ui-btn-icon-right ui-icon-arrow-d">Down</a>
    </div>
    <h6>My header</h6>
</div>
```

## Select
```html
<form>
<div class="ui-field-contain">
    <label for="select-native-1">Basic:</label>
    <select name="select-native-1" id="select-native-1">
        <option value="1">The 1st Option</option>
        <option value="2">The 2nd Option</option>
        <option value="3">The 3rd Option</option>
        <option value="4">The 4th Option</option>
    </select>
</div>
</form>
```

