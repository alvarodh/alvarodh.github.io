function PauseState () {
  //
}

PauseState.prototype.keyDown = function (game, keyCode) {
    if (keyCode === 80) {
        game.popState();
    }
};

PauseState.prototype.draw = function (game, dt, ctx) {
    ctx.clearRect(0, 0, game.width, game.height);
    ctx.textAlign = "center";
    dialog(ctx, "Paused", 14, "white", game.width / 2, game.height/2);
    return;
};
