function createPuzzle(imgid) {
  jQuery_uses.createPuzzle();
  cronometro.stop();
  cronometro.restart();
  puzzle.first = true;
  puzzle.start(imgid);
}

var puzzle = {
  first : true,
  tab : {
    canvas : "",
    img : "",
    pieces : {},
    free : ""
  },
  start : function (id) {
    this.tab.img = document.getElementById(id);
    document.getElementById("complete").src = this.tab.img.src;
    this.first = false;
    this.createTab();
  },
  createTab : function () {
    this.tab.canvas = document.getElementById("puzzle");
    this.tab.canvas.width = document.getElementById("complete").width;
    this.tab.canvas.height = document.getElementById("complete").height;
    this.createPieces(this.tab.canvas.width / 3, this.tab.canvas.height / 3);
  },
  createPieces : function (w, h) {
    for (var i = 0; i < 3; i++) {
      var imgy = 100 * i;
      var py = h * i;
      for (var j = 0; j < 3; j++) {
        var imgx = 100 * j;
        var px = w * j;
        var q  = (i + 1).toString() + (j + 1).toString();
        this.tab.pieces[q] = {
          src : q,
          img : [imgx, imgy, 100, 100],
          canvas : [px, py, w, h]
        };
      }
    }
    this.randomPieces();
    this.drawPuzzle();
  },
  randomPieces : function () {
    var list = [];
    var p = ["11", "12", "13", "21", "22", "23", "31", "32", "33"];
    do {
      var num = Math.floor(Math.random() * 9);
      if (!list.includes(p[num])) {
        list.push(p[num]);
      }
    } while (list.length < 9);
    var i = 0;
    for (var q in this.tab.pieces) {
      this.tab.pieces[q].src = list[i];
      if (list[i] == "33") {
        this.tab.free = q;
      }
      i++;
    }
  },
  drawPuzzle : function () {
    var ctx = this.tab.canvas.getContext("2d");
    for (var q in this.tab.pieces) {
      var src = this.tab.pieces[q].src;
      var imgdata = this.tab.pieces[src].img;
      var canvasdata = this.tab.pieces[q].canvas;
      if (this.tab.free != q) {
        ctx.drawImage(this.tab.img, imgdata[0], imgdata[1], imgdata[2], imgdata[3], canvasdata[0], canvasdata[1], canvasdata[2], canvasdata[3]);
      } else {
        ctx.clearRect(canvasdata[0], canvasdata[1], canvasdata[2], canvasdata[3]);
      }
    }
    this.drawLines(ctx);
  },
  drawLines : function (ctx) {
    pw = this.tab.canvas.width / 3;
    ph = this.tab.canvas.height / 3;
    // horizontales
    ctx.moveTo(0, ph);
    ctx.lineTo(3 * pw, ph);
    ctx.moveTo(0, 2 * ph);
    ctx.lineTo(3 * pw, 2 * ph);
    ctx.stroke();
    // verticales
    ctx.moveTo(pw, 0);
    ctx.lineTo(pw, 3 * ph);
    ctx.moveTo(2 * pw, 0);
    ctx.lineTo(2 * pw, 3 * ph);
    ctx.stroke();
  },
  move : function (e) {
    var q = this.getQuadrant(e.offsetX, e.offsetY);
    var around = {
      left : (parseInt(q) - 1).toString(),
      right : (parseInt(q) + 1).toString(),
      up : (parseInt(q) - 10).toString(),
      down : (parseInt(q) + 10).toString()
    };
    for (dir in around) {
      if (this.tab.pieces[around[dir]] != undefined && around[dir] == this.tab.free){
        this.changeQuadrant(q, around[dir]);
      }
    }
    this.drawPuzzle();
    this.checkWin();
  },
  changeQuadrant : function (q, dir) {
    aux = this.tab.pieces[dir].src;
    this.tab.pieces[dir].src = this.tab.pieces[q].src;
    this.tab.pieces[q].src = aux;
    this.tab.free = q;
  },
  getQuadrant : function (x, y) {
    var qx = ((x - (x % 100)) / 100) + 1;
    var qy = ((y - (y % 100)) / 100) + 1;
    return (qy).toString() + (qx).toString();
  },
  checkWin : function () {
    if (this.correctPieces()) {
      cronometro.stop();
      cronometro.saveTime();
    }
  },
  correctPieces : function () {
    var i = 0;
    for (var q in this.tab.pieces) {
      if (this.tab.pieces[q].src == q) {
        i++;
      }
    }
    return i == 9;
  },
  restart : function () {
    cronometro.stop();
    cronometro.restart();
    cronometro.start();
    this.createTab();
  }
}
