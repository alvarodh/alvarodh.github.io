Pacman.Scores = function () {

  function saveScore (score, time_list, level) {
    var nick = document.getElementById("nick").value;
    document.getElementById("nick").value = "";
    var time = writeTime(time_list);
    console.log(time_list)
    var new_record = nick + " " + score + " " + time + " " + level;
    if (localStorage.pacman_record !== undefined) {
      var records = localStorage.pacman_record;
      records += " // " + new_record;
      localStorage["pacman_record"] = records;
    } else {
      localStorage["pacman_record"] = new_record;
    }
  };

  function writeTime(time_list) {
    var time = "";
    for (var i = 0; i < time_list.length; i++) {
      if (time_list[i] > 9) {
        time += time_list[i];
      } else {
        time += "0" + time_list[i];
      }
      if (i !== (time_list.length - 1)) {
        time += ":";
      }
    }
    return time;
  }

  function show() {
    $(document).ready(function () {
      $("#pacman").hide();
      $("#crono").hide();
      $("#scores").show();
    });
    if (localStorage.pacman_record !== undefined) {
      var records = localStorage.pacman_record.split(" // ");
      var hall_of_fame = "<h1>Hall of fame:</h1></br>"
      for (var i = 0; i < records.length; i++) {
        hall_of_fame += "<h2>" + (i + 1).toString() + ". " + records[i].split(" ")[0];
        hall_of_fame += " died in level " + records[i].split(" ")[3];
        hall_of_fame += " with " + records[i].split(" ")[1] + " points in ";
        hall_of_fame += records[i].split(" ")[2] + "</h2><br>";
      }
      document.getElementById("scores").innerHTML = hall_of_fame;
    } else {
      document.getElementById("scores").innerHTML = "<h1>You will be the first in the hall of fame!</h1>";
    }
  };

  function hide() {
    $(document).ready(function () {
      $("#pacman").show();
      $("#crono").show();
      $("#scores").hide();
    });
  };

  return {
    "saveScore"  : saveScore,
    "showScores" : show,
    "hideScores" : hide
  }
}
