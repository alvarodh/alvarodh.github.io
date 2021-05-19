var PACMAN = (function () {

  var state        = WAITING,
      audio        = null,
      ghosts       = [],
      ghostSpecs   = ["red"],
      allGhosts    = ["red", "green", "orange", "purple"],
      eatenCount   = 0,
      level        = 0,
      tick         = 0,
      ghostPos,
      userPos,
      stateChanged = true,
      timerStart   = null,
      lastTime     = 0,
      ctx          = null,
      timer        = null,
      map          = null,
      user         = null,
      stored       = null,
      show_scores  = false;

  function getTick() {
    return tick;
  };

  function drawScore(text, position) {
    ctx.fillStyle = "yellow";
    ctx.fillText(text, (position["new"]["x"] / 10) * map.blockSize, ((position["new"]["y"] + 5) / 10) * map.blockSize);
  }

  function dialog(text, font) {
    ctx.fillStyle = "yellow";
    ctx.font      = "20px " + font;
    var width = ctx.measureText(text).width + 10,
        x     = ((map.width * map.blockSize) - width) / 2;
    ctx.fillText(text, x, (map.height * 6.5));
  }

  function soundDisabled() {
    return localStorage["soundDisabled"] === "true";
  };

  function startLevel(new_level) {
    user.resetPosition();
    if (level <= allGhosts.length && level !== 1 && new_level) {
      ghostSpecs.push(allGhosts[level - 1]);
      var ghost = new Pacman.Ghost({
        "getTick" : getTick
      }, map, ghostSpecs[level - 1]);
      ghosts.push(ghost);
    }
    for (var i = 0; i < ghosts.length; i++) {
      ghosts[i].reset();
    }
    audio.play("start");
    timerStart = tick;
    setState(COUNTDOWN);
  };

  function startNewGame() {
    setState(WAITING);
    level = 1;
    user.reset();
    map.reset();
    map.draw(ctx);
    startLevel(true);
  };

  function keyDown(e) {
    if (e.keyCode === KEY.N && state !== PLAYING) {
      startNewGame();
    } else if (e.keyCode === KEY.M) {
      mute();
    } else if (e.keyCode === KEY.P && state === PAUSE) {
      endPause();
    } else if (e.keyCode === KEY.P) {
      pause();
    } else if (e.keyCode === KEY.R && show_scores) {
      scores.hideScores();
      show_scores = false;
    } else if (e.keyCode === KEY.R && state !== PLAYING && state !== COUNTDOWN) {
      scores.showScores();
      show_scores = true;
    } else if (state !== PAUSE) {
      return user.keyDown(e);
    }
      return true;
  };

  function pause() {
    stored = state;
    setState(PAUSE);
    audio.pause();
    map.draw(ctx);
    dialog("paused", "pacman-font");
    crono.stop();
  };

  function endPause() {
    audio.resume();
    map.draw(ctx);
    setState(stored);
    crono.start();
  };

  function mute() {
    audio.disableSound();
    localStorage["soundDisabled"] = !soundDisabled();
  };

  function loseLife() {
    setState(WAITING);
    user.loseLife();
    if (user.getLives() > 0) {
      crono.stop();
      startLevel(false);
    } else {
      endGame();
      crono.restart();
    }
  };

  function endGame() {
    $(document).ready(function () {
      $("#crono").hide();
      $("#pacman").hide();
      $("#controls").hide();
      $("#name").show();
    });
    var time = crono.getTime();
    var score = user.theScore();
    scores.saveScore(score, time, level);
    charge();
  }

  function setState(nState) {
    state = nState;
    stateChanged = true;
  };

  function collided(user, ghost) {
    return (Math.sqrt(Math.pow(ghost.x - user.x, 2) + Math.pow(ghost.y - user.y, 2))) < 10;
  };

  function drawFooter() {
    var topLeft  = (map.height * map.blockSize),
    textBase = topLeft + 17;
    ctx.fillStyle = "black";
    ctx.fillRect(0, topLeft, (map.width * map.blockSize), 30);
    ctx.fillStyle = "yellow";
    for (var i = 0; i < user.getLives(); i++) {
      ctx.fillStyle = PACMAN_COLOUR;
      ctx.beginPath();
      ctx.moveTo(150 + (25 * i) + map.blockSize / 2, (topLeft + 1) + map.blockSize / 2);
      ctx.arc(150 + (25 * i) + map.blockSize / 2, (topLeft + 1) + map.blockSize / 2,
      map.blockSize / 2, Math.PI * 0.25, Math.PI * 1.75, false);
      ctx.fill();
    }
    ctx.fillStyle = !soundDisabled() ? "green" : "red";
    ctx.font = "16px pacman-font";
    ctx.fillText("s", 10, textBase);
    ctx.fillStyle = "yellow";
    ctx.font      = "14px monospace";
    ctx.fillText("SCORE: " + user.theScore(), 30, textBase);
    ctx.fillText("LEVEL: " + level, 260, textBase);
  }

  function redrawBlock(pos) {
    map.drawBlock(Math.floor(pos.y / 10), Math.floor(pos.x / 10), ctx);
    map.drawBlock(Math.ceil(pos.y / 10), Math.ceil(pos.x / 10), ctx);
  }

  function mainDraw() {
    var diff, u, i, len, nScore;
        ghostPos = [];
    for (i = 0, len = ghosts.length; i < len; i++) {
      ghostPos.push(ghosts[i].move(ctx));
    }
    u = user.move(ctx);
    for (i = 0, len = ghosts.length; i < len; i++) {
      redrawBlock(ghostPos[i].old);
    }
    redrawBlock(u.old);
    for (i = 0, len = ghosts.length; i < len; i++) {
      ghosts[i].draw(ctx);
    }
    user.draw(ctx);
    userPos = u["new"];
    for (i = 0, len = ghosts.length; i < len; i++) {
      if (collided(userPos, ghostPos[i]["new"])) {
        if (ghosts[i].isVunerable()) {
          audio.play("eatghost");
          ghosts[i].eat();
          eatenCount++;
          nScore = eatenCount * 50;
          drawScore(nScore, ghostPos[i]);
          user.addScore(nScore);
          setState(EATEN_PAUSE);
          timerStart = tick;
        } else if (ghosts[i].isDangerous()) {
          audio.play("die");
          setState(DYING);
          timerStart = tick;
        }
      }
    }
  };

  function mainLoop() {
    var diff;
    if (state !== PAUSE) {
      ++tick;
    }
    map.drawPills(ctx);
    if (state === PLAYING) {
      mainDraw();
    } else if (state === WAITING && stateChanged) {
      stateChanged = false;
      map.draw(ctx);
      dialog("get ready", "pacman-font");
    } else if (state === EATEN_PAUSE && (tick - timerStart) > (Pacman.FPS / 3)) {
      map.draw(ctx);
      setState(PLAYING);
    } else if (state === DYING) {
      if (tick - timerStart > (Pacman.FPS * 2)) {
        loseLife();
      } else {
        redrawBlock(userPos);
        for (i = 0; i < ghosts.length; i++) {
          redrawBlock(ghostPos[i].old);
          ghostPos.push(ghosts[i].draw(ctx));
        }
        user.drawDead(ctx, (tick - timerStart) / (Pacman.FPS * 2));
      }
    } else if (state === COUNTDOWN) {
      diff = 5 + Math.floor((timerStart - tick) / Pacman.FPS);
      if (diff === 0) {
        map.draw(ctx);
        setState(PLAYING);
        crono.start();
      } else {
        if (diff !== lastTime) {
          lastTime = diff;
          map.draw(ctx);
          dialog("Starting in: " + diff, "monospace");
        }
      }
    }
    drawFooter();
  }

  function eatenPill() {
    audio.play("eatpill");
    timerStart = tick;
    eatenCount = 0;
    for (i = 0; i < ghosts.length; i++) {
      ghosts[i].makeEatable(ctx);
    }
  };

  function completedLevel() {
    setState(WAITING);
    level++;
    map.reset();
    user.newLevel();
    crono.stop();
    startLevel(true);
  };

  function keyPress(e) {
    if (state !== WAITING && state !== PAUSE) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  function init(wrapper, root) {
    var i, len, ghost,
    blockSize = wrapper.offsetWidth / 19,
    canvas    = document.getElementById("canvas");
    canvas.setAttribute("width", (blockSize * 19) + "px");
    canvas.setAttribute("height", (blockSize * 22) + 30 + "px");
    wrapper.appendChild(canvas);
    ctx  = canvas.getContext('2d');
    audio = new Pacman.Audio({
      "soundDisabled" : soundDisabled
    });
    map   = new Pacman.Map(blockSize);
    user  = new Pacman.User({
      "completedLevel" : completedLevel,
      "eatenPill"      : eatenPill,
      "allPills"       : 182
    }, map);
    crono = new Pacman.Crono();
    crono.create("crono");
    scores = new Pacman.Scores();
    for (i = 0; i < ghostSpecs.length; i++) {
      ghost = new Pacman.Ghost({
        "getTick" : getTick
      }, map, ghostSpecs[i]);
      ghosts.push(ghost);
    }
    map.draw(ctx);
    dialog("loading ...", "pacman-font");
    var extension = Modernizr.audio.ogg ? 'ogg' : 'mp3';
    var audio_files = [
      ["start", root + "audio/opening_song." + extension],
      ["die", root + "audio/die." + extension],
      ["eatghost", root + "audio/eatghost." + extension],
      ["eatpill", root + "audio/eatpill." + extension],
      ["eating", root + "audio/eating.short." + extension],
      ["eating2", root + "audio/eating.short." + extension]
    ];
    load(audio_files, function() { loaded(); });
  };

  function load(arr, callback) {
    if (arr.length === 0) {
      callback();
    } else {
      var x = arr.pop();
      audio.load(x[0], x[1], function() { load(arr, callback); });
    }
  };

  function loaded() {
    document.addEventListener("keydown", keyDown, true);
    document.addEventListener("keypress", keyPress, true);
    timer = window.setInterval(mainLoop, 1000 / Pacman.FPS);
  };

  return {
    "init" : init
  };

}());

Object.prototype.clone = function () {
  var i, newObj = (this instanceof Array) ? [] : {};
  for (i in this) {
    if (i === 'clone') {
      continue;
    }
    if (this[i] && typeof this[i] === "object") {
      newObj[i] = this[i].clone();
    } else {
      newObj[i] = this[i];
    }
  }
  return newObj;
};
