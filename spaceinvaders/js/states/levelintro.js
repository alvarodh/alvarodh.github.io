function LevelIntroState(level) {
    this.level = level;
    this.countdownMessage = "3";
}

LevelIntroState.prototype.update = function(game, dt) {
    if(this.countdown === undefined) {
        this.countdown = 3;
    }
    this.countdown -= dt;

    if(this.countdown < 2) {
        this.countdownMessage = "2";
    }
    if(this.countdown < 1) {
        this.countdownMessage = "1";
    }
    if(this.countdown <= 0) {
        game.moveToState(new PlayState(game.config, this.level));
    }

};

LevelIntroState.prototype.draw = function(game, dt, ctx) {
    ctx.clearRect(0, 0, game.width, game.height);
    ctx.font="36px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="middle";
    ctx.textAlign="center";
    ctx.fillText("Level " + this.level, game.width / 2, game.height/2);
    ctx.font="24px Arial";
    ctx.fillText("Ready in " + this.countdownMessage, game.width / 2, game.height/2 + 36);
    return;
};
