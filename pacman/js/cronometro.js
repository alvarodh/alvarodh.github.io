Pacman.Crono = function () {

	var segundos = 0,
			minutos = 0,
			horas = 0;

	function start () {
		control = setInterval(timer,1000);
	};

	function stop () {
		clearInterval(control);
	};

	function restart () {
		clearInterval(control);
		segundos = 0;
		minutos = 0;
		horas = 0;
		Seconds.innerHTML = ":00";
		Minutes.innerHTML = ":00";
		Hours.innerHTML = "00";
	};

	function getTime() {
		return [horas, minutos, segundos];
	};

	function create(div_id) {
		var div = document.getElementById(div_id);
		div.innerHTML = "<div class='clock' id='Hours'>00</div> \
								  	 <div class='clock' id='Minutes'>:00</div> \
								  	 <div class='clock' id='Seconds'>:00</div>";
	}

	function timer () {
	  segundos++;
		if (segundos < 10) {
	    var seg = "0" + segundos;
	  } else {
	    var seg = segundos;
	  }
		Seconds.innerHTML = ":" + seg;
		if (segundos == 59) {
			segundos = -1;
		}
		if (segundos == 0) {
			minutos++;
			if (minutos < 10) {
	      var min = "0" + minutos;
	    } else {
	      var min = minutos;
	    }
			Minutes.innerHTML = ":" + min;
		}
		if (minutos == 59) {
			minutos = -1;
		}
		if ((segundos == 0) && (minutos == 0) ) {
			horas ++;
			if (horas < 10) {
	      var hor = "0" + horas;
	    } else {
	      var hor = horas;
	    }
			Hours.innerHTML = hor;
		}
	};

	return {
		"start"   : start,
		"restart" : restart,
		"stop"    : stop,
		"getTime" : getTime,
		"create"  : create
	};
}
