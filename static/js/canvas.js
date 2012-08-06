var Canvas = {
	ctx: null,
	width: null,
	height: null,
	draw: function(objects) {
		Canvas.ctx.clearRect(0, 0, Canvas.width, Canvas.height);
		
		var i = 0, l = objects.length, object;
		for (;i<l;++i) {
			object = objects[i];
			if (object) {
				Canvas.drawCharacter(object);
			}
		};
	},
	drawCharacter: function(object) {
		var ctx = Canvas.ctx;
		ctx.beginPath();
		ctx.fillStyle = object.color;
		ctx.arc(object.x, object.y, object.size, 0, Math.PI*2, false);
		ctx.fill();

	}
};

$(function(){
	var canvas = $("#stage");
	Canvas.ctx = canvas.get(0).getContext('2d');
	Canvas.width = canvas.width();
	Canvas.height = canvas.height();
});

