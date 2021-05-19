function randomphoto () {
  jQuery_uses.randomPhoto();
  cronometro.stop();
  cronometro.restart();
  fotos.start();
  scores.printRecords();
}

var fotos = {
  sesion : {first : "0", second : "0", third : "0"},
  start : function () {
    var v = 0;
    for (var pos in this.sesion) {
      v++;
      do {
        this.sesion[pos] = Math.floor(Math.random() * 10) + 1;
      } while (this.repeat(pos));
      document.getElementById("img" + v).src = "images/" + this.sesion[pos] + ".jpg";
    }
  },
  repeat : function (pos) {
    var samefirst = this.sesion[pos] == this.sesion["first"];
    var samesecond = this.sesion[pos] == this.sesion["second"];
    switch (pos) {
      case "first":
        return false;
        break;
      case "second":
        return samefirst;
        break;
      case "third":
        return samefirst || samesecond;
    }
  }
}
