function GameOverState () {
  //
}

GameOverState.prototype.update = function (game, dt) {
  //
};

GameOverState.prototype.draw = function (game, dt, ctx) {
    ctx.clearRect(0, 0, game.width, game.height);
    ctx.textAlign = "center";
    var gameovermess = "Game Over!",
        sesioninfo = "You scored " + game.score + " and got to level " + game.level;
    dialog(ctx, gameovermess, 30, "white", game.width / 2, game.height / 2 - 40);
    dialog(ctx, sesioninfo, 16, "white", game.width / 2, game.height / 2);
    dialog(ctx, "Press 'Space' to play again.", 16, "white", game.width / 2, game.height / 2 + 40);
};

GameOverState.prototype.keyDown = function (game, keyCode) {
    if (keyCode === 32) {
        game.lives = 3;
        game.score = 0;
        game.level = 1;
        game.moveToState(new LevelIntroState(1));
    }
};
