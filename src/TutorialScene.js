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

    constructor() {
        super({ key: 'TutorialScene' });
    }

    // Hier werden Dateien geladen
    preload() {
        // Map zeug
        this.load.image('map1', 'Assets/World/Level1.png')
        this.load.image('map2', 'Assets/World/Level2.png')
        this.load.image('map3', 'Assets/World/Level3.png')
        this.load.image('canGoImage', 'Assets/World/CanGo.png')
        this.load.image('cloud', 'Assets/World/cloud1.png')
        this.load.image('cloud2', 'Assets/World/cloud2.png')
        this.load.image('cloud3', 'Assets/World/cloud3.png')

        // Buttons
        this.load.image('levelBanner', 'Assets/Buttons/Level2.png')
        this.load.image('Leben0', 'Assets/Buttons/Leben0.png')
        this.load.image('Leben1', 'Assets/Buttons/Leben1.png')
        this.load.image('Leben2', 'Assets/Buttons/Leben2.png')
        this.load.image('Leben3', 'Assets/Buttons/Leben3.png')
        this.load.image('EndTurn0', 'Assets/Buttons/EndTurn0.png')
        this.load.image('EndTurn1', 'Assets/Buttons/EndTurn1.png')
        this.load.image('EndTurn2', 'Assets/Buttons/EndTurn2.png')
        this.load.image('EndTurn3', 'Assets/Buttons/EndTurn3.png')
        this.load.image('EndTurn4', 'Assets/Buttons/EndTurn0.png')
        this.load.image('NextLevel', 'Assets/Buttons/NextLevel.png')

        // Spielkarten
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

        // Map tiles
        this.load.tilemapTiledJSON('tileMap1', 'TileMapExports/map.json')
        this.load.tilemapTiledJSON('tileMap2', 'TileMapExports/map2.json')
        this.load.tilemapTiledJSON('tileMap3', 'TileMapExports/map3.json')

        // Audio
        this.load.audio('backgroundmusic', 'Assets/Sounds/background.mp3')
        this.load.audio('drawCard', 'Assets/Sounds/drawCard.mp3')
        this.load.audio('move', 'Assets/Sounds/Bewegung.mp3')
        this.load.audio('buttonSound', 'Assets/Sounds/Button.mp3')
        this.load.audio('attackSound', 'Assets/Sounds/Attacke.mp3')
        this.load.audio('kauen', 'Assets/Sounds/kauen.mp3')

        this.load.image('player', 'Assets/Player/Spieler.png')
        this.load.spritesheet('playerAttack1', 'Assets/Player/playerAttack1.png', { frameWidth: 1920, frameHeight: 1080 });
        this.load.spritesheet('playerAttack2', 'Assets/Player/playerAttack2.png', { frameWidth: 1921, frameHeight: 1081 });
        this.load.spritesheet('playerAttack3', 'Assets/Player/playerAttack3.png', { frameWidth: 1921, frameHeight: 1081 });
        this.load.spritesheet('playerAttack4', 'Assets/Player/playerAttack4.png', { frameWidth: 1921, frameHeight: 1081 });
        this.load.spritesheet('playerSchaden', 'Assets/Player/playerDamage.png', { frameWidth: 1921, frameHeight: 1081 });
        this.load.spritesheet('playerTod', 'Assets/Player/PlayerTod.png', { frameWidth: 1921, frameHeight: 1081 });

        // Gegner
        this.load.spritesheet('enemy1Attack', 'Assets/Gegner/attacke1.png', { frameWidth: 1380, frameHeight: 966 });
        this.load.spritesheet('enemy2Attack', 'Assets/Gegner/attacke2.png', { frameWidth: 355, frameHeight: 471 });
        this.load.spritesheet('enemy3Attack', 'Assets/Gegner/attacke3.png', { frameWidth: 1380, frameHeight: 965 });

        // schaden
        this.load.spritesheet('enemy1Schaden', 'Assets/Gegner/schaden1.png', { frameWidth: 1380, frameHeight: 966 });
        this.load.spritesheet('enemy2Schaden', 'Assets/Gegner/schaden2.png', { frameWidth: 355, frameHeight: 359 });
        this.load.spritesheet('enemy3Schaden', 'Assets/Gegner/schaden3.png', { frameWidth: 1380, frameHeight: 965 });

        // death
        this.load.spritesheet('enemy1Tod', 'Assets/Gegner/tod1.png', { frameWidth: 1380, frameHeight: 965 });
        this.load.spritesheet('enemy2Tod', 'Assets/Gegner/tod2.png', { frameWidth: 355, frameHeight: 359 });
        this.load.spritesheet('enemy3Tod', 'Assets/Gegner/tod3.png', { frameWidth: 1380, frameHeight: 965 });
    }

    // speichert alle Positionen für ein bestimmtes Level
    level1 = {
        player: [5, 4],
        enemys: [[3, 3], [5, 5]],
        enemyTypes: [1, 1],
        map: 'map1',
        mapTileSize: [530, 305],
        mapPositionOffset: [-2, -4],
        tileMap: 'tileMap1'
    }

    level = 1 // aktuelles Level

    // globale Variablen
    canGoLayer;
    cards = [];
    currentCard = null;
    moves = 4;
    MAX_MOVES = 4;
    player;
    enemys = [];
    TILE_WIDTH = 64;
    TILE_HEIGHT = 37;
    MAP_WIDTH = 13;
    MAP_HEIGTH = 13;
    WIDTH = 1056;
    HEIGHT = 596;

    clouds = []

    // zeigt welche Figur sich dort befindet
    // null für keine Figur
    gameField = [...Array(this.MAP_HEIGTH)].map(e => Array(this.MAP_WIDTH).fill(null))

    // Konstruktor
    create() {
        this.setupTutorial();
        this.setupGameSize();
        this.configureLevel();
        this.setupBackgroundClouds();
        this.setupMap();
        this.setupButtons();
        this.setupFigures();
        this.drawCards(4);
        //this.setupResizeHandler();
    }

    setupTutorial() {
        const infoText = this.add.text(100, 100, 'Drücke T, um das Tutorial zu starten\nDrücke X, um den Text zu entfernen', { fontSize: '16px', fill: '#fff' });

        this.input.keyboard.on('keydown-T', () => {
            infoText.destroy(); // Entfernt die Textbox
            this.scene.start('TutorialScene'); // Startet die Tutorial-Szene
        });

        this.input.keyboard.on('keydown-X', () => {
            infoText.destroy(); // Entfernt die Textbox ohne das Tutorial zu starten
        });
    }

    setupGameSize() {
        this.scale.resize(window.innerWidth, window.innerHeight);
        this.WIDTH = this.sys.game.scale.gameSize.width;
        this.HEIGHT = this.sys.game.scale.gameSize.height;
    }

    configureLevel() {
        this.levelConfig;
        if (this.level == 1) {
            this.levelConfig = this.level1;
            this.registry.set('level1Config', this.levelConfig); // Speichern der Level-Konfiguration

            this.backgroundmusic(); // Backgroundmusik wird aufgerufen
        }
    }

    setupBackgroundClouds() {
        const NUMBER_OF_CLOUDS = 6; // Anzahl der Wolken
        for (let i = 0; i < NUMBER_OF_CLOUDS; i++) {
            const cloudSize = 0.5 + Math.random(); // Zufällige Größe zwischen 0.5 und 1.5
            this.clouds.push(new cloud(this, cloudSize));
            this.clouds.push(new cloud2(this, cloudSize));
            this.clouds.push(new cloud3(this, cloudSize));
        }
    }

    setupMap() {
        this.levelMap = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, this.levelConfig.map);
        this.levelMap.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        this.levelMap.scaleX = 1 / this.levelConfig.mapTileSize[0] * 64;
        this.levelMap.x = this.WIDTH / 2 + this.levelConfig.mapPositionOffset[0];
        this.levelMap.scaleY = 1 / this.levelConfig.mapTileSize[0] * 64;
        this.levelMap.y = this.HEIGHT / 2 + this.levelConfig.mapPositionOffset[1];

        const map = this.make.tilemap({ key: this.levelConfig.tileMap });

        const tileSet2 = map.addTilesetImage('CanGo', 'canGoImage');
        this.canGoLayer = map.createLayer('CanGo', tileSet2, 0, 0);
        this.canGoLayer.setDepth(1000000); // über den Spielern

        this.registry.set('mapData', { tileMap: this.level1.tileMap });

        this.resetMovePossiblilitys();

        this.canGoLayer.x = -this.TILE_WIDTH / 2 + this.WIDTH / 2;
        this.canGoLayer.y = this.HEIGHT / 2 - this.MAP_HEIGTH * this.TILE_HEIGHT / 2 - this.TILE_HEIGHT;
    }

    setupButtons() {
        this.banner = this.add.image(this.cameras.main.width / 2, 42, 'levelBanner');
        this.banner.setScale(0.5); // Optional: Skalierung anpassen

        this.endTurn = this.add.image(this.cameras.main.width - 100, this.cameras.main.height - 50, 'EndTurn4');
        this.endTurn.setInteractive();
        this.endTurn.setScale(0.5); // Optional: Skalierung anpassen
        this.endTurn.on('pointerdown', () => {
            this.endTurnPressed();
            this.buttonSound();
        });

        this.lives = this.add.image(150, 50, 'Leben3');
        this.lives.setScale(0.5); // Optional: Skalierung anpassen
    }

    setupFigures() {
        this.player = new player(this, this.levelConfig.player[0], this.levelConfig.player[1]);

        for (var i = 0; i < this.levelConfig.enemys.length; i++) {
            let e;
            let type = this.levelConfig.enemyTypes[i];
            switch (type) {
                case 1:
                    e = new Enemy1(this, this.levelConfig.enemys[i][0], this.levelConfig.enemys[i][1]);
                    break;
                case 2:
                    e = new Enemy2(this, this.levelConfig.enemys[i][0], this.levelConfig.enemys[i][1]);
                    break;
                case 3:
                    e = new Enemy3(this, this.levelConfig.enemys[i][0], this.levelConfig.enemys[i][1]);
                    break;
            }
            this.enemys.push(e);
        }

        console.log(this.enemys);
    }

    setupResizeHandler() {
        this.scale.on('resize', this.handleResize, this);
    }

    handleResize(gameSize) {
        this.WIDTH = gameSize._width;
        this.HEIGHT = gameSize._height;

        this.cameras.main.setViewport(0, 0, gameSize._width, gameSize._height);

        this.banner.setPosition(gameSize._width / 2, 42);
        this.banner.setScale(0.5);

        this.lives.setPosition(150, 50);
        this.lives.setScale(0.5);

        this.endTurn.setPosition(gameSize._width - 100, gameSize._height - 50);
        this.endTurn.setScale(0.5);

        if (this.nextLevel) {
            this.nextLevel.setPosition(gameSize._width - 100, 50);
            this.nextLevel.setScale(0.5);
        }

        this.repositionCards();
    }

    repositionCards() {
        if (!this.cards || this.cards.length === 0) return;

        const cardSpacing = 150;
        const startX = this.cameras.main._width / 2 - (this.cards.length - 1) * cardSpacing / 2;
        const yPosition = this.cameras.main._height - 100;

        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].setPosition(startX + i * cardSpacing, yPosition);
        }
    }

    levelFinished() {
        const nextLevel = this.add.image(this.cameras.main.width - 150, 50, 'NextLevel');
        nextLevel.setInteractive();
        nextLevel.on('pointerdown', () => {
            this.buttonSound();
            this.level += 1;
            this.enemys = [];
            this.cards = [];
            this.clouds = [];
            this.gameField = [...Array(this.MAP_HEIGTH)].map(e => Array(this.MAP_WIDTH).fill(null));
            this.currentCard = null;
            this.moves = 4;
            this.scene.restart();
        });
    }

    unselectCard() {
        this.resetMovePossiblilitys();
        this.currentCard = null;
    }

    drawCards(amount) {
      this.cardSound()
      setTimeout(() => {
        let newCard = new card(this, this.cards, parseInt(5));
        newCard.setPosition(this.WIDTH / 2, this.HEIGHT - 100); // Position in der Mitte unten
      }, 500); //ruft die Methode die eine neue Karte erzeugt später auf damit der Sound besser passt

    }

    backgroundmusic() {
        var music = this.sound.add('backgroundmusic');
        music.setVolume(0.15);
        music.play({ loop: true });
    }

    cardSound() {
        var drawCards = this.sound.add('drawCard');
        drawCards.setVolume(0.25);
        drawCards.play();
    }

    buttonSound() {
        var button = this.sound.add('buttonSound');
        button.setRate(1.4);
        button.setVolume(0.4);
        button.play();
    }

    endTurnPressed() {
        if (this.enemys.length > 0) this.enemys[0].move(0, this.enemys[0].attacks);
        this.unselectCard();
        this.moves = this.MAX_MOVES;
        if (this.player.lives <= 0) return;
        this.drawCards(2);
    }

    update(time, delta) {
        //console.log(-this.TILE_WIDTH / 2 + this.WIDTH / 2, this.HEIGHT / 2 - this.MAP_HEIGTH * this.TILE_HEIGHT / 2 - this.TILE_HEIGHT)

        if (this.enemys.length == 0 || true) this.levelFinished();

        this.endTurn.setTexture('EndTurn' + this.moves);
        if (this.player != undefined) {
            let playerLives = Math.max(this.player.lives, 0);
            this.lives.setTexture("Leben" + playerLives);
        }

        for (var i = 0; i < this.cards.length; i++) {
            this.cards[i].update(time, delta);
        }

        for (var i = 0; i < this.enemys.length; i++) {
            this.enemys[i].update(time, delta);
        }

        this.player.update(time, delta);

        for (var i = 0; i < this.clouds.length; i++) {
            this.clouds[i].update(time, delta);
        }
    }

    resetMovePossiblilitys() {
        for (var x = 0; x < this.MAP_WIDTH; x++) {
            for (var y = 0; y < this.MAP_WIDTH; y++) {
                if (this.canGoLayer.getTileAt(x, y) != null)
                    this.canGoLayer.getTileAt(x, y).visible = false
            }
        }
    }

    worldPosToScreenPos(x, y) {
        return this.canGoLayer.tileToWorldXY(x, y);
    }

    screenToWorldPos(x, y) {
        const pos = this.canGoLayer.worldToTileXY(x, y);
        pos.x = Math.floor(pos.x);
        pos.y = Math.floor(pos.y);
        return pos;
    }

    canIMoveThere(pos) {
        if (this.currentCard == null) return false;
        const tile = this.canGoLayer.getTileAt(pos.x, pos.y);
        return tile != undefined && tile.visible;
    }

    playerMoved() {
        this.moves -= this.currentCard.cost;

        const index = this.cards.indexOf(this.currentCard);
        if (index > -1) {
            this.cards.splice(index, 1);
        }
        this.currentCard.delete();
        this.currentCard = null;
        this.updateMovement();
    }

    updateMovement() {
        this.resetMovePossiblilitys();
        if (this.currentCard == null) return;
        this.currentCard.showMoves(this.canGoLayer, this.player);
        this.buttonSound();
    }

    setCurrentCard(newCard) {
        if (newCard.cost <= this.moves) {
            this.currentCard = newCard;
            this.updateMovement();
        }
    }

    gameLost() {
        this.endTurn.visible = false;
        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].delete();
        }
        this.cards = [];

        const gameOver = this.add.text(this.WIDTH / 2, this.HEIGHT / 2, 'Game over', { fill: '#000' });
        const playAgain = this.add.text(this.WIDTH / 2, this.HEIGHT / 2 + 100, 'Play again', { fill: '#000' });
        playAgain.setInteractive();
        playAgain.on('pointerdown', () => {
            this.enemys = [];
            this.cards = [];
            this.clouds = [];
            this.gameField = [...Array(this.MAP_HEIGTH)].map(e => Array(this.MAP_WIDTH).fill(null));
            this.currentCard = null;
            this.moves = 4;
            this.scene.restart();
        });
    }
}
