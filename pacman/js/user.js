Pacman.User = function (game, map) {

  var position  = null,
      direction = null,
      eaten     = null,
      due       = null,
      lives     = null,
      score     = 0,
      keyMap    = {};

  keyMap[KEY.ARROW_LEFT]  = LEFT;
  keyMap[KEY.ARROW_UP]    = UP;
  keyMap[KEY.ARROW_RIGHT] = RIGHT;
  keyMap[KEY.ARROW_DOWN]  = DOWN;

  function addScore(nScore) {
    score += nScore;
    if (score >= 10000 && score - nScore < 10000) {
      lives++;
    }
  };

  function theScore() {
    return score;
  };

  function loseLife() {
    lives -= 1;
  };

  function getLives() {
    return lives;
  };

  function initUser() {
    score = 0;
    lives = 3;
    newLevel();
  }

  function newLevel() {
    resetPosition();
    eaten = 0;
  };

  function resetPosition() {
    position = {
      "x" : 90,
      "y" : 120
    };
    direction = LEFT;
    due = LEFT;
  };

  function reset() {
    initUser();
    resetPosition();
  };

  function keyDown(e) {
    if (typeof keyMap[e.keyCode] !== "undefined") {
      due = keyMap[e.keyCode];
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    return true;
  };

  function getNewCoord(dir, current) {
    return {
      "x" : current.x + (dir === LEFT && -2 || dir === RIGHT &&  2 || 0),
      "y" : current.y + (dir === DOWN &&  2 || dir === UP    && -2 || 0)
    };
  };

  function onWholeSquare(x) {
    return x % 10 === 0;
  };

  function pointToCoord(x) {
    return Math.round(x/10);
  };

  function nextSquare(x, dir) {
    var rem = x % 10;
    if (rem === 0) {
      return x;
    } else if (dir === RIGHT || dir === DOWN) {
      return x + (10 - rem);
    } else {
      return x - rem;
    }
  };

  function next(pos, dir) {
    return {
      "y" : pointToCoord(nextSquare(pos.y, dir)),
      "x" : pointToCoord(nextSquare(pos.x, dir)),
    };
  };

  function onGridSquare(pos) {
    return onWholeSquare(pos.y) && onWholeSquare(pos.x);
  };

  function isOnSamePlane(due, dir) {
    var due_lr = (due === LEFT || due === RIGHT),
        due_ud = (due === UP || due === DOWN),
        dir_lr = (dir === LEFT || dir === RIGHT),
        dir_ud = (dir === UP || dir === DOWN);
    return ((due_lr && dir_lr) || (due_ud && dir_ud));
  };

  function move(ctx) {
    var npos        = null,
        nextWhole   = null,
        oldPosition = position,
        block       = null;
    if (due !== direction) {
      npos = getNewCoord(due, position);
      if (isOnSamePlane(due, direction) || (onGridSquare(position) && map.isFloorSpace(next(npos, due)))) {
        direction = due;
      } else {
        npos = null;
      }
    }
    if (npos === null) {
      npos = getNewCoord(direction, position);
    }
    if (onGridSquare(position) && map.isWallSpace(next(npos, direction))) {
      direction = NONE;
    }
    if (direction === NONE) {
      return {
        "new" : position,
        "old" : position
      };
    }
    switch (direction) {
      case RIGHT:
        if (npos.y === 100 && npos.x >= 190) {
          npos = {
            "y" : 100,
            "x": -10
          };
        }
        break;
      case LEFT:
        if (npos.y === 100 && npos.x <= -12) {
          npos = {
            "y": 100,
            "x": 190
          };
        }
        break;
      default:
        //
    }
    position = npos;
    nextWhole = next(position, direction);
    block = map.block(nextWhole);
    var mid_square = (isMidSquare(position.y) || isMidSquare(position.x)),
        good_block = (block === Pacman.BISCUIT || block === Pacman.PILL);
    if (mid_square && good_block) {
      map.setBlock(nextWhole, Pacman.EMPTY);
      addScore((block === Pacman.BISCUIT) ? 10 : 50);
      eaten++;
      if (eaten === game.allPills) {
        game.completedLevel();
      }
      if (block === Pacman.PILL) {
        game.eatenPill();
      }
    }
    return {
      "new" : position,
      "old" : oldPosition
    };
  };

  function isMidSquare(x) {
    var rem = x % 10;
    return rem > 3 || rem < 7;
  };

  function calcAngle(dir, pos) {
    if (dir == RIGHT && (pos.x % 10 < 5)) {
      return {
        "start"    : 0.25,
        "end"      : 1.75,
        "direction": false
      };
    } else if (dir === DOWN && (pos.y % 10 < 5)) {
      return {
        "start"    : 0.75,
        "end"      : 2.25,
        "direction": false
      };
    } else if (dir === UP && (pos.y % 10 < 5)) {
      return {
        "start"    : 1.25,
        "end"      : 1.75,
        "direction": true}
        ;
    } else if (dir === LEFT && (pos.x % 10 < 5)) {
      return {
        "start"    : 0.75,
        "end"      : 1.25,
        "direction": true
      };
    }
      return {
        "start"    : 0,
        "end"      : 2,
        "direction": false
      };
  };

  function drawDead(ctx, amount) {
    var size = map.blockSize,
        half = size / 2;
    if (amount >= 1) {
      return;
    }
    ctx.fillStyle = PACMAN_COLOUR;
    ctx.beginPath();
    var x_0 = ((position.x / 10) * size) + half,
        y_0 = ((position.y / 10) * size) + half,
        init_angle = 0,
        end_angle = Math.PI * 2 * amount;
    ctx.moveTo(x_0, y_0);
    ctx.arc(x_0, y_0, half, init_angle, end_angle, true);
    ctx.fill();
  };

  function draw(ctx) {
    var s     = map.blockSize,
        angle = calcAngle(direction, position);
    ctx.fillStyle = PACMAN_COLOUR;
    ctx.beginPath();
    var x_0 = ((position.x / 10) * s) + s / 2,
        y_0 = ((position.y / 10) * s) + s / 2,
        init_angle = Math.PI * angle.start,
        end_angle = Math.PI * angle.end;
    ctx.moveTo(x_0, y_0);
    ctx.arc(x_0, y_0, s / 2, init_angle, end_angle, angle.direction);
    ctx.fill();
  };

  return {
    "draw"          : draw,
    "drawDead"      : drawDead,
    "loseLife"      : loseLife,
    "getLives"      : getLives,
    "score"         : score,
    "addScore"      : addScore,
    "theScore"      : theScore,
    "keyDown"       : keyDown,
    "move"          : move,
    "newLevel"      : newLevel,
    "reset"         : reset,
    "resetPosition" : resetPosition
  };
};
