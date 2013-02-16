var setting = require('./setting.js'),
	neko2d = require('./neko2d.js');

var world = module.exports = new neko2d.World();
world.start = function(callback) {
	var interval = setting.game.interval;
	setInterval(function() {
		world.step(interval);
		callback && callback();
	}, interval);
};
world.createPlayer = function() {
	var player = new Player();
	this.createObject(player);
	return player;
};

var Player = function() {
		var colors = [0xff0000, 0x00ff00, 0x0000ff];
		this.color = colors[parseInt(colors.length*Math.random())];
		this.pos = new neko2d.Vec(Math.random()*5+3, Math.random()*5+3);
		this.radius = Math.random()+0.3;
};
Player.prototype = new neko2d.Object();
Player.prototype.getData = function() {
	return {
		color: this.color,
		center: {
			x: this.pos.x,
			y: this.pos.y
		},
		radius: this.radius
	};
};