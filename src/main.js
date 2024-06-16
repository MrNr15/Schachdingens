import Game from './game.js'

const config = {
    type: Phaser.AUTO,
    width: 1056,
    height: 594,
    scene: Game,
    backgroundColor: '#7ad6f5',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }
};

const game = new Phaser.Game(config);