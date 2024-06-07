import player from './Objects/Player.js'
import card from './Objects/Card.js'
import enemy from './Objects/Enemy.js'

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
    moves = 4
    MAX_MOVES = 4
    movesLeft;
    player;
    enemys = [];
    TILE_WIDTH = 32
    TILE_HEIGHT = 16;
    MAP_WIDTH = 10
    MAP_HEIGTH = 10
    WIDTH = 600
    HEIGHT = 400

    //zeigt welche figur sich dort befindet
    //null für keine figur
    gameField = [...Array(this.MAP_HEIGTH)].map(e => Array(this.MAP_WIDTH).fill(null))

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

        
        //Map wird auf dem Bildschirm gecentered
        this.layer.x = -this.TILE_WIDTH/2 + this.WIDTH/2;
        this.canGoLayer.x = -this.TILE_WIDTH/2 + this.WIDTH/2;
        this.layer.y = this.HEIGHT/2 - this.MAP_HEIGTH*this.TILE_HEIGHT/2;
        this.canGoLayer.y = this.HEIGHT/2 - this.MAP_HEIGTH*this.TILE_HEIGHT/2;
        
        //Player wird erstellt
        this.player = new player(this, 5, 4)

        //enemy wird erstellt
        this.enemys.push(new enemy(this, 3,3))
        this.enemys.push(new enemy(this, 5,5))
        
        //karten werden erstllt
        this.cards.push(new card(this, this.cards))
        this.cards.push(new card(this, this.cards))
        this.cards.push(new card(this, this.cards))

        //moves left text
        this.movesLeft = this.add.text(100,50, "4/4", {fill: '#0f0'})

        //buttons
        const drawCard = this.add.text(100, 100, 'Drawcard', { fill: '#0f0' });
        drawCard.setInteractive();
        drawCard.on('pointerdown', () => {
            this.cards.push(new card(this, this.cards))
        });

        const endTurn = this.add.text(100, 150, 'End Turn', { fill: '#0f0' });
        endTurn.setInteractive();
        endTurn.on('pointerdown', () => {
            this.endTurnPressed()
        });
    }

    endTurnPressed(){
        for(var i = 0; i < this.enemys.length; i++){
            this.enemys[i].move()
        }
        this.moves = this.MAX_MOVES
    }

    update(time, delta){
        this.movesLeft.setText(this.moves+"/"+this.MAX_MOVES);

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
        return this.layer.tileToWorldXY(x, y)
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

    //wird vom player aufgerufen
    playerMoved(){
        //reduce remaining moves
        this.moves -= this.currentCard.cost

        //remove card from game
        const index = this.cards.indexOf(this.currentCard);
        if (index > -1) { // only splice array when item is found
            this.cards.splice(index, 1); // 2nd parameter means remove one item only
        }
        this.currentCard.destroy()
        this.currentCard = null;
        this.updateMovement();
    }

    //Immer wenn sich die ausgewählte Karte ändert
    updateMovement(){
        this.resetMovePossiblilitys()
        if(this.currentCard == null) return;
        this.currentCard.showMoves(this.layer, this.canGoLayer, this.player)
    }

    //wird von den karten selbst aufgerufen
    setCurrentCard(newCard){
        if(newCard.cost <= this.moves){
            this.currentCard = newCard;
            this.updateMovement();
        }
    }
}