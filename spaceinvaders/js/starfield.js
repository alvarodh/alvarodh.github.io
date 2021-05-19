function Starfield () {
	this.fps = 30;
	this.canvas = null;
	this.width = 0;
	this.width = 0;
	this.minVelocity = 15;
	this.maxVelocity = 30;
	this.stars = 2500;
	this.intervalId = 0;
}

Starfield.prototype.initialise = function (div) {
	var self = this;
	self.width = window.innerWidth;
	self.height = window.innerHeight;
	window.onresize = function (event) {
		self.width = window.innerWidth;
		self.height = window.innerHeight;
		self.canvas.width = self.width;
		self.canvas.height = self.height;
		self.draw();
 	};
	this.canvas = document.createElement("canvas");
	div.appendChild(this.canvas);
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	this.ctx = this.canvas.getContext("2d");
};

Starfield.prototype.start = function () {
	var stars = [];
	for(var i = 0; i < this.stars; i++) {
		var x = Math.random() * this.width,
				y = Math.random() * this.height,
				size = (Math.random() * 3 + 1) / 7,
				velocity = (Math.random() * (this.maxVelocity - this.minVelocity)) + this.minVelocity;
		stars[i] = new Star(x, y, size, velocity);
	}
	this.stars = stars;
	var self = this;
	this.intervalId = setInterval(function () {
		self.update();
		self.draw();
	}, 1000 / this.fps);
};

Starfield.prototype.stop = function () {
	clearInterval(this.intervalId);
};

Starfield.prototype.update = function() {
	var dt = 1 / this.fps;
	for (var i = 0; i < this.stars.length; i++) {
		this.stars[i].y += dt * this.stars[i].velocity;
		if (this.stars[i].y > this.height) {
			var x = Math.random() * this.width,
					size = (Math.random() * 3 + 1) / 7,
					velocity = (Math.random() * (this.maxVelocity - this.minVelocity)) + this.minVelocity;
			this.stars[i] = new Star(x, 0, size, velocity);
		}
	}
};

Starfield.prototype.draw = function () {
 	this.ctx.fillStyle = "black";
	this.ctx.fillRect(0, 0, this.width, this.height);
	for (var i = 0; i < this.stars.length;i++) {
		this.stars[i].draw(this.ctx);
	}
};

function randomColor () {
	var colors = ["yellow", "white"];
	return colors[Math.floor(Math.random() * 2)];
}

function Star (x, y, size, velocity) {
	this.x = x;
	this.y = y;
	this.color = randomColor();
	this.size = size;
	this.velocity = velocity;
	this.draw = function (ctx) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}
