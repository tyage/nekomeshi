var setting = require('./setting.js'),
	neko2d = require('./neko2d.js'),
	Vec = neko2d.Vec;

var world = module.exports = new neko2d.World();
world.start = function(callback) {
	var interval = setting.game.interval;
	setInterval(function() {
		var isOniExists = false;
		world.bodies.forEach(function(body) {
			if (body.isNextOni) {
				isOniExists = true;
			}
		});
		if (!isOniExists) {
			for (i in world.bodies) {
				var body = world.bodies[i]
				if (body) {
					body.isNextOni = true;
					break;
				}
			};
		}

		world.step(interval);
		callback && callback();
	}, interval);
};
world.createPlayer = function() {
	var player = new Player();
	this.createBody(player);
	return player;
};

var id = 0;
var Player = function() {
	this.id = id++;
	this.pos = new Vec(Math.random()*setting.game.width, Math.random()*setting.game.height);
	this.radius = setting.game.radius;
	this.actions = {
		left: false,
		top: false,
		right: false,
		down: false
	};
	this.contactListener = new Player.ContactListener(this);
};
Player.prototype = new neko2d.Body();
Player.prototype.getData = function() {
	return {
		id: this.id,
		isOni: this.isOni,
		center: {
			x: this.pos.x,
			y: this.pos.y
		},
		radius: this.radius
	};
};
Player.prototype.step = function(interval) {
	var moveStep = setting.game.moveDistance * interval,
		moveVectors = {
			right: new Vec(moveStep, 0),
			left: new Vec(-moveStep, 0),
			up: new Vec(0, -moveStep),
			down: new Vec(0, moveStep)
		};

	this.actions.left && this.move(moveVectors.left);
	this.actions.up && this.move(moveVectors.up);
	this.actions.right && this.move(moveVectors.right);
	this.actions.down && this.move(moveVectors.down);

	if (this.pos.x < 0) this.pos.x = 0;
	if (this.pos.y < 0) this.pos.y = 0;
	if (this.pos.x > setting.game.width) this.pos.x = setting.game.width;
	if (this.pos.y > setting.game.height) this.pos.y = setting.game.height;

	this.isOni = this.isNextOni;
};

Player.ContactListener = function(body) {
	this.body = body;
};
Player.ContactListener.prototype = new neko2d.ContactListener();
Player.ContactListener.prototype.add = function(contact) {
	if (contact.isOni) {
		this.body.isNextOni = true;
		contact.isNextOni = false;
	}
};