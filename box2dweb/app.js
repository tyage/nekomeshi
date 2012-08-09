var express = require('express');
var app = express.createServer();
var ejs = require('ejs');
var io = require('socket.io');
var Box2D = require('./box2dweb.js');
var port = process.env.PORT || 5000;

// ----------http
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

// ----------box2d
var b2Vec2 = Box2D.Common.Math.b2Vec2
, b2AABB = Box2D.Collision.b2AABB
,	b2BodyDef = Box2D.Dynamics.b2BodyDef
,	b2Body = Box2D.Dynamics.b2Body
,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
,	b2Fixture = Box2D.Dynamics.b2Fixture
,	b2World = Box2D.Dynamics.b2World
,	b2MassData = Box2D.Collision.Shapes.b2MassData
,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
, b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef
, b2Math = Box2D.Common.Math.b2Math
, b2Color = Box2D.Common.b2Color
, b2Shape = Box2D.Collision.Shapes.b2Shape
, b2Settings = Box2D.Common.b2Settings
, b2WorldManifold = Box2D.Collision.b2WorldManifold
;
	
var world = new b2World(new b2Vec2(0, 20), true);

var fixDef = new b2FixtureDef;
fixDef.density = 1.0;
fixDef.friction = 0.5;
fixDef.restitution = 0.2;

var bodyDef = new b2BodyDef;

//create ground
bodyDef.type = b2Body.b2_staticBody;
bodyDef.userData = {
	color: new b2Color(Math.random(), Math.random(), Math.random())
};
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
for(var i = 0; i < 10; ++i) {
	if(Math.random() > 0.5) {
		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(
			Math.random() + 0.1 //half width
			,	Math.random() + 0.1 //half height
		);
	} else {
		fixDef.shape = new b2CircleShape(
			Math.random() + 0.1 //radius
		);
	}
	bodyDef.position.x = Math.random() * 10;
	bodyDef.position.y = Math.random() * 10;
	bodyDef.userData = {
		color: new b2Color(Math.random(), Math.random(), Math.random())
	};
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
	fixDef.shape = new b2CircleShape(Math.random() + 0.1);
	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.position.x = Math.random() * 10;
	bodyDef.position.y = Math.random() * 10;
	bodyDef.userData = {
		color: new b2Color(Math.random(), Math.random(), Math.random())
	};
	var playerBody = world.CreateBody(bodyDef);
	var playerFixture = playerBody.CreateFixture(fixDef);
	
	playerBody.norm = [];
	client.on('move', function (direction) {
		var accelX = 2;
		var maxVelocityLengthX = 7;
		var minVelocityY = -20;
		var jump = 15;
		
		playerBody.SetAwake(true);
		switch(direction) {
			case 'left':
			case 'right':
				{
					accelX = (direction === 'left' ? -accelX : accelX);
					if (Math.abs(playerBody.m_linearVelocity.x + accelX) < maxVelocityLengthX) {
						playerBody.m_linearVelocity.x += accelX;
					}
				}
				break;
			case 'up':
				{
					var onGround = false;
					for (c = playerBody.m_contactList; c; c = c.next) {
						var contact = c.contact;
						var a = contact.GetFixtureA();
						var worldManifold = new b2WorldManifold();
						contact.GetWorldManifold(worldManifold)
						var norm = worldManifold.m_normal.y * (a === playerBody ? -1 : 1);
						var norm2 = contact.m_manifold.m_localPlaneNormal.y * (a === playerBody ? 1 : -1);
						if ((norm > 0.707 && norm2 == 0) || norm2 > 0) {
							onGround = true;
							break;
						}
					}
					if (onGround && playerBody.m_linearVelocity.y - jump > minVelocityY) {
						playerBody.m_linearVelocity.y -= jump;
					}
				}
				break;
		}
	});
	client.on('disconnect', function() {
		world.DestroyBody(playerBody);
	});
});

var reload = function() {
	var objects = [];
	var b, f, s, xf;
	
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
						objects.push({
							type: s.m_type,
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
								color: b.m_userData && b.m_userData.color && b.m_userData.color.color
							}
						});
					}
					break;
				case b2Shape.e_polygonShape:
					{
						var i = 0;
						var poly = ((s instanceof b2PolygonShape ? s : null));
						var vertexCount = parseInt(poly.GetVertexCount());
						var localVertices = poly.GetVertices();
						var vertices = new Array(vertexCount);
						for (i = 0;i < vertexCount; ++i) {
							vertices[i] = b2Math.MulX(xf, localVertices[i]);
						}
						objects.push({
							type: s.m_type,
							vertices: vertices,
							vertexCount: vertexCount,
							color: {
								color: b.m_userData && b.m_userData.color && b.m_userData.color.color
							}
						});
					}
					break;
				case b2Shape.e_edgeShape:
					{
						var edge = (s instanceof b2EdgeShape ? s : null);
						objects.push({
							type: s.m_type,
							p1: b2Math.MulX(xf, edge.GetVertex1()),
							p2: b2Math.MulX(xf, edge.GetVertex2()),
							color: {
								color: b.m_userData && b.m_userData.color && b.m_userData.color.color
							}
						});
					}
					break;
			}
		}
	}
	socket.sockets.emit('reload', objects);
};
