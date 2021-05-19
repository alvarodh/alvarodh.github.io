// VARIABLES GLOBALES
var direction = "stop",
    speed = {
      "player": 0.5,
      "ia": 0.25
    },
    difficultStep = [
      [0.1, 0.15],  // EASY
      [0.15, 0.25], // MEDIUM
      [0.25, 0.35], // HIGH
      [0.35, 0.5]   // IMPOSSIBLE
    ],
    step = {
      "x": null,
      "y": null,
      "init": null
    },
    score = {
      "player": 0,
      "ia": 0
    },
    collisionCount = 0,
    counter = 0,
    radius = 0.75,
    maxScore = null,
    range = null,
    fov = null,
    mode = null,
    playing = false,
    scene = null,
    floorSize = {
      "x": 20,
      "y": 30
    },
    borderSize = {
      "x": 1,           // ancho
      "y": floorSize.y, // largo
      "z": 2            // alto
    },
    leftBorderPos = {
      "x": -floorSize.x / 2,
      "y": 0,
      "z": 0
    },
    rightBorderPos = {
      "x": floorSize.x / 2,
      "y": 0,
      "z": 0
    },
    paddleSize = {
      "x": 5,
      "y": 1,
      "z": 1
    },
    marker = {
      "size": 2.5,
      "height": 0.25,
      "color": 0xFFFFFF,
      "position": {
        "x": -10,
        "y": 15,
        "z": 7.5
      }
    },
    gameTextures = {
      "space": {
        "sound": "static/audio/star-wars.ogg",
        "bg": "static/image/space.png",
        "ball": "static/image/deathstar.png",
        "paddle": "static/image/paddle.jpg",
        "border": "static/image/horizonte.png",
        "floor": "static/image/supernova.png"
      },
      "football": {
        "sound": "static/audio/AtleticoDeMadrid.mp3",
        "bg": "static/image/calderon.jpg",
        "ball": "static/image/ball.jpg",
        "paddle": "static/image/paddle.jpg",
        "border": "static/image/gradas.jpg",
        "floor": "static/image/grass.jpg"
      }
    };

// DETECCION DE TECLAS PULSADAS
document.addEventListener("keydown", (event) => {
  switch (event.keyCode){
    case 37: // izquierda
      direction = "left";
      break;
    case 39: // derecha
      direction = "right";
      break;
    case 32: // espacio
      if (!playing) {
        document.getElementById('audio').pause();
        createGame();
        $(document).ready(function () {
          $("#mode").hide();
          $("#difficulty").hide();
          $("#options").hide();
          $("#start").hide();
        });
        init();
      }
      break;
    default:
      //
  }
}, false);
// DETECCIÓN DE TECLA SOLTADA
document.addEventListener("keyup", (event) => {
  switch (event.keyCode){
    case 37:
    case 39:
      direction = "stop";
      break;
    default:
      //
  }
}, false);

// SELECCION DE VARIABLES DE LA PARTIDA
function createGame() {
  fov = new Number(document.getElementById("fov-value").value);
  mode = document.getElementById("football").checked ? "football" : "space";
  maxScore = new Number(document.getElementById("max-score").value);
  selectedDifficulty();
  playing = true;
}

function selectedDifficulty() { // DIFICULTAD
  var difficultInput = document.getElementsByName("difficulty");
  for (var i = 0; i < difficultInput.length; i++){
      if (difficultInput[i].checked){
          range = new Number(difficultInput[i].value);
          step.x = difficultStep[i][0];
          step.y = difficultStep[i][1];
          step.init = difficultStep[i];
          break;
      }
  }
}

