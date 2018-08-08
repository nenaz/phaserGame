import Phaser from 'phaser';

const config = {
    type: Phaser.AUTO, // Which renderer to use
    width: 800, // Canvas width in pixels
    height: 600, // Canvas height in pixels
    parent: "game-container", // ID of the DOM element to add the canvas to
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }
};

const game = new Phaser.Game(config);
let player;
let cursors;

function preload() {
    this.load.image("tiles", "../assets/tuxmon-sample-32px-extruded.png");
    this.load.tilemapTiledJSON("map", "../assets/tuxemon-town.json");
}

function create() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");
    const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
    const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
    const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);
    player = this.physics.add.sprite(400, 350, "atlas", "misa-front");

    worldLayer.setCollisionBetween(12, 44);
    worldLayer.setCollisionByProperty({ collides: true });
    aboveLayer.setDepth(10);
    cursors = this.input.keyboard.createCursorKeys();

    const camera = this.cameras.main;
    camera.startFollow(player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.add.collider(player, worldLayer);
}

function update(time, delta) {
    const speed = 175;
    player.body.setVelocity(0);

    if (cursors.left.isDown) {
        player.body.setVelocityX(-100);
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(100);
    }

    if (cursors.up.isDown) {
        player.body.setVelocityY(-100);
    } else if (cursors.down.isDown) {
        player.body.setVelocityY(100);
    }

    player.body.velocity.normalize().scale(speed);
}