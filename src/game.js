import player from './Objects/Player.js'
import card from './Objects/Card.js'
import enemy from './Objects/Enemy.js'
import cloud from './Objects/Could.js'

export default class Game extends Phaser.Scene {
    
    //Hier werden Dateien geladen
    preload (){
        this.load.image('map', 'Assets/Level_1_map.png')
        this.load.image('map2', 'Assets/Level2.png')
        this.load.image('map3', 'Assets/Level3.png')
        this.load.image('tile', 'Assets/tile.png')
        this.load.image('piece', 'Assets/Piece.png')
        this.load.image('card', 'Assets/card.png')
        this.load.image('attackCard', 'Assets/attackCard.png')
        this.load.image('canGoImage', 'Assets/CanGo2.png')
        this.load.image('square', 'Assets/Card_Movement.png')
        this.load.image('enemy1', 'Assets/Figur1.1.png')
        this.load.image('player', 'Assets/Spieler.png')
        this.load.image('cloud', 'Assets/Cloud.png')
        this.load.tilemapTiledJSON('map', 'TileMapExports/map.json')
        this.load.audio('backgroundmusic', 'Assets/background.mp3')
        this.load.audio('drawCard', 'Assets/drawCard.mp3')
        this.load.audio('move', 'Assets/Bewegung.mp3')
        this.load.spritesheet('enemy1.2Attack', 'Assets/Gegner_1.2._Attacke.png', { frameWidth: 750, frameHeight: 1081 });
        this.load.spritesheet('enemy1Attack', 'Assets/attacke1.png', { frameWidth: 750, frameHeight: 1081 });
        this.load.spritesheet('enemy3Attack', 'Assets/attacke3.png', { frameWidth: 750, frameHeight: 1081 });
        this.load.spritesheet('enemy1.2Schaden', 'Assets/schaden1.2.png', { frameWidth: 750, frameHeight: 1081 });
        this.load.spritesheet('enemy1Schaden', 'Assets/schaden1.png', { frameWidth: 750, frameHeight: 1081 });
        this.load.spritesheet('enemy3Schaden', 'Assets/schaden3.png', { frameWidth: 750, frameHeight: 1081 });
        this.load.spritesheet('enemy1.2Tod', 'Assets/tod1.2.png', { frameWidth: 750, frameHeight: 1081 });
        this.load.spritesheet('enemy1Tod', 'Assets/tod1.png', { frameWidth: 750, frameHeight: 1081 });
        this.load.spritesheet('enemy3Tod', 'Assets/tod3.png', { frameWidth: 750, frameHeight: 1081 });
        this.load.spritesheet('playerAttack1', 'Assets/spielerAttacke1.png', { frameWidth: 750, frameHeight: 1081 });
        this.load.spritesheet('playerAttack2', 'Assets/spielerAttacke2.png', { frameWidth: 750, frameHeight: 1081 });
        this.load.spritesheet('playerAttack3', 'Assets/spielerAttacke3.png', { frameWidth: 750, frameHeight: 1081 });
        this.load.spritesheet('playerAttack4', 'Assets/spielerAttacke4.png', { frameWidth: 750, frameHeight: 1081 });
        this.load.spritesheet('playerSchaden', 'Assets/spielerSchaden.png', { frameWidth: 750, frameHeight: 1081 });
        this.load.spritesheet('playerTod', 'Assets/spielerTod.png', { frameWidth: 750, frameHeight: 1081 });
    }

    //speichert alle positionen für ein bestimmtes level
    level1 = {
        player: [5, 4],
        enemys: [[3,3], [5,5]]
    }

    level2 = {
        player: [5, 4],
        enemys: [[1,1], [8,8], [1,9]]
    }

    level = 1//aktuelles level
    
    //globale variablen
    canGoLayer;
    cards = [];
    currentCard = null;
    moves = 4
    MAX_MOVES = 4
    movesLeft;
    player;
    enemys = [];
    TILE_WIDTH = 64;
    TILE_HEIGHT = 37;
    MAP_WIDTH = 10
    MAP_HEIGTH = 10
    WIDTH = 1056
    HEIGHT = 596

    clouds = []

    //zeigt welche figur sich dort befindet
    //null für keine figur
    gameField = [...Array(this.MAP_HEIGTH)].map(e => Array(this.MAP_WIDTH).fill(null))

