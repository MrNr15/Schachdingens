import piece from './Objects/Piece.js'

export default class Game extends Phaser.Scene {
    
    //Hier werden Dateien geladen
    preload (){
        this.load.image('tile', 'Assets/tile.png')
        this.load.image('piece', 'Assets/Piece.png')
        this.load.tilemapTiledJSON('map', 'TileMapExports/test.json')
    }

    //globale variablen
    layer;

    TILE_WIDTH = 32
    TILE_HEIGHT = 16;
    MAP_WIDTH = 16*this.TILE_WIDTH
    MAP_HEIGTH = 16*this.TILE_HEIGHT

    //Konstruktor
    create (){
        //TileMap wird aus Datei erstellt
        const map = this.make.tilemap({key: 'map'})
        const tileSet = map.addTilesetImage('Joa', 'tile')
        this.layer = map.createLayer('Layer', tileSet)

        //Kamera wird bewegt weil die TileMap aus irgendeinem Grund nicht standardmäßig
        //im Bild ist
        this.cameras.main.pan(this.MAP_WIDTH/2-300, this.MAP_HEIGTH/2, 1);

        //Player wird erstellt
        var pos = this.worldPosToScreenPos(5, 4)
        this.player = new piece(this, 5, 4)
}

    update (time, delta) {
    }

    //Nimmt eine Position auf dem Grid und gibt aus wo sich das Tile in der Welt befindet
    worldPosToScreenPos(x, y){
        const foundTile = this.layer.getTileAt(x, y)
        if(foundTile != null && foundTile != undefined){
            return [foundTile.pixelX, foundTile.pixelY]
        }
    }
    //Nimmt eine Position in der Welt und gibt die Koordinaten des Tiles darunter
    screenToWorldPos(){
        const foundTile = this.layer.getTileAtWorldXY(
            this.game.input.mousePointer.worldX, 
            this.game.input.mousePointer.worldY+this.TILE_HEIGHT,
            false, this.cameras.main);
        if(foundTile != null && foundTile != undefined){
           return [foundTile.x, foundTile.y]
        }
    }
}