// CREACION DE LA ESCENA
function init() {
  scene = new THREE.Scene();
  var sceneWidth = window.innerWidth - floorSize.x,
      sceneHeight = window.innerHeight - floorSize.x;
  var camera = new THREE.PerspectiveCamera(fov, sceneWidth / sceneHeight, 0.01, 100);
  camera.position.set(0, -floorSize.x, floorSize.x);
  camera.lookAt(scene.position);
  var listener = new THREE.AudioListener();
  camera.add(listener);
  var sound = new THREE.Audio(listener),
      audioLoader = new THREE.AudioLoader(),
      music = gameTextures[mode].sound;
  scene.background = new THREE.TextureLoader().load(gameTextures[mode].bg);
  audioLoader.load(music, (buffer) => {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.play();
  });
  var renderer = new THREE.WebGLRenderer({
    antialias : true
  });
  renderer.shadowMap.enabled = true;
  renderer.setSize(sceneWidth, sceneHeight);
  document.body.appendChild(renderer.domElement);
  // CREACION DE ELEMENTOS DE LA ESCENA
  var leftBorder = getBorder("left", leftBorderPos),
      rightBorder = getBorder("right", rightBorderPos),
      player = getPaddle("down", -((borderSize.y / 2) - 1)),
      ia = getPaddle("top", (borderSize.y / 2) - 1),
      sphere = getSphere();
  // AÑADIR ELEMENTOS A LA ESCENA
  getMarker(scene, 'marker');
  scene.add(getLight(borderSize.y / 10));
  scene.add(getLight(-borderSize.y / 10));
  scene.add(leftBorder);
  scene.add(rightBorder);
  scene.add(sphere);
  scene.add(getFloor());
  scene.add(player);
  scene.add(ia);
  // CONTRA QUE SE PUEDE CHOCAR LA BOLA
  var borders = [leftBorder, rightBorder, player, ia];
  animate(sphere, borders, renderer, scene, camera, range);
}

// FUNCIONES PARA ANIMAR LA ESCENA
function animate(sphere, borders, renderer, scene, camera, range){
  checkCollision(sphere, borders);
  playerMove(borders);
  iaMove(sphere, borders);
  sphereMove(sphere);
  goalDetection(sphere);
  requestAnimationFrame(() => {
    animate(sphere, borders, renderer, scene, camera, range);
  });
  // ACTUALIZACION DEL MARCADOR
  matchscore();
  renderer.render(scene,camera);
}

function goalDetection(sphere) { // deteccion de goles
  if (Math.abs(sphere.position.y) > (borderSize.y / 2) - 0.5) { // posicion de las palas
    var goal = (sphere.position.y > (borderSize.y / 2) - 0.5) ? [1, 0] : [0, 1]; // eleccion de goleador
    score.player += goal[0]; score.ia += goal[1]; // actualizacion de marcador
    step.x = step.init[0]; step.y = step.init[1]; // volver al step inicial
    step.y *= (sphere.position.y > (borderSize.y / 2) - 0.5) ? 1 : -1; // eleccion de hacia donde ira la pelota
    sphere.position.x = 0; sphere.position.y = 0; // colocar pelota
    getMarker(scene, 'marker'); // actualizar marcador
  }
}

function sphereMove(sphere) { // movimiento de la pelota
  sphere.position.x += step.x; sphere.position.y += step.y;
}

function iaMove(sphere, borders) { // movimiento de la IA
  if (Math.abs(borders[3].position.x) == (floorSize.x / 2) - (paddleSize.x / 2)) {
    borders[3].position.x += (borders[3].position.x == (floorSize.x / 2) - (paddleSize.x / 2)) ? -speed.ia : speed.ia;
  } else if (sphere.position.y > range){
    borders[3].position.x += (sphere.position.x < borders[3].position.x) ? -speed.ia : speed.ia;
  }
}

function playerMove(borders){ // movimiento del usuario
  var s = (direction == "stop") ? floorSize.x * 10 : ((direction == "left") ? -speed.player : speed.player);
  if (Math.abs(borders[2].position.x + s) > (floorSize.x / 2) - (paddleSize.x / 2) - 0.5) {
    borders[2].position.x == 0;
  } else {
    borders[2].position.x += s;
    counter += 1;
  }
}

function matchscore(){ // actualizacion del marcador
  if (score.player == maxScore || score.ia == maxScore) {
    document.location.reload();
    alert((score.player == maxScore) ? "Player wins!" : "IA wins!")
    document.getElementById('audio').play();
  }
}

// FUNCIONES PARA LA OBTENCION DE LOS OBJETOS
function getLight(posx) {
  var light = new THREE.DirectionalLight();
  light.position.set(posx, 5, 5);
  light.castShadow = true;
  light.shadow.camera.near = 0;
  light.shadow.camera.far = floorSize.x;
  light.shadow.camera.left = -floorSize.y;
  light.shadow.camera.right = floorSize.y;
  light.shadow.camera.top = floorSize.y;
  light.shadow.camera.bottom = -floorSize.y;
  light.shadow.mapSize.width = 4096;
  light.shadow.mapSize.height = 4096;

  return light;
}

