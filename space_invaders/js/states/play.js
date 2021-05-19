function PlayState (config, level) {
    this.config = config;
    this.level = level;
    this.invaderCurrentVelocity =  10;
    this.invaderCurrentDropDistance =  0;
    this.invadersAreDropping =  false;
    this.lastRocketTime = null;
    this.ship = null;
    this.invaders = [];
    this.rockets = [];
    this.bombs = [];
}

PlayState.prototype.enter = function (game) {
    this.newShip(game);
    var levelMult = this.level * this.config.levelDifficultyMultiplier;
    this.newInvaders(game, levelMult);
    this.newBombs(game, levelMult);
};

PlayState.prototype.newShip = function (game) {
    this.ship = new Ship(game.width / 2, game.gameBounds.bottom);
    this.shipSpeed = this.config.shipSpeed;
};

PlayState.prototype.newInvaders = function (game, levelMult) {
  this.invaderCurrentVelocity =  10;
  this.invaderCurrentDropDistance =  0;
  this.invadersAreDropping =  false;
  this.invaderInitialVelocity = this.config.invaderInitialVelocity + (levelMult * this.config.invaderInitialVelocity);
  var ranks = this.config.invaderRanks,
      files = this.config.invaderFiles,
      invaders = [];
  for (var rank = 0; rank < ranks; rank++){
      for (var file = 0; file < files; file++) {
          invaders.push(new Invader((game.width / 2) + ((files / 2 - file) * 200 / files), (game.gameBounds.top + rank * 20), rank, file, 'Invader'));
      }
  }
  this.invaders = invaders;
  this.invaderCurrentVelocity = this.invaderInitialVelocity;
  this.invaderVelocity = {
    x : -this.invaderInitialVelocity,
    y : 0
  };
  this.invaderNextVelocity = null;
};

PlayState.prototype.newBombs = function (game, levelMult) {
  this.bombRate = this.config.bombRate + (levelMult * this.config.bombRate);
  this.bombMinVelocity = this.config.bombMinVelocity + (levelMult * this.config.bombMinVelocity);
  this.bombMaxVelocity = this.config.bombMaxVelocity + (levelMult * this.config.bombMaxVelocity);
};

