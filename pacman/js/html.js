function charge() {
  name();
  select();
  controls();
  $(document).ready(function () {
    $("#crono").hide();
    $("#scores").hide();
    $("#controls").hide();
    $("#pacman").hide();
    $("#select").hide();
    $("#name").show();
  });
}

function name() {
  var div = document.getElementById("name");
  div.innerHTML ="<form> \
                    PUT YOUR NAME: <input id='nick' type='text' value=''/> \
                    <input id='start' type='button' value='START' onclick='saveName()'/> \
                  </form>"
}


function select() {
  var div = document.getElementById("select");
  div.innerHTML = "<img id= 'yellow' src='images/pacman_yellow.png' onclick='selectColour(this)'> \
                   <img id= 'cyan' src='images/pacman_cyan.png' onclick='selectColour(this)'> \
                   <img id= 'magenta' src='images/pacman_magenta.png' onclick='selectColour(this)'> \
                   <h1>SELECT A COLOUR</h1>"
}


function controls() {
  var div = document.getElementById("controls");
  div.innerHTML = "<h2>Instructions</h2> \
                   <p>Press <strong>N</strong> for Start</p> \
                   <p>Press <strong>P</strong> for Pause</p> \
                   <p>Press <strong>P</strong> again for end Pause<p> \
                   <p>Press <strong>R</strong> for show records</p> \
                   <p>Press <strong>R</strong> again for hide records<p> \
                   <p>Press <strong>M</strong> for mute app</p> \
                   <p>Use <img id='arrows' src='images/arrows.png'> for move</p>";
}
