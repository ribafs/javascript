module("Sprite Sheet")

test("SpriteSheet", function() {
  stop();
  var assets = new jaws.Assets().setRoot("assets/").add("droid_11x15.png").loadAll({onload: assetsLoaded})

  function assetsLoaded() {
    sprite_sheet = new jaws.SpriteSheet( {image: assets.get("droid_11x15.png"), frame_size: [11,15]} )
  
    ok( assets.get("droid_11x15.png"), "asset available")
    ok( jaws.isDrawable( assets.get("droid_11x15.png") ), "isDrawable")
    deepEqual(sprite_sheet.frame_size, [11,15], "frame_size")
    equal(sprite_sheet.frames[0].toString(), "[object HTMLCanvasElement]", "one frame is canvas")
    equal(sprite_sheet.frames.length, 14, "correct number of frames")
    
  /*
    TODO: figure out how to test this
    sprite_sheet = new jaws.SpriteSheet( {image: "droid_11x15.png"} )
    deepEqual(sprite_sheet.frame_size, [11,15], "frame_size autodetection from filename")
  */
    start();
  }
})


