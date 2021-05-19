function WelcomeState() {
  //
}

WelcomeState.prototype.enter = function (game) {
    game.sounds = new Sounds();
    game.sounds.init();
    game.sounds.loadSound('shoot', 'sounds/shoot.wav');
    game.sounds.loadSound('bang', 'sounds/bang.wav');
    game.sounds.loadSound('explosion', 'sounds/explosion.wav');
};

WelcomeState.prototype.update = function (game, dt) {
  //
};

WelcomeState.prototype.draw = function (game, dt, ctx) {
    ctx.clearRect(0, 0, game.width, game.height);
    ctx.textAlign = "center";
    dialog(ctx, "Super-SpaceInvaders", 30, "white", game.width / 2, game.height / 2 - 40);
    dialog(ctx, "Press 'Space' to start.", 16, "white", game.width / 2, game.height / 2);
};

WelcomeState.prototype.keyDown = function (game, keyCode) {
    if (keyCode === 32) {
        game.level = 1;
        game.score = 0;
        game.lives = 3;
        game.moveToState(new LevelIntroState(game.level));
    }
};

function dialog (ctx, text, size, color, x, y) {
  ctx.fillStyle = color;
  ctx.font = size + "px monospace";
  ctx.fillText(text, x, y);
}
