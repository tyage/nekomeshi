var Canvas = function(jCanvas) {
	this.ctx = jCanvas.get(0).getContext('2d');
	this.width = jCanvas.width();
	this.height = jCanvas.height();
	this.drawScale = 30.0;
	this.alpha = 1.0;
	this.fillAlpha = 0.5;
	this.blocks = [[]];
};
Canvas.prototype = {
	waiting: function(data) {
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.font = "20pt Arial";
		this.ctx.fillText("Waiting... " + data.waiting + "/" + data.max, 50, 50);
	},
	countdown: function(minute) {
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.font = "20pt Arial";
		this.ctx.fillText(minute, 50, 50);
	},
	gameOver: function(win) {
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.font = "20pt Arial";
		this.ctx.fillText((win ? "You win!" : "You lose..."), 50, 50);
		this.draw = function(){};
	},
	draw: function(objects) {
		this.ctx.clearRect(0, 0, this.width, this.height);
		
		// drawBlocks
		for (var i=0,l=this.blocks.length;i<l;++i) {
			var blocks = this.blocks[i];
			for (var j=0,m=blocks.length;j<m;++j) {
				switch (blocks[j]) {
					case 1:
						this.ctx.fillStyle = "black";
						this.drawRect(this.blockWidth * j, this.blockHeight * i, 
							this.blockWidth, this.blockHeight);
						break;
					case 2:
						this.ctx.fillStyle = "red";
						this.drawRect(this.blockWidth * j, this.blockHeight * i, 
							this.blockWidth, this.blockHeight);
						break;
				}
			}
		}

		// draw Objecs
		var i = 0, l = objects.length, object;
		for (;i<l;++i) {
			object = objects[i];
			if (object) {
				this.drawObject(object);
			}
		};
	},
	drawObject: function(object) {
		// this.drawCircle(object.center, object.radius, object.color);
		this.drawRect(object.x, object.y, object.width, object.height);
	},
	drawRect: function(x, y, width, height) {
		var ctx = this.ctx;
		ctx.beginPath();
		ctx.fillRect(x * this.drawScale, y * this.drawScale, 
			width * this.drawScale, height * this.drawScale);
	},
	drawCircle: function(center, radius, color) {
		if (!radius) return;
		var s = this.ctx,
			drawScale = this.drawScale,
			cx = center.x * drawScale,
			cy = center.y * drawScale;
		s.moveTo(0, 0);
		s.beginPath();
		s.strokeStyle = this._color(color, this.alpha);
		s.fillStyle = this._color(color, this.fillAlpha);
		s.arc(cx, cy, radius * drawScale, 0, Math.PI * 2, true);
		s.closePath();
		s.fill();
		s.stroke();
	},
	drawSolidPolygon: function (vertices, vertexCount, color) {
		if (!vertexCount) return;
		var s = this.ctx;
		var drawScale = this.drawScale;
		s.beginPath();
		s.strokeStyle = this._color(color.color, this.alpha);
		s.fillStyle = this._color(color.color, this.fillAlpha);
		s.moveTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
		for (var i = 1; i < vertexCount; i++) {
			s.lineTo(vertices[i].x * drawScale, vertices[i].y * drawScale);
		}
		s.lineTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
		s.closePath();
		s.fill();
		s.stroke();
	},
	drawSegment: function (p1, p2, color) {
		var s = this.ctx,
			drawScale = this.drawScale;
		s.strokeStyle = this._color(color.color, this.m_alpha);
		s.beginPath();
		s.moveTo(p1.x * drawScale, p1.y * drawScale);
		s.lineTo(p2.x * drawScale, p2.y * drawScale);
		s.closePath();
		s.stroke();
	},
	_color: function (color, alpha) {
		return "rgba(" + ((color & 0xFF0000) >> 16) + "," + ((color & 0xFF00) >> 8) + "," + (color & 0xFF) + "," + alpha + ")";
	}
};

var Stage = null;

$(function(){
	Stage = new Canvas($("#stage"));
});

