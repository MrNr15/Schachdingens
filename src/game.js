import piece from './Objects/Piece.js'
import card from './Objects/Card.js'

export default class Game extends Phaser.Scene {
    
    //Hier werden Dateien geladen
    preload (){
        this.load.image('tile', 'Assets/tile.png')
        this.load.image('piece', 'Assets/Piece.png')
        this.load.image('card', 'Assets/card.png')
        this.load.image('canGoImage', 'Assets/CanGo.png')
        this.load.tilemapTiledJSON('map', 'TileMapExports/map.json')
    }

    //globale variablen
    layer;
    canGoLayer;
    cards = [];
    currentCard = null;
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

        //ein eigener Layer für die MovementPrewiev
        const tileSet2 = map.addTilesetImage('canGo', 'canGoImage')
        this.canGoLayer = map.createLayer('CanGo', tileSet2, 0, 0)
        //die sind standartmäßig alle sichtbar also erstmal alle unsichtbar machen
        this.resetMovePossiblilitys()

        
        //Map wird auf dem Bildschirm gecentered (Diesmal funktionierts auch)
        this.layer.x = -this.TILE_WIDTH/2 + this.WIDTH/2;
        this.layer.y = this.HEIGHT/2 - this.MAP_HEIGTH*this.TILE_HEIGHT/2;
        this.canGoLayer.x = -this.TILE_WIDTH/2 + this.WIDTH/2;
        this.canGoLayer.y = this.HEIGHT/2 - this.MAP_HEIGTH*this.TILE_HEIGHT/2;
        
        //Player wird erstellt
        this.player = new piece(this, 5, 4)
        
        this.cards.push(new card(this, this.cards))
        this.cards.push(new card(this, this.cards))
        this.cards.push(new card(this, this.cards))

        //damit die Movement Möglichkeiten gezeigt werden
        this.playerMoved()
    }

    update(time, delta){
        for(var i = 0; i < this.cards.length; i++){
            this.cards[i].update(time, delta);
        }
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

        //Muss abgerundet werden
        pos.x = Math.floor(pos.x)
        pos.y = Math.floor(pos.y)
        return pos

    }

    canIMoveThere(pos){
        const tile = this.canGoLayer.getTileAt(pos.x, pos.y)
        return tile != undefined && tile.visible
    }

    playerMoved(){
        this.currentCard = null;
        this.updateMovement();
    }

    updateMovement(){
        this.resetMovePossiblilitys()
        if(this.currentCard == null) return;
        this.currentCard.showMoves(this.layer, this.canGoLayer, this.player)
    }

    setCurrentCard(newCard){
        this.currentCard = newCard;
        this.updateMovement();
    }
}