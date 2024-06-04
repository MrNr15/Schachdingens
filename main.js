class Example extends Phaser.Scene {
    preload (){
        this.load.image('tile', 'tile.png')
        this.load.tilemapTiledJSON('map', 'test.json')
    }

    layer;
    cursorTile;

    TILE_WIDTH = 32
    TILE_HEIGHT = 16;
    MAP_WIDTH = 16*this.TILE_WIDTH
    MAP_HEIGTH = 16*this.TILE_HEIGHT

    create (){
        const map = this.make.tilemap({key: 'map'})
        const tileSet = map.addTilesetImage('Joa', 'tile')
        this.layer = map.createLayer('Layer', tileSet)

        //doesnt work but its better than nothing
        this.cameras.main.pan(this.MAP_WIDTH/2-300, this.MAP_HEIGTH/2, 1);
}

    update (time, delta) {
    if (this.cursorTile !== null && this.cursorTile !== undefined) {
        this.cursorTile.setVisible(true);
    }

    this.game.input.mousePointer.updateWorldPoint(this.cameras.main);
    const foundTile = this.layer.getTileAtWorldXY(
        this.game.input.mousePointer.worldX, 
        this.game.input.mousePointer.worldY+this.TILE_HEIGHT,
        false, this.cameras.main);


    if (foundTile != null) {
        this.cursorTile = foundTile;
    }
    if (this.cursorTile !== null && this.cursorTile !== undefined) {
        this.cursorTile.setVisible(false);
    }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 400,
    scene: Example,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }
};

const game = new Phaser.Game(config);