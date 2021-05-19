var cronometro = {
  time : "",
  start : function () {
    jQuery_uses.startCrono();
    var count_s = 0;
    var count_m = 0;
    var count_h = 0;
    var sec = document.getElementById("seconds");
    var min = document.getElementById("minutes");
    var hou = document.getElementById("hours");
    this.time = setInterval(
      function (){
        if (count_s == 60) {
          count_s = 0;
          count_m++;
          if (count_m >= 10) {
            min.innerHTML = count_m;
          } else {
            min.innerHTML = "0" + count_m;
          }
          if (count_m == 60) {
            count_m = 0;
            count_h++;
            hou.innerHTML = "0" + count_h;
          }
        }
        if (count_s >= 10) {
          sec.innerHTML = count_s;
        } else {
          sec.innerHTML = "0" + count_s;
        }
        count_s++;
      }, 1000)
  },
  stop : function () {
    clearInterval(this.time);
  },
  saveTime : function () {
    jQuery_uses.saveTime();
    var s = document.getElementById("seconds").innerHTML;
    var m = document.getElementById("minutes").innerHTML;
    var h = document.getElementById("hours").innerHTML;
    var mess = "Has acabado el puzle en " + h + ":" + m + ":" + s;
    document.getElementById("time").innerHTML = mess;
  },
  restart : function () {
    document.getElementById("seconds").innerHTML = "00";
    document.getElementById("minutes").innerHTML = "00";
    document.getElementById("hours").innerHTML = "00";
  }
}