PlayState.prototype.update = function (game, dt) {
    var movement = [32, 37, 39]
    for (i in movement) {
      var keyCode = movement[i];
      switch (keyCode){
        case 32:
          if (game.pressedKeys[keyCode]) {
            this.fireRocket();
          }
          break;
        case 37:
          if (game.pressedKeys[keyCode]) {
            this.ship.move(this.shipSpeed * dt, "left");
          }
          break;
        case 39:
          if (game.pressedKeys[keyCode]) {
            this.ship.move(this.shipSpeed * dt, "right");
          }
          break;
        default:
          //
      }
    }
    if (this.ship.x < game.gameBounds.left) {
        this.ship.x = game.gameBounds.left;
    }
    if (this.ship.x > game.gameBounds.right) {
        this.ship.x = game.gameBounds.right;
    }
    for (var i = 0; i < this.bombs.length; i++) { // move bombs
        this.bombs[i].move(dt * this.bombs[i].velocity);
        if (this.bombs[i].y > this.height) {
            this.bombs.splice(i--, 1);
        }
    }
    for (i = 0; i < this.rockets.length; i++) { // move rockets
        this.rockets[i].move(dt * this.rockets[i].velocity);
        if (this.rockets[i].y < 0) {
            this.rockets.splice(i--, 1);
        }
    }
    var hitLeft = false,
        hitRight = false,
        hitBottom = false;
    for (i = 0; i < this.invaders.length; i++) {
        var invader = this.invaders[i];
        var newx = invader.x + this.invaderVelocity.x * dt,
            newy = invader.y + this.invaderVelocity.y * dt;
        if (!hitLeft && newx < game.gameBounds.left) {
            hitLeft = true;
        } else if (!hitRight && newx > game.gameBounds.right) {
            hitRight = true;
        } else if (!hitBottom && newy > game.gameBounds.bottom) {
            hitBottom = true;
        }
        if (!hitLeft && !hitRight && !hitBottom) {
            invader.x = newx;
            invader.y = newy;
        }
    }
    if (this.invadersAreDropping) {
        this.invaderCurrentDropDistance += this.invaderVelocity.y * dt;
        if (this.invaderCurrentDropDistance >= this.config.invaderDropDistance) {
            this.invadersAreDropping = false;
            this.invaderVelocity = this.invaderNextVelocity;
            this.invaderCurrentDropDistance = 0;
        }
    }
    if (hitLeft) {
        this.invaderCurrentVelocity += this.config.invaderAcceleration;
        this.invaderVelocity = {
          x : 0,
          y : this.invaderCurrentVelocity
        };
        this.invadersAreDropping = true;
        this.invaderNextVelocity = {
          x : this.invaderCurrentVelocity,
          y : 0
        };
    }
    if (hitRight) {
        this.invaderCurrentVelocity += this.config.invaderAcceleration;
        this.invaderVelocity = {
          x : 0,
          y : this.invaderCurrentVelocity
        };
        this.invadersAreDropping = true;
        this.invaderNextVelocity = {
          x: -this.invaderCurrentVelocity,
          y : 0
        };
    }
    if (hitBottom) {
        this.lives = 0;
    }
    for (i = 0; i < this.invaders.length; i++) {
        var invader = this.invaders[i],
            bang = false;
        for (var j = 0; j < this.rockets.length; j++){
            var rocket = this.rockets[j];
            if (collision(invader, rocket)) {
                this.rockets.splice(j--, 1);
                bang = true;
                game.score += this.config.pointsPerInvader;
                break;
            }
        }
        if (bang) {
            this.invaders.splice(i--, 1);
            game.sounds.playSound("bang");
        }
    }
    for (i = 0; i < this.bombs.length; i++) {
        var bomb = this.bombs[i],
            bang = false;
        for (var j = 0; j < this.rockets.length; j++){
            var rocket = this.rockets[j];
            if (collision(bomb, rocket)) {
                this.rockets.splice(j--, 1);
                bang = true;
                game.score += this.config.pointsPerBomb;
                break;
            }
        }
        if (bang) {
            game.explosions.push([bomb.x, bomb.y, 5]);
            this.bombs.splice(i--, 1);
            game.sounds.playSound("explosion");
        }
    }
    var frontRankInvaders = {};
    for (var i = 0; i < this.invaders.length; i++) {
        var invader = this.invaders[i];
        if (!frontRankInvaders[invader.file] || frontRankInvaders[invader.file].rank < invader.rank) {
            frontRankInvaders[invader.file] = invader;
        }
    }
    for (var i = 0; i < this.config.invaderFiles; i++) {
        var invader = frontRankInvaders[i];
        if (!invader) continue;
        var chance = this.bombRate * dt;
        if (chance > Math.random()) {
            var x = invader.x,
                y = invader.y + invader.height / 2,
                velocity = this.bombMinVelocity + Math.random() * (this.bombMaxVelocity - this.bombMinVelocity);
            this.bombs.push(new Bomb(x, y, velocity));
        }
    }
    for (var i = 0; i < this.bombs.length; i++) {
        var bomb = this.bombs[i];
        if (collision(bomb, this.ship)) {
            this.bombs.splice(i--, 1);
            game.lives--;
            game.sounds.playSound("explosion");
        }

    }
    for (var i = 0; i < this.invaders.length; i++) {
        var invader = this.invaders[i];
        if (collision(invader, this.ship )) {
            game.lives = 0;
            game.sounds.playSound("explosion");
        }
    }
    if (game.lives <= 0) {
        game.moveToState(new GameOverState());
    }
    if (this.invaders.length === 0) {
        game.score += this.level * 50;
        game.level += 1;
        game.moveToState(new LevelIntroState(game.level));
    }
};

function collision (obj1, obj2) {
  var collX1 = (obj1.x + obj1.width / 2) > (obj2.x - obj2.width / 2);
  var collX2 = (obj1.x - obj1.width / 2) < (obj2.x + obj2.width / 2);
  var collY1 = (obj1.y + obj1.height / 2) > (obj2.y - obj2.height / 2);
  var collY2 = (obj1.y - obj1.height / 2) < (obj2.y + obj2.height / 2);
  return collX1 && collX2 && collY1 && collY2;
}

