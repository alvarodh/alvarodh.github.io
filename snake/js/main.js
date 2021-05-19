var scripts = "<script src='js/crono.js'></script>\
               <script src='js/lib/jquery.min.js'></script>";

document.write(scripts);

window.onload = function () {
  $(document).ready(function (){
    $("#container").hide();
  });
  c = document.getElementById("snake");
  c.height = c.width;
  tc = 25;
  gs = c.width / tc;
  ctx = c.getContext("2d");
  cronometro.init("crono");
}

function start () {
  $(document).ready(function (){
    $("#start").hide();
    $("#container").slideDown(1500);
  });
  document.addEventListener("keydown", keyPush);
  time = setInterval(game, 1000 / 7.5);
  cronometro.start();
}

function restart () {
  $(document).ready(function (){
    $("#start").show();
    $("#container").slideUp(1500);
  });
  cronometro.stop();
  clearInterval(time);
  alert(score);
  score = 0;
  trail = [];
  tail = 0;
  dir = 0;
  xv = 0;
  yv = 0;
}


var px = 10,
    py = 10,
    gs = 20,
    score = 0,
    ax = null,
    ay = null,
    xv = 0,
    yv = 0,
    trail = [],
    tail = 1,
    dir = 0,
    keys = {
      37 : [-1, 0],
      38 : [0, -1],
      39 : [1, 0],
      40 : [0, 1]
    };

function game () {
  px += xv;
  py += yv;
  if (px < 0) {
    px = tc - 1;
  }
  if (px > tc - 1) {
    px = 0;
  }
  if (py < 0) {
    py = tc - 1;
  }
  if (py > tc - 1) {
    py = 0;
  }
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = "lime";
  for (var i = 0; i < trail.length; i++) {
    ctx.fillRect(trail[i].x * gs, trail[i].y * gs, gs - 2, gs - 2);
    if (trail[i].x === px && trail[i].y === py) {
      if (trail.length > 1) {
        score = tail;
        restart();
      }
      tail = 1;
    }
  }
  trail.push({
    x : px,
    y : py
  });
  while (trail.length > tail) {
    trail.shift();
  }
  if (ax === px && ay === py || ax === null && ay === null) {
    tail++;
    ax = Math.floor(Math.random() * tc);
    ay = Math.floor(Math.random() * tc);
  }
  ctx.fillStyle = "red";
  ctx.fillRect(ax * gs, ay * gs, gs - 2, gs - 2);
  document.getElementById("score").innerHTML = "SCORE: " + tail;
}

function keyPush (event) {
  if (Math.abs(event.keyCode - dir) !== 2) {
    xv = keys[event.keyCode][0];
    yv = keys[event.keyCode][1];
    dir = event.keyCode;
  }
}