function getSphere() {
  var geometry = new THREE.SphereGeometry(radius);
  var mesh = new THREE.Mesh(geometry, getMaterial(gameTextures[mode].ball));
  mesh.position.z = 0;
  mesh.castShadow = true;
  mesh.name = "sphere";

  return mesh;
}

function getFloor() {
  var geometry = new THREE.PlaneGeometry(floorSize.x, floorSize.y);
  var mesh = new THREE.Mesh(geometry, getMaterial(gameTextures[mode].floor));
  mesh.receiveShadow = true;

  return mesh;
}

function getBorder(name, borderPos) {
  var geometry = new THREE.BoxGeometry(borderSize.x, borderSize.y, borderSize.z);
  var mesh = new THREE.Mesh(geometry, getMaterial(gameTextures[mode].border));
  mesh.receiveShadow = true;
  mesh.position.set(borderPos.x, borderPos.y, borderPos.z);
  mesh.name = name;

  return mesh;
}

function getPaddle(name, posY) {
  var geometry = new THREE.BoxGeometry(paddleSize.x, paddleSize.y, paddleSize.z);
  var mesh = new THREE.Mesh(geometry,getMaterial(gameTextures[mode].paddle));
  mesh.receiveShadow = true;
  mesh.name = name;
  mesh.position.y = posY;

  return mesh;
}

function getMarker(scene, name) {
  var loader = new THREE.FontLoader();
  loader.load('static/css/font/VT323/VT323_Regular.json', (font) => {
     var object = scene.getObjectByName(name);
     if (object) {
       scene.remove(object);
     }
     var text = new THREE.TextGeometry( 'IA ' + score.ia + ' - ' + score.player + ' PLAYER', {
         font: font,
         size: marker.size,
         height: marker.height,
     });
      var material = new THREE.MeshBasicMaterial({color: marker.color});
      var mesh = new THREE.Mesh(text, material);
      mesh.position.set(marker.position.x, marker.position.y, marker.position.z);
      mesh.rotation.x = 1;
      mesh.name = name;
      scene.add(mesh);
  });
}

// FUNCIONES PARA OBTENER LAS TEXTURAS DE LOS OBJETOS
function getMaterial(texture) {
  var material = new THREE.MeshPhysicalMaterial({
    map : new THREE.TextureLoader().load(texture)
  });
  material.side = THREE.DoubleSide;

  return material;
}

// COMPROBAR COLISIONES
function checkCollision(sphere, borders) {
  var originPosition = sphere.position.clone(),
      speed = 0;
  collisionCount++;
  for (var i = 0; i < sphere.geometry.vertices.length; i++) {
    var localVertex = sphere.geometry.vertices[i].clone(),
        globalVertex = localVertex.applyMatrix4(sphere.matrix),
        directionVector = globalVertex.sub(sphere.position);
    var ray = new THREE.Raycaster(originPosition, directionVector.clone().normalize()),
        collisionResults = ray.intersectObjects(borders);
    if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
      if (collisionResults[0].object.name == "left" || collisionResults[0].object.name == "right") { // choque con lateral
        step.x *= -1;
      }
      if (collisionCount > 20) { // soluciona bug, que se queda pillao en la pared
        if (collisionResults[0].object.name == "down" || collisionResults[0].object.name == "top") { // choque con pala
          if (Math.abs(collisionResults[0].point.x) < borders[2].position.x + 1) { // centro
            step.x *= 0.5;
          } else { // lateral
            step.x *= 1.5;
          }
          if (counter < 5) { // cuanta mas distancia se recorra, mas veloz rebota
            step.y *= -0.75;
          } else if (counter < 10) {
            step.y *= -0.9;
          } else if (counter < 20) {
            step.y *= -1.02;
          } else if (counter < 30) {
            step.y *= -1.05;
          } else {
            step.y *= -1.1;
          }
          collisionCount = 0;
        }
      } else {
        break;
      }
      break;
    }
  }
}