PlayState.prototype.draw = function (game, dt, ctx) {
    ctx.clearRect(0, 0, game.width, game.height);
    this.drawGameObjects(game, ctx);
    this.drawGameInfo(game, ctx);
};

PlayState.prototype.drawGameObjects = function (game, ctx) {
  this.ship.draw(ctx);
  for (var i = 0; i < this.invaders.length; i++) {
      this.invaders[i].draw(ctx);
  }
  for (var i = 0; i < this.bombs.length; i++) {
      this.bombs[i].draw(ctx);
  }
  for (var i = 0; i < this.rockets.length; i++) {
      this.rockets[i].draw(ctx);
  }
  for (var i = 0; i < game.explosions.length; i++) {
      var img = new Image();
      img.src = "images/explosion.png";
      ctx.drawImage(img, game.explosions[i][0], game.explosions[i][1], 25, 25)
      if (game.explosions[i][2] > 0) {
        game.explosions[i][2]--;
      } else {
        game.explosions.splice(i--, 1);
      }
  }
}

PlayState.prototype.drawGameInfo = function (game, ctx) {
  var textY = game.gameBounds.bottom + ((game.height - game.gameBounds.bottom) / 2) + 14 / 2;
  var info = "Lives: " + game.lives;
  ctx.textAlign = "left";
  dialog(ctx, info, 14, "white", game.gameBounds.left, textY);
  info = "Score: " + game.score + ", Level: " + game.level;
  ctx.textAlign = "right";
  dialog(ctx, info, 14, "white", game.gameBounds.right, textY);
}

PlayState.prototype.keyDown = function (game, keyCode) {
    if (keyCode === 32) {
        this.fireRocket();
    } else if (keyCode === 80) {
        game.pushState(new PauseState());
    }
};

PlayState.prototype.keyUp = function (game, keyCode) {
  //
};

PlayState.prototype.fireRocket = function () {
    console.log(new Date().valueOf())
    if (this.lastRocketTime === null || ((new Date()).valueOf() - this.lastRocketTime) > (1000 / this.config.rocketMaxFireRate)) {
        this.rockets.push(new Rocket(this.ship.x, this.ship.y - 12, this.config.rocketVelocity));
        this.lastRocketTime = (new Date()).valueOf();
        game.sounds.playSound("shoot");
    }
};

function Ship (x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 16;
    this.img = new Image();
    this.img.src = "images/ship.png";
    this.draw = function (ctx) {
      var x = this.x - (this.width / 2),
          y = this.y - (this.height / 2);
      ctx.drawImage(this.img, x, y, this.width, this.height);
    };
    this.move = function (dt, dir) {
      switch (dir) {
        case "right":
          this.x += dt;
          break;
        case "left":
          this.x -= dt;
          break;
        default:
          //
      }
    };
};

function Rocket (x, y, velocity) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 15;
    this.velocity = velocity;
    this.img = new Image();
    this.img.src = "images/rockets.png";
    this.draw = function (ctx) {
      ctx.drawImage(this.img, this.x, this.y - 2, this.width, this.height);
    };
    this.move = function (dt) {
      this.y -= dt;
    };
};

function Bomb (x, y, velocity) {
    this.x = x;
    this.y = y;
    this.width = 15;
    this.height = 15;
    this.velocity = velocity;
    this.img = new Image();
    this.img.src = "images/bombs.png";
    this.draw = function (ctx) {
      ctx.drawImage(this.img, this.x - 2, this.y - 2, this.width, this.height);
    };
    this.move = function (dt) {
      this.y += dt;
    };
};

function Invader (x, y, rank, file, type) {
    this.x = x;
    this.y = y;
    this.rank = rank;
    this.file = file;
    this.type = type;
    this.width = 20;
    this.height = 16;
    this.img = new Image();
    this.img.src = "images/invader.png";
    this.draw = function (ctx) {
      var x = this.x - this.width / 2,
          y = this.y - this.height / 2,
          w = this.width - 2,
          h = this.height - 2;
      ctx.drawImage(this.img, x, y, w, h);
    }
};

function GameState (updateProc, drawProc, keyDown, keyUp, enter, leave) {
    this.updateProc = updateProc;
    this.drawProc = drawProc;
    this.keyDown = keyDown;
    this.keyUp = keyUp;
    this.enter = enter;
    this.leave = leave;
}
