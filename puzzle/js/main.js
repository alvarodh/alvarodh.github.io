var scripts = "<script src='js/jquery.min.js'></script> \
               <script src='js/puzzle.js'></script> \
               <script src='js/fotos.js'></script> \
               <script src='js/cronometro.js'></script> \
               <script src='js/scores.js'></script>";

document.write(scripts);

var jQuery_uses = {
  createPuzzle : function () {
    $(document).ready(function(){
      $("#select").hide(1000);
      $("#complete").show(1000);
      $("#start").show();
      $("#change").show();
      $("#container").hide();
      $("#header").hide();
      $("#restart").hide();
      $("#crono").hide();
      $("#showrecords").hide();
      $("#record").hide();
      $("#winmessage").hide();
    });
  },
  showRecords : function () {
    $(document).ready(function(){
      $("#record").show(1000);
      $("#hall").show();
      $("#hiderecords").show();
      $("#change").hide();
      $("#showrecords").hide();
      $("#select").hide();
      $("#hall").hide();
      $("#header").hide();
    });
  },
  hideRecords : function () {
    $(document).ready(function(){
      $("#record").hide();
      $("#hall").hide();
      $("#hiderecords").hide();
      $("#change").show();
      $("#showrecords").show();
      $("#select").show();
      $("#header").show();
    });
  },
  randomPhoto : function () {
    $(document).ready(function(){
      $("#select").show(1000);
      $("#change").show();
      $("#showrecords").show();
      $("#header").show();
      $("#start").hide();
      $("#restart").hide();
      $("#hall").hide();
      $("#container").hide();
      $("#complete").hide(1000);
      $("#crono").hide();
      $("#record").hide();
      $("#hiderecords").hide();
      $("#winmessage").hide();
    });
  },
  saveTime : function () {
    $(document).ready(function(){
      $("#container").hide(1000);
      $("#crono").hide();
      $("#header").hide();
      $("#record").hide();
      $("#complete").hide();
      $("#restart").hide();
      $("#change").hide();
      $("#winmessage").show();
    });
  },
  startCrono : function () {
    $(document).ready(function(){
      $("#start").hide();
      $("#showrecords").hide();
      $("#restart").show();
      $("#container").show(1000);
      $("#crono").show();
      $("#record").hide();
    });
  }
}
