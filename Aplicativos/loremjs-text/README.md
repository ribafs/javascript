Lorem.js Dummy Text/Image Generator - Native JS
========================================================
A Lorem Ipsum creator service written on JavaScript.


Implementation
--------------

Implementation of Lorem.js is so simple,

You just download and add

    <script src="path/to/lorem.js"></script>

into your website/application and run.

If you want to put a lorem text inside a DIV (etc.) tag just write:

    <div data-lorem="2p"></div>

If you want a random length of lorem text within a range just write:

    <div data-lorem="2-4p"></div>

Querying
--------

Lorem.js has a simple query language: "how many?, what?"

    2p = 2 paragraphs
    5s = 5 sentences
    6w = 6 words
    1-6w = between 1 and 6 words

That's it.

Dummy Images
------------

And Lorem.js uses lorempixel.com for images for now.

Usage:

    <img src="" data-lorem="sports/1/Test message" width="223" height="223">
    <img src="" data-lorem="gray" width="100" height="124">
    <img src="" data-lorem="gray animals" width="100" height="124">

And watch what happens :)

Feel free to ask questions.
