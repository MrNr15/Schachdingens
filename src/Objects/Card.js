
//Erstmal nur abstrakt ohne Bild oder Position, um die logik zu machen
export default class Card extends Phaser.GameObjects.Sprite {

    scene;
    cards;

    spriteOffset = [50, 75];

    //Zeigt bewegmuster
    //Man kann sich zu jeder 1 hinbewegen
    //Spieler steht un der Mitte (movement[2][2])
    movement = [
        [1,0,0,0,1],
        [0,1,0,1,0],
        [0,0,0,0,0],
        [0,1,0,1,0],
        [1,0,0,0,1],
    ]

    constructor(_scene, cards){
        super(_scene)
        this.scene = _scene
        this.cards = cards;
        this.setTexture('card')
        this.y = this.scene.HEIGHT - this.spriteOffset[1]//Unterer Bildschirmrand
        this.scene = _scene
        this.scene.add.existing(this)

        this.setInteractive()
        this.on('pointerdown', function (pointer) {
            this.scene.setCurrentCard(this)
        });
    }

    update(time, delta){
        //karten werden gleichmäßig abhängig von der Position in der Liste vertelit
        if (this.cards.indexOf(this) != -1){
            this.x = this.scene.WIDTH * ((this.cards.indexOf(this)+1) / (this.cards.length+1))
        }
    }

    //Macht auf dem Layer alle Tiles sichtbar, welche die karte erlaubt
    //Man kann sich nur dahin bewegen wenn die preview auch sichtbar ist
    showMoves(layer, canGolayer, player){
        var playerPos = player.getWorldPos()
        for(var x = 0; x < 5; x++){
            for(var y = 0; y < 5; y++){
                if(this.movement[y][x] == 0) continue;
                var checkingPos = [playerPos.x + x-2, playerPos.y + y-2]

                //If there is no Tile we cant move there
                if(layer.getTileAt(checkingPos[0], checkingPos[1]) == null) continue;

                canGolayer.getTileAt(checkingPos[0], checkingPos[1]).visible = true
            }
        }
    }
}