var scores = {
  showRecords : function () {
    jQuery_uses.showRecords();
    hallOfFame();
  },
  hideRecords : function () {
    jQuery_uses.hideRecords();
  },
  addTime : function () {
    var time = this.getTime();
    var name = document.getElementById("nick").value;
    this.saveRecord(time, name);
    randomfoto();
  },
  getTime : function () {
    var name = document.getElementById("nick").value;
    var s = document.getElementById("seconds").innerHTML;
    var m = document.getElementById("minutes").innerHTML;
    var h = document.getElementById("hours").innerHTML;
    return h.toString() + ":" + m.toString() + ":" + s.toString();
  },
  printRecords : function () {
    var table = document.getElementById("record");
    var cells = "<th>Tabla de records</th>";
    if (localStorage.puzzle_record != undefined) {
      record = localStorage.puzzle_record.split("//");
      for (var i = 0; i < record.length; i++) {
        if (record[i] != undefined && record[i] != "") {
          name = record[i].split("→")[0];
          time = record[i].split("→")[1];
          cells += "<tr> \
                      <td>" + (i + 1).toString() + ". " + name + "</td> \
                      <td> → " + time + "</td> \
                    </tr>"
        }
      }
    }
    table.innerHTML = cells;
  },
  saveRecord : function (t, name) {
    var r = name + "→" + t;
    if (localStorage.puzzle_record != undefined) {
      localStorage["puzzle_record"] = this.addRecord(r);
    } else {
      localStorage["puzzle_record"] = r;
    }
  },
  addRecord : function (r) {
    var record = localStorage.puzzle_record;
    record += "//" + r;
    return record;
  }
}

function hallOfFame () {
  var hall = document.getElementById("hall");
  if (localStorage.puzzle_record != undefined) {
    var record = localStorage.puzzle_record;
    hall.innerHTML = "";
  }
}
