Introdução ao DOM com JS

With the object model, JavaScript gets all the power it needs to create dynamic HTML:

    JavaScript can change all the HTML elements in the page
    JavaScript can change all the HTML attributes in the page
    JavaScript can change all the CSS styles in the page
    JavaScript can remove existing HTML elements and attributes
    JavaScript can add new HTML elements and attributes
    JavaScript can react to all existing HTML events in the page
    JavaScript can create new HTML events in the page

var x = document.getElementsByTagName("p"); 
var x = document.getElementsByClassName("intro"); 

var x = document.querySelectorAll("p.intro"); 

Changing HTML Content
document.getElementById("demo").innerHTML = text;
document.getElementById(id).attribute = new value;
document.getElementById("myImage").src = "landscape.jpg";
document.getElementById(id).style.property = new style;
document.getElementById("p2").style.color = "blue";


The following HTML objects (and object collections) are also accessible:

    document.anchors
    document.body
    document.documentElement
    document.embeds
    document.forms
    document.head
    document.images
    document.links
    document.scripts
    document.title

Examples of HTML events:

    When a user clicks the mouse
    When a web page has loaded
    When an image has been loaded
    When the mouse moves over an element
    When an input field is changed
    When an HTML form is submitted
    When a user strokes a key


