var express = require('express');
var app = express.createServer();
var ejs = require('ejs');
var io = require('socket.io');
<<<<<<< HEAD
var Box2D = require('./box2dweb/Box2dWeb-2.1.a.3.min.js');
var port = process.env.PORT || 5000;

// ----------http
=======
var neko2d = require('./neko2d.js');
var port = process.env.PORT || 5000;

>>>>>>> parent of 22f804e... remove unnecessary files
app.configure(function() {
	app.use(express.static(__dirname + '/static'));

	app.set('view engine', 'ejs');
	app.set('view options', { layout: false });
	app.get('/', function(req, res) {
		console.log('/');
		res.render('index.ejs');
	});
	app.listen(port);
});

<<<<<<< HEAD
// ----------box2d
var   b2Vec2 = Box2D.Common.Math.b2Vec2
  ,  b2AABB = Box2D.Collision.b2AABB
,	b2BodyDef = Box2D.Dynamics.b2BodyDef
,	b2Body = Box2D.Dynamics.b2Body
,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
,	b2Fixture = Box2D.Dynamics.b2Fixture
,	b2World = Box2D.Dynamics.b2World
,	b2MassData = Box2D.Collision.Shapes.b2MassData
,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
, b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
, b2Math = Box2D.Common.Math.b2Math
, b2Color = Box2D.Common.b2Color
, b2Shape = Box2D.Collision.Shapes.b2Shape
;
  
var world = new b2World(
     new b2Vec2(0, 10)    //gravity
  ,  true                 //allow sleep
);

var fixDef = new b2FixtureDef;
fixDef.density = 1.0;
fixDef.friction = 0.5;
fixDef.restitution = 0.2;

var bodyDef = new b2BodyDef;

//create ground
bodyDef.type = b2Body.b2_staticBody;
fixDef.shape = new b2PolygonShape;
fixDef.shape.SetAsBox(20, 2);
bodyDef.position.Set(10, 400 / 30 + 1.8);
world.CreateBody(bodyDef).CreateFixture(fixDef);
bodyDef.position.Set(10, -1.8);
world.CreateBody(bodyDef).CreateFixture(fixDef);
fixDef.shape.SetAsBox(2, 14);
bodyDef.position.Set(-1.8, 13);
world.CreateBody(bodyDef).CreateFixture(fixDef);
bodyDef.position.Set(21.8, 13);
world.CreateBody(bodyDef).CreateFixture(fixDef);

//create some objects
bodyDef.type = b2Body.b2_dynamicBody;
for(var i = 0; i < 5; ++i) {
	/*
  if(Math.random() > 0.5) {
     fixDef.shape = new b2PolygonShape;
     fixDef.shape.SetAsBox(
           Math.random() + 0.1 //half width
        ,  Math.random() + 0.1 //half height
     );
  } else {
     fixDef.shape = new b2CircleShape(
        Math.random() + 0.1 //radius
     );
  }
  */
	fixDef.shape = new b2CircleShape(
		Math.random() + 0.1 //radius
	);
  bodyDef.position.x = Math.random() * 10;
  bodyDef.position.y = Math.random() * 10;
  world.CreateBody(bodyDef).CreateFixture(fixDef);
}

setInterval(function() {
  world.Step(1 / 60, 10, 10);
  world.ClearForces();
  reload();
}, 1000 / 60);

// ----------websocket
var socket = io.listen(app);
socket.on('connection', function(client) {
	client.on('move', function (direction) {
	});
	client.on('disconnect', function() {
=======
var world = new neko2d.World();
var Player = function() {
	var colors = [0xff0000, 0x00ff00, 0x0000ff];
	this.color = colors[parseInt(colors.length*Math.random())];
	this.x = Math.random()*6+3;
	this.y = Math.random()*6+3;
	this.radius = Math.random()+0.3;
};
Player.prototype = new neko2d.Object();
Player.prototype.getData = function() {
	return {
		color: this.color,
		center: {
			x: this.x,
			y: this.y
		},
		radius: this.radius
	};
};

var socket = io.listen(app);
socket.on('connection', function(client) {
	var player = new Player();
	world.createObject(player);
	
	reload();
	
	client.on('move', function (direction) {
		player.move(direction);
		reload();
	});
	client.on('disconnect', function() {
		world.deleteObject(player);
>>>>>>> parent of 22f804e... remove unnecessary files
	});
});

var reload = function() {
<<<<<<< HEAD
	var objects = [];
  var b, f, s, xf;
  var color = new b2Color(0, 0, 0);
  
	for (b = world.m_bodyList; b; b = b.m_next) {
		xf = b.m_xf;
		for (f = b.GetFixtureList(); f; f = f.m_next) {
		  s = f.GetShape();
      switch (s.m_type) {
	      case b2Shape.e_circleShape:
      	{
					var circle = ((s instanceof b2CircleShape ? s : null));
					var center = b2Math.MulX(xf, circle.m_p);
					var radius = circle.m_radius;
					var axis = xf.R.col1;
					color.Set(0.5, 0.5, 0.3);
					var object = {
						center: {
							x: center.x,
							y: center.y
						},
						radius: radius,
						axis: {
							x: axis.x,
							y: axis.y
						},
						color: {
							color: color.color
						}
					};
					objects.push(object);
				}
				break;
			}
		}
	}
	socket.sockets.emit('reload', objects);
=======
	var data = world.objects.map(function(obj, i) {
		return obj.getData();
	});
	socket.sockets.emit('reload', data);
>>>>>>> parent of 22f804e... remove unnecessary files
};
