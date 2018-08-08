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
    // this.load.image("tiles", "../assets/tilesGTA.jpg");
    // this.load.tilemapTiledJSON("map", "../assets/tilesGTA2.json");
    this.load.atlas("atlas", "../assets/atlas/atlas.png", "../assets/atlas/atlas.json");
}

function create() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");
    // const tileset = map.addTilesetImage("tilesGTA", "tiles");
    const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
    const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
    const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);
    player = this.physics.add.sprite(400, 350, "atlas", "misa-front")
        .setSize(30, 40)
        .setOffset(0, 24);

    worldLayer.setCollisionBetween(12, 44);
    worldLayer.setCollisionByProperty({ collides: true });
    aboveLayer.setDepth(10);
    cursors = this.input.keyboard.createCursorKeys();

    const camera = this.cameras.main;
    camera.startFollow(player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.add.collider(player, worldLayer);

    const anims = this.anims;
    anims.create({
        key: "misa-left-walk",
        frames: anims.generateFrameNames("atlas", { prefix: "misa-left-walk.", start: 0, end: 3, zeroPad: 3 }),
        frameRate: 10,
        repeat: -1
    });
    anims.create({
        key: "misa-right-walk",
        frames: anims.generateFrameNames("atlas", { prefix: "misa-right-walk.", start: 0, end: 3, zeroPad: 3 }),
        frameRate: 10,
        repeat: -1
    });
    anims.create({
        key: "misa-front-walk",
        frames: anims.generateFrameNames("atlas", { prefix: "misa-front-walk.", start: 0, end: 3, zeroPad: 3 }),
        frameRate: 10,
        repeat: -1
    });
    anims.create({
        key: "misa-back-walk",
        frames: anims.generateFrameNames("atlas", { prefix: "misa-back-walk.", start: 0, end: 3, zeroPad: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.add
        .text(16, 16, 'Arrow keys to move\nPress "D" to show hitboxes', {
            font: "18px monospace",
            fill: "#000000",
            padding: { x: 20, y: 10 },
            backgroundColor: "#ffffff"
        })
        .setScrollFactor(0)
        .setDepth(30);
}

function update(time, delta) {
    const speed = 175;
    const prevVelocity = player.body.velocity.clone();

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

    if (cursors.left.isDown) {
        player.anims.play("misa-left-walk", true);
    } else if (cursors.right.isDown) {
        player.anims.play("misa-right-walk", true);
    } else if (cursors.up.isDown) {
        player.anims.play("misa-back-walk", true);
    } else if (cursors.down.isDown) {
        player.anims.play("misa-front-walk", true);
    } else {
        player.anims.stop();

        // If we were moving, pick and idle frame to use
        if (prevVelocity.x < 0) player.setTexture("atlas", "misa-left");
        else if (prevVelocity.x > 0) player.setTexture("atlas", "misa-right");
        else if (prevVelocity.y < 0) player.setTexture("atlas", "misa-back");
        else if (prevVelocity.y > 0) player.setTexture("atlas", "misa-front");
    }
}