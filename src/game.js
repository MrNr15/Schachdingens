import player from './Objects/Player.js'
import card from './Objects/Card.js'
import enemy from './Objects/Enemy.js'
import cloud from './Objects/Could.js'
import cloud2 from './Objects/Cloud2.js'
import cloud3 from './Objects/Cloud3.js'
import Enemy1 from './Objects/Enemy1.js'
import Enemy2 from './Objects/Enemy2.js'
import Enemy3 from './Objects/Enemy3.js'

export default class Game extends Phaser.Scene {

    //Hier werden Dateien geladen
    preload() {
        this.load.image('map1', 'Assets/World/Level1.png')
        this.load.image('map2', 'Assets/World/Level2.png')
        this.load.image('map3', 'Assets/World/Level3.png')
        this.load.image('canGoImage', 'Assets/World/CanGo2.png')
        this.load.image('cloud', 'Assets/World/cloud1.png')
        this.load.image('cloud2', 'Assets/World/cloud2.png')
        this.load.image('cloud3', 'Assets/World/cloud3.png')

        this.load.image('card', 'Assets/Karten/card.png')
        this.load.image('attackCard', 'Assets/Karten/attackCard.png')
        this.load.image('square', 'Assets/Karten/Card_Movement.png')

        this.load.image('attackCard0', 'Assets/Karten/DamageCard0.png')
        this.load.image('attackCard1', 'Assets/Karten/DamageCard1.png')
        this.load.image('attackCard2', 'Assets/Karten/DamageCard2.png')
        this.load.image('attackCard3', 'Assets/Karten/DamageCard3.png')

        this.load.image('moveCard0', 'Assets/Karten/moveCard0.png')
        this.load.image('moveCard1', 'Assets/Karten/moveCard1.png')
        this.load.image('moveCard2', 'Assets/Karten/moveCard2.png')
        this.load.image('moveCard3', 'Assets/Karten/moveCard3.png')


        this.load.image('player', 'Assets/Player/Spieler.png')
        this.load.spritesheet('playerAttack1', 'Assets/Player/playerAttacke1.png', { frameWidth: 346, frameHeight: 293 });
        this.load.spritesheet('playerAttack2', 'Assets/Player/playerAttacke2.png', { frameWidth: 346, frameHeight: 293 });
        this.load.spritesheet('playerAttack3', 'Assets/Player/playerAttacke3.png', { frameWidth: 346, frameHeight: 293 });
        this.load.spritesheet('playerAttack4', 'Assets/Player/playerAttacke4.png', { frameWidth: 346, frameHeight: 293 });
        this.load.spritesheet('playerSchaden', 'Assets/Player/playerDamage.png', { frameWidth: 346, frameHeight: 293 });
        this.load.spritesheet('playerTod', 'Assets/Player/PlayerTod.png', { frameWidth: 346, frameHeight: 293 });

        this.load.tilemapTiledJSON('tileMap1', 'TileMapExports/map.json')
        this.load.tilemapTiledJSON('tileMap2', 'TileMapExports/map2.json')
        this.load.tilemapTiledJSON('tileMap3', 'TileMapExports/map3.json')

        this.load.audio('backgroundmusic', 'Assets/Sounds/background.mp3')
        this.load.audio('drawCard', 'Assets/Sounds/drawCard.mp3')
        this.load.audio('move', 'Assets/Sounds/Bewegung.mp3')

        this.load.image('enemy1', 'Assets/Gegner/Figur1.1.png')
        this.load.spritesheet('enemy1.2Attack', 'Assets/Gegner/attacke1.2.png', { frameWidth: 346, frameHeight: 293 });
        this.load.spritesheet('enemy1Attack', 'Assets/Gegner/attacke1.png', { frameWidth: 346, frameHeight: 293 });
        this.load.spritesheet('enemy3Attack', 'Assets/Gegner/attacke3.png', { frameWidth: 346, frameHeight: 293 });
        this.load.spritesheet('enemy1.2Schaden', 'Assets/Gegner/schaden1.2.png', { frameWidth: 346, frameHeight: 293 });
        this.load.spritesheet('enemy1Schaden', 'Assets/Gegner/schaden1.png', { frameWidth: 346, frameHeight: 293 });
        this.load.spritesheet('enemy3Schaden', 'Assets/Gegner/schaden3.png', { frameWidth: 346, frameHeight: 293 });
        this.load.spritesheet('enemy1.2Tod', 'Assets/Gegner/tod1.2.png', { frameWidth: 346, frameHeight: 293 });
        this.load.spritesheet('enemy1Tod', 'Assets/Gegner/tod1.png', { frameWidth: 346, frameHeight: 293 });
        this.load.spritesheet('enemy3Tod', 'Assets/Gegner/tod3.png', { frameWidth: 346, frameHeight: 293 });
        this.load.spritesheet('enemy2Attack', 'Assets/Gegner/Gegner2_a.png', { frameWidth: 346, frameHeight: 293 });
        
    }

