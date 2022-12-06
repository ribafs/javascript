(function() {
  var Ball, GAME_HEIGHT, GAME_WIDTH, MOUSE_X, MOUSE_Y, O, Paddle, PlayerController, RandomController, SlowTrackerController, ball, bottomWall, camera, clamp, cpuScore, enemyPaddle, gameRunning, leftWall, mainLight, paddleMaterials, paddleMaterials2, playerPaddle, playerScore, pointLight, reflectMatrix, renderer, rightWall, scene, shadow, shadowMaterial, shadowTexture, topWall, update, updateScores;

  O = {
    WIDTH: 900,
    HEIGHT: 600,
    VIEW_ANGLE: 45,
    NEAR: 0.1,
    FAR: 10000
  };

  GAME_WIDTH = 30;

  GAME_HEIGHT = 20;

  MOUSE_X = null;

  MOUSE_Y = null;

  gameRunning = false;

  playerScore = 0;

  cpuScore = 0;

  clamp = function(number, min, max) {
    return Math.max(min, Math.min(number, max));
  };

  reflectMatrix = new THREE.Vector4(-1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1);

  Ball = (function() {
    Ball.prototype.object = null;

    function Ball(x, y, z) {
      var phi, speed, theta, x_speed, y_speed, z_speed;
      this.object = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshPhongMaterial({
        color: 0xBBBBBB,
        specular: 0xBBBBBB
      }));
      speed = 0.2;
      theta = 90;
      phi = 12;
      z_speed = speed * Math.sin(theta * Math.PI / 180) * Math.cos(phi * Math.PI / 180);
      x_speed = speed * Math.sin(theta * Math.PI / 180) * Math.sin(phi * Math.PI / 180);
      y_speed = speed * Math.cos(theta * Math.PI / 180);
      this.velocity = new THREE.Vector3(x_speed, y_speed, z_speed);
    }

    Ball.prototype.update = function(x, y, z) {
      return this.object.position.add(this.velocity);
    };

    Ball.prototype.collide = function(object) {
      var a, direction, new_velocity, normal, ray;
      direction = new THREE.Vector3(0, 0, 0).copy(this.velocity).setLength(1);
      ray = new THREE.Raycaster(this.object.position, direction, 0, 0.5 + this.velocity.length());
      a = ray.intersectObject(object, true);
      if (a.length > 0) {
        normal = a[0].face.normal;
        new_velocity = new THREE.Vector3(0, 0, 0).copy(normal);
        new_velocity.multiplyScalar(normal.dot(this.velocity)).multiplyScalar(-2).add(this.velocity).multiplyScalar(1.05);
        this.velocity = new_velocity;
      }
      return a;
    };

    Ball.prototype.transformOnMatrix = function(matrix) {};

    Ball.prototype.tempReverse = function() {
      return this.velocity.z = -this.velocity.z;
    };

    Ball.prototype.reset = function() {
      var phi, speed, theta, x_speed, y_speed, z_speed;
      this.object.position = new THREE.Vector3(0, 0, 0);
      theta = (Math.random() * 20) + 80;
      phi = (Math.random() * 90) - 45;
      speed = (Math.random() * 0.1) + 0.15;
      z_speed = speed * Math.sin(theta * Math.PI / 180) * Math.cos(phi * Math.PI / 180);
      x_speed = speed * Math.sin(theta * Math.PI / 180) * Math.sin(phi * Math.PI / 180);
      y_speed = speed * Math.cos(theta * Math.PI / 180);
      this.velocity = new THREE.Vector3(x_speed, y_speed, z_speed);
      return gameRunning = false;
    };

    return Ball;

  })();

  Paddle = (function() {
    Paddle.prototype.object = null;

    Paddle.prototype.light = null;

    function Paddle(plane, width, height, color, controller, enemy) {
      var materials;
      this.width = width;
      this.height = height;
      this.controller = controller;
      materials = [
        new THREE.MeshLambertMaterial({
          color: color,
          opacity: 0.5,
          transparent: true
        }), new THREE.MeshBasicMaterial({
          color: color,
          wireframe: true
        })
      ];
      this.object = new THREE.SceneUtils.createMultiMaterialObject(this.constructGeometry(this.width, this.height, enemy), materials);
      this.object.position.z = plane;
      this.light = new THREE.PointLight(color, 0.5);
      this.light.position.z = plane;
    }

    Paddle.prototype.update = function() {
      var newPos;
      newPos = this.controller.update(this.object.position.x, this.object.position.y);
      return this.setPosition(newPos.x, newPos.y);
    };

    Paddle.prototype.setPosition = function(x, y) {
      var xLim, yLim;
      xLim = (GAME_WIDTH - this.width) / 2;
      yLim = (GAME_HEIGHT - this.height) / 2;
      this.object.position.x = clamp(x, -xLim, xLim);
      this.object.position.y = clamp(y, -yLim, yLim);
      this.light.position.x = clamp(x, -xLim, xLim);
      return this.light.position.y = clamp(y, -yLim, yLim);
    };

    Paddle.prototype.constructGeometry = function(width, height, enemy) {
      var face, faces, geom, _i, _len;
      geom = new THREE.Geometry();
      faces = [new THREE.Vector3(-1, -1, 1), new THREE.Vector3(1, -1, 1), new THREE.Vector3(1, 1, 1), new THREE.Vector3(-1, 1, 1), new THREE.Vector3(-1, -1, -0.9), new THREE.Vector3(1, -1, -0.9), new THREE.Vector3(1, 1, -0.9), new THREE.Vector3(-1, 1, -0.9), new THREE.Vector3(-0.5, -0.5, -1), new THREE.Vector3(0.5, -0.5, -1), new THREE.Vector3(0.5, 0.5, -1), new THREE.Vector3(-0.5, 0.5, -1)];
      for (_i = 0, _len = faces.length; _i < _len; _i++) {
        face = faces[_i];
        geom.vertices.push(face);
      }
      geom.faces.push(new THREE.Face3(0, 1, 2));
      geom.faces.push(new THREE.Face3(0, 2, 3));
      geom.faces.push(new THREE.Face3(0, 3, 7));
      geom.faces.push(new THREE.Face3(0, 7, 4));
      geom.faces.push(new THREE.Face3(2, 7, 3));
      geom.faces.push(new THREE.Face3(2, 6, 7));
      geom.faces.push(new THREE.Face3(1, 6, 2));
      geom.faces.push(new THREE.Face3(1, 5, 6));
      geom.faces.push(new THREE.Face3(0, 5, 1));
      geom.faces.push(new THREE.Face3(0, 4, 5));
      geom.faces.push(new THREE.Face3(4, 7, 11));
      geom.faces.push(new THREE.Face3(4, 11, 8));
      geom.faces.push(new THREE.Face3(6, 11, 7));
      geom.faces.push(new THREE.Face3(6, 10, 11));
      geom.faces.push(new THREE.Face3(5, 10, 6));
      geom.faces.push(new THREE.Face3(5, 9, 10));
      geom.faces.push(new THREE.Face3(4, 9, 5));
      geom.faces.push(new THREE.Face3(4, 8, 9));
      geom.faces.push(new THREE.Face3(1, 3, 2));
      geom.faces.push(new THREE.Face3(0, 3, 1));
      geom.applyMatrix(new THREE.Matrix4().makeScale(width / 2.0, height / 2.0, 0.5));
      if (enemy) {
        geom.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI));
      }
      geom.computeFaceNormals();
      return geom;
    };

    return Paddle;

  })();

  RandomController = (function() {
    function RandomController() {}

    RandomController.prototype.update = function(x, y) {
      return {
        x: x + Math.random() - 0.5,
        y: y + Math.random() - 0.5
      };
    };

    return RandomController;

  })();

  SlowTrackerController = (function() {
    SlowTrackerController.prototype.speed = 0.1;

    function SlowTrackerController(object) {
      this.object = object;
    }

    SlowTrackerController.prototype.update = function(x, y) {
      x += clamp(this.object.position.x - x, -this.speed, this.speed);
      y += clamp(this.object.position.y - y, -this.speed, this.speed);
      return {
        x: x,
        y: y
      };
    };

    return SlowTrackerController;

  })();

  PlayerController = (function() {
    function PlayerController() {}

    PlayerController.prototype.update = function(x, y) {
      if (MOUSE_X) {
        x = MOUSE_X / 30 - 15;
      }
      if (MOUSE_Y) {
        y = -(MOUSE_Y / 30 - 10);
      }
      return {
        x: x,
        y: y
      };
    };

    return PlayerController;

  })();

  updateScores = function() {
    return document.getElementById("scores").innerHTML = playerScore + "-" + cpuScore;
  };

  O.ASPECT = O.WIDTH / O.HEIGHT;

  renderer = new THREE.WebGLRenderer();

  camera = new THREE.PerspectiveCamera(O.VIEW_ANGLE, O.ASPECT, O.NEAR, O.FAR);

  scene = new THREE.Scene();

  scene.add(camera);

  camera.position.z = 55;

  renderer.setSize(O.WIDTH, O.HEIGHT);

  renderer.domElement.setAttribute("id", "canvasId");

  document.getElementById('container').insertBefore(renderer.domElement, document.getElementById('container').firstChild);

  renderer.setClearColorHex(0x000000, 1.0);

  renderer.clear();

  bottomWall = new THREE.Mesh(new THREE.CubeGeometry(32, 1, 60), new THREE.MeshLambertMaterial({
    color: 0x666666
  }));

  bottomWall.position.set(0, -10.5, 0);

  scene.add(bottomWall);

  topWall = new THREE.Mesh(new THREE.CubeGeometry(32, 1, 60), new THREE.MeshLambertMaterial({
    color: 0x666666
  }));

  topWall.position.set(0, 10.5, 0);

  scene.add(topWall);

  leftWall = new THREE.Mesh(new THREE.CubeGeometry(1, 20, 60), new THREE.MeshLambertMaterial({
    color: 0x666666
  }));

  leftWall.position.set(-15.5, 0, 0);

  scene.add(leftWall);

  rightWall = new THREE.Mesh(new THREE.CubeGeometry(1, 20, 60), new THREE.MeshLambertMaterial({
    color: 0x666666
  }));

  rightWall.position.set(15.5, 0, 0);

  scene.add(rightWall);

  mainLight = new THREE.PointLight(0xFFFFFF, 2);

  scene.add(mainLight);

  paddleMaterials = [
    new THREE.MeshLambertMaterial({
      color: 0xFF7F00,
      opacity: 0.5,
      transparent: true
    }), new THREE.MeshBasicMaterial({
      color: 0xFF7F00,
      wireframe: true
    })
  ];

  paddleMaterials2 = [
    new THREE.MeshLambertMaterial({
      color: 0x0080FF,
      opacity: 0.5,
      transparent: true
    }), new THREE.MeshBasicMaterial({
      color: 0x0080FF,
      wireframe: true
    })
  ];

  ball = new Ball(0, 0, 0);

  scene.add(ball.object);

  playerPaddle = new Paddle(29.5, 6, 5, 0xFF7F00, new PlayerController, false);

  scene.add(playerPaddle.object);

  scene.add(playerPaddle.light);

  enemyPaddle = new Paddle(-29.5, 6, 5, 0x0080FF, new SlowTrackerController(ball.object), true);

  scene.add(enemyPaddle.object);

  scene.add(enemyPaddle.light);

  pointLight = new THREE.PointLight(0xFF7F00, 0);

  pointLight.position.set(0, 0, 0);

  scene.add(pointLight);

  shadowTexture = THREE.ImageUtils.loadTexture('../img/shadow.png');

  shadowMaterial = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true
  });

  shadow = new THREE.Mesh(new THREE.CubeGeometry(1, 0.0001, 1), shadowMaterial);

  shadow.position.set(0, -9.9, 0);

  scene.add(shadow);

  renderer.render(scene, camera);

  document.getElementById('canvasId').onmousemove = function(e) {
    MOUSE_X = e.pageX - this.offsetLeft;
    return MOUSE_Y = e.pageY - this.offsetTop;
  };

  update = function() {
    enemyPaddle.update();
    playerPaddle.update();
    if (gameRunning) {
      ball.collide(playerPaddle.object);
      ball.collide(rightWall);
      ball.collide(topWall);
      ball.collide(bottomWall);
      ball.collide(leftWall);
      ball.collide(enemyPaddle.object);
      ball.update();
      shadow.position.x = ball.object.position.x;
      shadow.position.z = ball.object.position.z;
    }
    if (Math.abs(ball.object.position.z) > 35) {
      if (ball.object.position.z < 0) {
        playerScore += 1;
      } else {
        cpuScore += 1;
      }
      updateScores();
      console.log("Resetting");
      ball.reset();
    }
    renderer.render(scene, camera);
    return requestAnimationFrame(update);
  };

  requestAnimationFrame(update);

  document.getElementById("canvasId").onclick = function() {
    return gameRunning = true;
  };

}).call(this);
