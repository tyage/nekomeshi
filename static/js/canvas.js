var Canvas = function(jCanvas) {
	this.ctx = jCanvas.get(0).getContext('2d');
	this.width = jCanvas.width();
	this.height = jCanvas.height();
	this.drawScale = 30.0;
	this.alpha = 1.0;
	this.fillAlpha = 0.5;
};
Canvas.prototype = {
	draw: function(objects) {
		this.ctx.clearRect(0, 0, this.width, this.height);
		
		var i = 0, l = objects.length, object;
		for (;i<l;++i) {
			object = objects[i];
			if (object) {
				this.drawCharacter(object);
			}
		};
	},
	drawCharacter: function(object) {
		this.drawCircle(object.center, object.radius, object.axis, object.color);
	},
	drawCircle: function(center, radius, axis, color) {
		if (!radius) return;
		var s = this.ctx;
			 drawScale = this.drawScale,
			 cx = center.x * drawScale,
			 cy = center.y * drawScale;
		s.moveTo(0, 0);
		s.beginPath();
		s.strokeStyle = this._color(color.color, this.alpha);
		s.fillStyle = this._color(color.color, this.fillAlpha);
		s.arc(cx, cy, radius * drawScale, 0, Math.PI * 2, true);
		s.moveTo(cx, cy);
		s.lineTo((center.x + axis.x * radius) * drawScale, (center.y + axis.y * radius) * drawScale);
		s.closePath();
		s.fill();
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

