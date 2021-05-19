var cronometro = {
  time : "",
  init : function (div_id) {
    var div = document.getElementById(div_id);
    div.innerHTML = "<span id='hours'>00</span>\
                     <span>:</span>\
                     <span id='minutes'>00</span>\
                     <span>:</span>\
                     <span id='seconds'>00</span>"
  },
  start : function () {
    var count_s = 0,
        count_m = 0,
        count_h = 0,
        sec = document.getElementById("seconds"),
        min = document.getElementById("minutes"),
        hou = document.getElementById("hours");
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
  restart : function () {
    document.getElementById("seconds").innerHTML = "00";
    document.getElementById("minutes").innerHTML = "00";
    document.getElementById("hours").innerHTML = "00";
  },
  getTime : function () {
    return "" + ":" + "" + ":" + "";
  }
}
