var container = document.getElementById("galaxy"),
    starfield = new Starfield();
starfield.initialise(container);
starfield.start();

var canvas = document.getElementById("gameCanvas"),
    game = new Game();
canvas.width = 800;
canvas.height = 600;
game.initialise(canvas);
game.start();

window.addEventListener("keydown", function keydown(e) {
  var keycode = e.which || window.event.keycode;
  if(keycode === 37 || keycode === 39 || keycode === 32) {
  e.preventDefault();
  }
  game.keyDown(keycode);
});

window.addEventListener("keyup", function keydown(e) {
  var keycode = e.which || window.event.keycode;
  game.keyUp(keycode);
});
