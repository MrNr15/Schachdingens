import piece from './Objects/Piece.js'
import card from './Objects/Card.js'

export default class Game extends Phaser.Scene {
    
    //Hier werden Dateien geladen
    preload (){
        this.load.image('tile', 'Assets/tile.png')
        this.load.image('piece', 'Assets/Piece.png')
        this.load.image('canGoImage', 'Assets/CanGo.png')
        this.load.tilemapTiledJSON('map', 'TileMapExports/map.json')
    }

    //globale variablen
    layer;
    canGoLayer;
    card;
    player;

    TILE_WIDTH = 32
    TILE_HEIGHT = 16;
    MAP_WIDTH = 10
    MAP_HEIGTH = 10
    WIDTH = 600
    HEIGHT = 400

    //Konstruktor
    create (){
        //TileMap wird aus Datei erstellt
        const map = this.make.tilemap({key: 'map'})
        const tileSet = map.addTilesetImage('MainTileSet', 'tile')
        this.layer = map.createLayer('Layer1', tileSet, 0, 0)
        const tileSet2 = map.addTilesetImage('canGo', 'canGoImage')
        this.canGoLayer = map.createLayer('CanGo', tileSet2, 0, 0)

        
        //Map wird auf dem Bildschirm gecentered (Diesmal funktionierts auch)
        this.cameras.main.pan(this.TILE_WIDTH/2, this.MAP_HEIGTH*this.TILE_HEIGHT/2, 1);
        
        //Player wird erstellt
        this.player = new piece(this, 5, 4)
        
        this.card = new card(this)
        
        this.playerMoved()
    }

    //Macht alle unsichtbar
    resetMovePossiblilitys(){
        for(var x = 0; x < this.MAP_WIDTH; x++){
            for(var y = 0; y < this.MAP_WIDTH; y++){
                if(this.canGoLayer.getTileAt(x, y) != null)
                this.canGoLayer.getTileAt(x, y).visible = false
            }
        }
    }

    //Nimmt eine Position auf dem Grid und gibt aus wo sich das Tile in der Welt befindet
    worldPosToScreenPos(x, y){
        const pos = this.layer.tileToWorldXY(x, y)
        return pos
    }
    //Nimmt eine Position in der Welt und gibt die Koordinaten des Tiles darunter
    screenToWorldPos(x, y){
        const pos = this.layer.worldToTileXY(x, y);
        pos.x = Math.floor(pos.x)
        pos.y = Math.floor(pos.y)
        console.log(pos)
        return pos

    }

    canIMoveThere(pos){
        return this.canGoLayer.getTileAt(pos.x, pos.y).visible
    }

    playerMoved(){
        this.resetMovePossiblilitys()
        this.card.showMoves(this.layer, this.canGoLayer, this.player)
    }
}