    //speichert alle positionen für ein bestimmtes level
    level1 = {
        player: [5, 4],
        enemys: [[3, 3], [5, 5]],
        map: 'map1',
        mapTileSize: [530, 305],
        mapPositionOffset: [-2, -4],
        tileMap: 'tileMap1'
    }

    level2 = {
        player: [5, 4],
        enemys: [[1, 1], [8, 8], [1, 9]],
        map: 'map2',
        mapTileSize: [63, 36],
        mapPositionOffset: [-65, -18],
        tileMap: 'tileMap2'
    }

    level3 = {
        player: [5, 4],
        enemys: [[1, 1], [8, 8], [2, 9]],
        map: 'map3',
        mapTileSize: [63, 36],
        mapPositionOffset: [-33, -19],
        tileMap: 'tileMap3'
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
    MAP_WIDTH = 13
    MAP_HEIGTH = 13
    WIDTH = 1056
    HEIGHT = 596

    clouds = []

    //zeigt welche figur sich dort befindet
    //null für keine figur
    gameField = [...Array(this.MAP_HEIGTH)].map(e => Array(this.MAP_WIDTH).fill(null))

    //Konstruktor
    create() {

        var levelConfig;
        if (this.level == 1) {
            levelConfig = this.level1

            //Backgroundmusik wird aufgerufen
            //bleibt beim neu laden bestehen also muss die nur beim ersten level gestartet werden
            this.backgroundmusic()
        }
        if (this.level == 2)
            levelConfig = this.level2
        this.backgroundmusic()

        if (this.level == 3)
            levelConfig = this.level3
        this.backgroundmusic()


        //background
        //for(var i = 0; i < 10; i++){
        //    this.clouds.push(new cloud(this))
        //}
        const NUMBER_OF_CLOUDS = 6; // Anzahl der Wolken
        for (let i = 0; i < NUMBER_OF_CLOUDS; i++) {
            const cloudSize = 0.5 + Math.random(); // Zufällige Größe zwischen 0.5 und 1.5
            this.clouds.push(new cloud(this, cloudSize));
            this.clouds.push(new cloud2(this, cloudSize));
            this.clouds.push(new cloud3(this, cloudSize));



        }



        var level = this.add.image(0, 0, levelConfig.map)
        level.scaleX = 1 / levelConfig.mapTileSize[0] * 64
        level.x = this.WIDTH / 2 + levelConfig.mapPositionOffset[0];
        level.scaleY = 1 / levelConfig.mapTileSize[0] * 64
        level.y = this.HEIGHT / 2 + levelConfig.mapPositionOffset[1];

        //TileMap wird aus Datei erstellt
        const map = this.make.tilemap({ key: levelConfig.tileMap })

        //ein eigener Layer für die MovementPrewiev
        const tileSet2 = map.addTilesetImage('CanGo', 'canGoImage')
        this.canGoLayer = map.createLayer('CanGo', tileSet2, 0, 0)
        this.canGoLayer.setDepth(1000000)//über den spielern

        //die sind standartmäßig alle sichtbar also erstmal alle unsichtbar machen
        this.resetMovePossiblilitys()


        //Map wird auf dem Bildschirm gecentered
        this.canGoLayer.x = -this.TILE_WIDTH / 2 + this.WIDTH / 2;
        this.canGoLayer.y = this.HEIGHT / 2 - this.MAP_HEIGTH * this.TILE_HEIGHT / 2 - this.TILE_HEIGHT;

        //Player wird erstellt
        this.player = new player(this, levelConfig.player[0], levelConfig.player[1]);

        if (levelConfig === this.level1) {
            for (var i = 0; i < levelConfig.enemys.length; i++) {
                let e;
                let v = Math.floor(Math.random() * 3);
                switch (v) {
                    case 0:
                        e = new Enemy1(this, levelConfig.enemys[i][0], levelConfig.enemys[i][1]);
                        break;
                    case 1:
                        e = new Enemy1(this, levelConfig.enemys[i][0], levelConfig.enemys[i][1]);
                        break;
                    case 2:
                        e = new Enemy1(this, levelConfig.enemys[i][0], levelConfig.enemys[i][1]);
                        break;

                }
                this.enemys.push(e);
            }

        } else if(levelConfig === this.level2){
            for (var i = 0; i < levelConfig.enemys.length; i++) {
                let e;
                let v = Math.floor(Math.random() * 3);
                switch (v) {
                    case 0:
                        e = new Enemy1(this, levelConfig.enemys[i][0], levelConfig.enemys[i][1]);
                        break;
                    case 1:
                        e = new Enemy2(this, levelConfig.enemys[i][0], levelConfig.enemys[i][1]);
                        break;
                    case 2:
                        e = new Enemy2(this, levelConfig.enemys[i][0], levelConfig.enemys[i][1]);
                        break;
                }
                this.enemys.push(e);
            }
        } else if (levelConfig === this.level3){
            for (var i = 0; i < levelConfig.enemys.length; i++) {
                let e;
                let v = Math.floor(Math.random() * 3);
                switch (v) {
                    case 0:
                        e = new Enemy1(this, levelConfig.enemys[i][0], levelConfig.enemys[i][1]);
                        break;
                    case 1:
                        e = new Enemy2(this, levelConfig.enemys[i][0], levelConfig.enemys[i][1]);
                        break;
                    case 2:
                        e = new Enemy3(this, levelConfig.enemys[i][0], levelConfig.enemys[i][1]);
                        break;
                }
                this.enemys.push(e);
            }
           
        }

        console.log(this.enemys);
        // macht gegner
        /*for (var i = 0; i < levelConfig.enemys.length; i++) {
            let e;
            let v = Math.floor(Math.random() * 3);
            switch (v) {
                case 0:
                    e = new Enemy1(this, levelConfig.enemys[i][0], levelConfig.enemys[i][1]);
                    break;
                case 1:
                    e = new Enemy3(this, levelConfig.enemys[i][0], levelConfig.enemys[i][1]);
                    break;
            }
            this.enemys.push(e);
        }
        */


        //karten werden erstllt
        this.drawCards(4)

        //moves left text
        this.movesLeft = this.add.text(100, 50, "4/4", { fill: '#000' })
        //lives text
        this.lives = this.add.text(100, 25, "Lives: 3", { fill: '#000' })

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

    unselectCard() {
        this.resetMovePossiblilitys()
        this.currentCard = null
    }

    drawCards(amount) {
        if (amount <= 0) return

        this.cardSound()
        setTimeout(() => {
            this.cards.push(new card(this, this.cards, parseInt(Math.random() * 4) + 1));
        }, 500); //ruft die Methode die eine neue Karte erzeugt später auf damit der Sound besser passt

        setTimeout(() => {
            this.drawCards(amount - 1)
        }, 100);
    }

    //lässt in Dauerschleife Backgroundmusik laufen
    backgroundmusic() {
        var music = this.sound.add('backgroundmusic')
        music.setVolume(0.15)
        music.play({ loop: true })
    }

    //Sound vom Kartenziehen
    cardSound() {
        var drawCards = this.sound.add('drawCard')
        drawCards.setVolume(0.25)
        drawCards.play()
    }

    //lässt alle gegner bewegen und füllt die moves wieder auf
    endTurnPressed() {

        //die gegner rufen sich gegenseitig auf, darum muss man nur den ersten aufrufen
        //das machen wir so, damit die gegner aufeinander warten, bevor sie sic bewegen
        if (this.enemys.length > 0)
            this.enemys[0].move(0, this.enemys[0].attacks);

        this.unselectCard()
        this.moves = this.MAX_MOVES
        this.drawCards(2)
    }

    update(time, delta) {

        //text wird geupdated
        this.movesLeft.setText(this.moves + "/" + this.MAX_MOVES);
        if (this.player != undefined)
            this.lives.setText("Lives: " + this.player.lives)

        //karten werden geupdated
        for (var i = 0; i < this.cards.length; i++) {
            this.cards[i].update(time, delta);
        }

        for (var i = 0; i < this.enemys.length; i++) {
            this.enemys[i].update(time, delta)
        }

        this.player.update(time, delta)

        for (var i = 0; i < this.clouds.length; i++) {
            this.clouds[i].update(time, delta)
        }
    }

    //Macht alle unsichtbar
    resetMovePossiblilitys() {
        for (var x = 0; x < this.MAP_WIDTH; x++) {
            for (var y = 0; y < this.MAP_WIDTH; y++) {
                if (this.canGoLayer.getTileAt(x, y) != null)
                    this.canGoLayer.getTileAt(x, y).visible = false
            }
        }
    }

    //Nimmt eine Position auf dem Grid und gibt aus wo sich das Tile in der Welt befindet
    worldPosToScreenPos(x, y) {
        return this.canGoLayer.tileToWorldXY(x, y)
    }

    //Nimmt eine Position in der Welt und gibt die Koordinaten des Tiles darunter
    screenToWorldPos(x, y) {
        const pos = this.canGoLayer.worldToTileXY(x, y);
        //Muss abgerundet werden
        pos.x = Math.floor(pos.x)
        pos.y = Math.floor(pos.y)
        return pos
    }


    //wird vom spieler aufgerufen
    //guckt nur nach ob eine movepreview an dem Feld ist
    //wenn da keine ist kann er da auch nicht hin
    canIMoveThere(pos) {
        if (this.currentCard == null) return false;
        const tile = this.canGoLayer.getTileAt(pos.x, pos.y)
        return tile != undefined && tile.visible
    }

    //wird vom player aufgerufen
    playerMoved() {
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
    updateMovement() {
        this.resetMovePossiblilitys()
        if (this.currentCard == null) return;
        this.currentCard.showMoves(this.canGoLayer, this.player)
    }

    //wird von den karten selbst aufgerufen
    setCurrentCard(newCard) {
        if (newCard.cost <= this.moves) {
            this.currentCard = newCard;
            this.updateMovement();
        }
    }
}