    //Konstruktor
    create (){

        var levelConfig;
        if(this.level == 1){
            levelConfig = this.level1

            //Backgroundmusik wird aufgerufen
            //bleibt beim neu laden bestehen also muss die nur beim ersten level gestartet werden
            this.backgroundmusic()
        }
        if(this.level == 2)
            levelConfig = this.level2


        //background
        for(var i = 0; i < 10; i++){
            this.clouds.push(new cloud(this))
        }

        //WORK IN PROGRESS
        var level = this.add.image(0, 0, 'map')
        level.scaleX = 0.5
        level.x = this.WIDTH/2;
        level.scaleY = 0.5
        level.y = this.HEIGHT/2;

        //TileMap wird aus Datei erstellt
        const map = this.make.tilemap({key: 'map'})

        //ein eigener Layer für die MovementPrewiev
        const tileSet2 = map.addTilesetImage('CanGo', 'canGoImage')
        this.canGoLayer = map.createLayer('CanGo', tileSet2, 0, 0)
        this.canGoLayer.setDepth(1000000)//über den spielern

        //die sind standartmäßig alle sichtbar also erstmal alle unsichtbar machen
        this.resetMovePossiblilitys()

        
        //Map wird auf dem Bildschirm gecentered
        this.canGoLayer.x = -this.TILE_WIDTH/2 + this.WIDTH/2;
        this.canGoLayer.y = this.HEIGHT/2 - this.MAP_HEIGTH*this.TILE_HEIGHT/2 - 40;

        //Player wird erstellt
        this.player = new player(this, levelConfig.player[0], levelConfig.player[1])

        //enemy wird erstellt
        for(var i = 0; i < levelConfig.enemys.length; i++){
            let e = new enemy(this, levelConfig.enemys[i][0],levelConfig.enemys[i][1])
            this.enemys.push(e)
        }
        
        //karten werden erstllt
        this.drawCards(4)

        //moves left text
        this.movesLeft = this.add.text(100,50, "4/4", {fill: '#000'})
        //lives text
        this.lives = this.add.text(100,25, "Lives: 3", {fill: '#000'})

        //endTurn button
        //TODO disable turn button while turn is being processed
        const endTurn = this.add.text(100, 150, 'End Turn', { fill: '#000' });
        endTurn.setInteractive();
        endTurn.on('pointerdown', () => {
            this.endTurnPressed()
        });

        const nextLevel = this.add.text(100, 200, 'Next Level', { fill: '#000' });
        nextLevel.setInteractive();
        nextLevel.on('pointerdown', () => {
            this.level += 1;
            this.enemys = []
            this.cards = []
            this.clouds = []
            this.gameField = [...Array(this.MAP_HEIGTH)].map(e => Array(this.MAP_WIDTH).fill(null))
            this.currentCard = null;
            this.moves = 4
            this.scene.restart()
        });
    }

    unselectCard(){
        this.resetMovePossiblilitys()
        this.currentCard = null
    }

    drawCards(amount){
        if(amount <= 0) return

        this.cardSound()
        setTimeout(() => {
            this.cards.push(new card(this, this.cards, parseInt(Math.random()*4)+1));
        }, 500); //ruft die Methode die eine neue Karte erzeugt später auf damit der Sound besser passt

        setTimeout(() => {
            this.drawCards(amount-1)
        }, 100);
    }

    //lässt in Dauerschleife Backgroundmusik laufen
    backgroundmusic(){
        var music = this.sound.add('backgroundmusic')
        music.setVolume(0.15)
        music.play({loop: true})
    }    

    //Sound vom Kartenziehen
    cardSound(){
        var drawCards = this.sound.add('drawCard')
        drawCards.setVolume(0.25)
        drawCards.play()
    }

    //lässt alle gegner bewegen und füllt die moves wieder auf
    endTurnPressed(){

        //die gegner rufen sich gegenseitig auf, darum muss man nur den ersten aufrufen
        //das machen wir so, damit die gegner aufeinander warten, bevor sie sic bewegen
        if(this.enemys.length > 0)
            this.enemys[0].move(0, this.enemys[0].attacks);

        this.unselectCard()
        this.moves = this.MAX_MOVES
        this.drawCards(2)
    }

    update(time, delta){

        //text wird geupdated
        this.movesLeft.setText(this.moves+"/"+this.MAX_MOVES);
        if(this.player != undefined)
            this.lives.setText("Lives: "+this.player.lives)

        //karten werden geupdated
        for(var i = 0; i < this.cards.length; i++){
            this.cards[i].update(time, delta);
        }

        for(var i = 0; i < this.enemys.length; i++){
            this.enemys[i].update(time, delta)
        }
        
        this.player.update(time, delta)

        for(var i = 0; i < this.clouds.length; i++){
            this.clouds[i].update(time, delta)
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
        return this.canGoLayer.tileToWorldXY(x, y)
    }

    //Nimmt eine Position in der Welt und gibt die Koordinaten des Tiles darunter
    screenToWorldPos(x, y){
        const pos = this.canGoLayer.worldToTileXY(x, y);
        //Muss abgerundet werden
        pos.x = Math.floor(pos.x)
        pos.y = Math.floor(pos.y)
        return pos
    }


    //wird vom spieler aufgerufen
    //guckt nur nach ob eine movepreview an dem Feld ist
    //wenn da keine ist kann er da auch nicht hin
    canIMoveThere(pos){
        if(this.currentCard == null) return false;
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
        this.currentCard.delete()
        this.currentCard = null;
        this.updateMovement();
    }

    //Immer wenn sich die ausgewählte Karte ändert
    updateMovement(){
        this.resetMovePossiblilitys()
        if(this.currentCard == null) return;
        this.currentCard.showMoves(this.canGoLayer, this.player)
    }

    //wird von den karten selbst aufgerufen
    setCurrentCard(newCard){
        if(newCard.cost <= this.moves){
            this.currentCard = newCard;
            this.updateMovement();
        }
    }
}