module("Sprite")

test("Sprite stepToWhile", function() {
  var sprite = new jaws.Sprite({x: 0, y: 0, color: "white"});

  sprite.stepToWhile(10, 12, function(sprite) {
    if(sprite.x == 10) return false;  // Faked collision!
    if(sprite.y == 12) return false;  // Faked collision!
    return true;
  });

  equal(sprite.x, 9, "sprite stepped to x=9");
  equal(sprite.y, 11, "sprite stepped to y=10");
});

test("Sprite moveTo", function() {
  var sprite = new jaws.Sprite({x: 0, y: 0, color: "white"});

  sprite.moveTo(10, 10)
  equal(sprite.x, 10, "moveTo with normal arguments");
  equal(sprite.y, 10, "moveTo with normal arguments");

  sprite.moveTo([20, 20])
  equal(sprite.x, 20, "moveTo with array-arg");
  equal(sprite.y, 20, "moveTo with array-arg");

});

test("Sprite without pre-loaded image", function() {
  /* We might get a race-condition in these tests */
  jaws.assets.root = ""
  var sprite = new jaws.Sprite({image: 'assets/rect_copy.png'})
  deepEqual(sprite.rect(), undefined, "undefined sprite.rect() since image isn't preloaded")
});

test("Sprite special options", function() {
  sprite = new jaws.Sprite({dom: null, _constructor: "Troll"})
  equal(sprite.options["_constructor"], "Troll")
});

test("Sprite defaults", function() {
  sprite = new jaws.Sprite({})
  equal(sprite.x, 0, "x defaults to 0")
  equal(sprite.y, 0, "y defaults to 0")
  equal(sprite.angle, 0, "angle defaults to 0")
  equal(sprite.scale_x, 1, "scale_x defaults to 1 (no scaling)")
  equal(sprite.scale_y, 1, "scale_y defaults to 1 (no scaling)")
  equal(sprite.anchor_x, 0, "anchor_x defaults to 0 (top)")
  equal(sprite.anchor_y, 0, "anchor_y defaults to 0 (left)")
  //equal(sprite.image, null, "image defaults to undefined")
  equal(sprite.flipped, false, "flipped defaults to false")
  equal(sprite.alpha, 1, "alpha defalts to 1 (zero fading)")
});

test("Sprite without image", function() {
  sprite = new jaws.Sprite({x:0, y:0})
  ok(sprite.image, "sprite without image-argument gets autocreated white rect as image")
  equal(sprite.width, 16, "autocreated sprite width")
  equal(sprite.height, 16, "autocreated sprite height")
 
  stop();
  var assets = new jaws.Assets().setRoot("assets/").add("rect.png").loadAll({onload: assetsLoaded})

  function assetsLoaded() {
    sprite.setImage( assets.get("rect.png") );
    equal(sprite.width, 20, "gets width after setImage()");
    equal(sprite.height, 20, "gets height after setImage()");
    start();
  }
});

test("Sprite", function() {
  stop();
  var assets = new jaws.Assets().setRoot("assets/").add("rect.png").loadAll({onload: loaded});

  function loaded() {
    sprite = new jaws.Sprite({image: assets.get("rect.png"), x:0, y:0});
    equal(sprite.width, 20, "sprite.width");
    equal(sprite.height, 20, "sprite.height");

    sprite.scaleAll(2);
    equal(sprite.rect().width, 40, "sprite.rect().width after scaling x2");
    equal(sprite.rect().height, 40, "sprite.rect().height after scaling x2") ;

    deepEqual(sprite.rect(), new jaws.Rect(0,0,40,40), "sprite.rect()");

    sprite.setAnchor("bottom_right");
    equal(sprite.x, sprite.rect().right, "sprite.x == sprite.rect().right when anchor is bottom_right");
    equal(sprite.y, sprite.rect().bottom, "sprite.y == sprite.rect().bottom when anchor is bottom_right");

    sprite.setAnchor("top_left");
    equal(sprite.x+sprite.width, sprite.rect().right, "sprite.x+sprite.width == sprite.rect().right when anchor is top_left");
    equal(sprite.y+sprite.height, sprite.rect().bottom, "sprite.y+sprite.height == sprite.rect().bottom when anchor is top_left");

    sprite.rotateTo(45);
    equal(sprite.angle, 45, "sprite.rotateTo() modifies angle");
    sprite.rotate(45);
    equal(sprite.angle, 90, "sprite.rotate() adds to angle #2");

    sprite.moveTo(100,100);
    equal(sprite.x, 100, "sprite.moveTo() sets sprite x/y");
    equal(sprite.y, 100, "sprite.moveTo() sets sprite x/y");

    sprite.move(10,12);
    equal(sprite.x, 110, "sprite.move() adds to sprite x/y");
    equal(sprite.y, 112, "sprite.move() adds to sprite x/y");

    sprite.scaleTo(1);
    equal(sprite.width, 20, "sprite.scaleTo forces a scale_factor");

    sprite.setWidth(80);
    equal(sprite.width, 80, "sprite.setWidth forces a new width via scale_x");
    equal(sprite.scale_x, 4, "sprite.setWidth forces a new width via scale_x");

    sprite.setHeight(40);
    equal(sprite.height, 40, "sprite.setHeight forces a new width via scale_y");
    equal(sprite.scale_y, 2, "sprite.setHeight forces a new width via scale_y");

    sprite.resizeTo(20,20);
    equal(sprite.width, 20, "resize() sets width via scale_x");
    equal(sprite.height, 20, "resize() sets width via scale_x");

    sprite.resize(-10,-10);
    equal(sprite.width, 10, "resize() mods width via scale_x");
    equal(sprite.height, 10, "resize() mods width via scale_x");

    var flipped = sprite.flipped;
    sprite.flip();
    equal(sprite.flipped, !flipped, "sprite.flip inverts flipped");
    sprite.flip();
    equal(sprite.flipped, flipped, "sprite.flip inverts flipped");

    sprite2 = new jaws.Sprite({image: assets.get("rect.png"), scale_image: 2});
    equal(sprite2.width, 40, "Sprite({scale_image: 2}) and sprite.width");
    equal(sprite2.height, 40, "Sprite({scale_image: 2}) and sprite.height");
  
    start();
  }
})

test ("Add layer to parallax", function() {
  var parallax1 = new jaws.Parallax({
    repeat_x: true,
    repeat_y: false
  });
  parallax1.addLayer({
    image: "rect.png",
    damping: 1,
  });
  parallax1.addLayer({
    image: "rect.png",
    damping: 2,
  });

  var parallax2 = new jaws.Parallax({
    repeat_x: true,
    repeat_y: false
  });
  parallax2.addLayer({
    image: "rect.png",
    damping: 2,
  });

  equal(parallax1.layers.length, 2, "Two layers has been added");
  equal(parallax2.layers.length, 1, "Only One layer has been added");
  deepEqual(jaws.Parallax.prototype.default_options.layers, [], "Parallax default options should remain intact");
});
