import cardMovement from './CardMovement.js'
import movementGenerator from './MovementGenerator.js';
//Erstmal nur abstrakt ohne Bild oder Position, um die logik zu machen
export default class Card extends Phaser.GameObjects.Sprite {

    scene;
    cards;

    spriteOffset = [390/390 * 150 / 2,  90];

    cost = 1;

    //0 = movement
    //1 = attack
    type;

    //Zeigt bewegmuster
    //Man kann sich zu jeder 1 hinbewegen
    //Spieler steht un der Mitte (movement[2][2])
    movement = []//wird vom MovementGenerator erstellt

    movementSprite;

    constructor(_scene, cards, cost){
        super(_scene)

        var moveGenerator = new movementGenerator()
        this.cost = cost
        this.movement = moveGenerator.getMovement(cost)

        
        this.type = parseInt(Math.random()*2)
        this.scene = _scene
        this.cards = cards;
        if (this.type==0){
            if(cost == 0)
                this.setTexture('moveCard0')
            if(cost == 1)
                this.setTexture('moveCard1')
            if(cost == 2)
                this.setTexture('moveCard2')
            if(cost == 3)
                this.setTexture('moveCard3')
            if(cost == 4)
                this.setTexture('card')
        }
        if(this.type==1){
            if(cost == 0)
                this.setTexture('attackCard0')
            if(cost == 1)
                this.setTexture('attackCard1')
            if(cost == 2)
                this.setTexture('attackCard2')
            if(cost == 3)
                this.setTexture('attackCard3')
            if(cost == 4)
                this.setTexture('attackCard')
        }
        this.scaleX = 1 / 390 * 150
        this.scaleY = 1 / 390 * 150
        this.y = this.scene.HEIGHT - this.spriteOffset[1]//Unterer Bildschirmrand
        this.scene.add.existing(this)
        
        this.setInteractive()
        this.on('pointerdown', function (pointer) {
            this.scene.setCurrentCard(this)
        });
            
        this.movementSprite = new cardMovement(this.scene, this.movement)
    }

    update(time, delta){
        //karten werden gleichmäßig abhängig von der Position in der Liste vertelit
        if (this.cards.indexOf(this) != -1){
            this.x = this.scene.WIDTH * ((this.cards.indexOf(this)+1) / (this.cards.length+1))
            this.movementSprite.setPos(this.x - 23, this.y + 40)
        }
    }

    //Macht auf dem Layer alle Tiles sichtbar, welche die karte erlaubt
    //Man kann sich nur dahin bewegen wenn die preview auch sichtbar ist
    showMoves(canGolayer, player){
        var playerPos = player.getWorldPos()
        for(var x = 0; x < 5; x++){
            for(var y = 0; y < 5; y++){
                if(this.movement[y][x] == 0) continue;
                var checkingPos = [playerPos.x + x-2, playerPos.y + y-2]

                //If there is no Tile we cant move there
                if(canGolayer.getTileAt(checkingPos[0], checkingPos[1]) == null) continue;

                var isOccupied = this.scene.gameField[checkingPos[1]][[checkingPos[0]]] != null
                
                //if there is already someone we cant go there
                if(isOccupied && this.type == 0) continue;

                
                //if there is no enemy we cant atack there
                if(isOccupied == false && this.type == 1) continue;

                canGolayer.getTileAt(checkingPos[0], checkingPos[1]).visible = true
                if(this.type == 1){
                    canGolayer.putTileAt(3, checkingPos[0], checkingPos[1])
                }else{
                    canGolayer.putTileAt(1, checkingPos[0], checkingPos[1])
                }
            }
        }
    }
    delete(){
        this.movementSprite.delete()
        this.destroy()
    }
}