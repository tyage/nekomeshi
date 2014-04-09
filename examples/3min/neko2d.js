var World = function() {
	this.players = [];
	this.blockData = [];
};
World.prototype = {
	blockWidth: 1,
	blockHeight: 1,
	step: function() {
		this.players.forEach(function(player, i) {
			player.step();
		});
	},
	addPlayers: function(players) {
		var self = this;
		players.forEach(function(player, i) {
			player.world = self;
			self.players.push(player);
		});
	},
	getBlocks: function(x, y, width, height) {
		var points = [
			[x, y],
			[x + width, y],
			[x, y + height],
			[x + width, y + height]
		];
		var blocks = [];
		var self = this;
		points.forEach(function(point, i) {
			var col = Math.floor(point[0] / self.blockWidth);
			var row = Math.floor(point[1] / self.blockHeight);
			if (self.blockMap[row] && self.blockMap[row][col]) {
				var block = self.blockData[self.blockMap[row][col]];
				blocks.push(block);
			}
		});
		return blocks;
	}
};

var Block = function() {};
Block.prototype = {
	onBlock: function(player) {
	}
};

var Player = function() {
	this.keys = [];
};
Player.prototype = {
	moveStep: 0.04,
	x: 0,
	y: 0,
	width: 0.5,
	height: 0.6,
	step: function() {
		var key2vector = {
			up: [0, -this.moveStep],
			left: [-this.moveStep, 0],
			down: [0, this.moveStep],
			right: [this.moveStep, 0]
		};
		for (var key in this.keys) {
			if (this.keys[key] && key2vector[key]) {
				vector = key2vector[key];
				if (this.canMove(vector)) {
					this.x += vector[0];
					this.y += vector[1];
				} else {
					// 壁にくっつかせる
					var blockWidth = this.world.blockWidth;
					var blockHeight = this.world.blockHeight;
					var margin = 0.01;
					if (vector[0] < 0) {
						this.x = Math.floor(this.x / blockWidth) * blockWidth + margin;
					} else if (vector[0] > 0) {
						this.x =	(Math.floor(this.x / blockWidth)+1) *
							blockWidth - this.width - margin;
					}
					if (vector[1] < 0) {
						this.y = Math.floor(this.y / blockHeight) * blockHeight + margin;
					} else if (vector[1] > 0) {
						this.y = (Math.floor(this.y / blockHeight)+1) *
							blockHeight - this.height - margin;
					}
				}
			}
		};
	},
	canMove: function(move) {
		var blocks = this.world.getBlocks(this.x + move[0], 
			this.y + move[1], this.width, this.height),
			canMove = true,
			self = this;
		blocks.forEach(function(block, i) {
			if (block.blockable) {
				canMove = false;
			}
			block.onBlock(self);
			self.onBlock(block);
		});
		return canMove;
	},
	onBlock: function(block) {}
};

module.exports = {
	world: World,
	block: Block,
	player: Player
};
