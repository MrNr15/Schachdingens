export default class Player extends Phaser.GameObjects.Sprite {

    scene;

    spriteOffset = [32, 16];

    constructor(_scene, pos_x, pos_y){
        super(_scene)
        this.scene = _scene
        this.setTexture('piece')
        this.scene.add.existing(this)
        this.setPosition(pos_x, pos_y, false)
        this.scene.gameField[pos_y][pos_x] = this;
        this.scene.input.on('pointerdown', () => this.click());
    }

    getWorldPos(){
        return this.scene.screenToWorldPos(this.x, this.y+this.scene.TILE_HEIGHT)//Gott weiß warum man hier was draufrechnen muss
    }

    click(){
        //MousePosition wird auf dem Grid bestimmt
        var x = this.scene.game.input.mousePointer.worldX
        var y = this.scene.game.input.mousePointer.worldY+this.scene.TILE_HEIGHT//Gott weiß warum man hier was draufrechnen muss
        var pos = this.scene.screenToWorldPos(x, y);

        //Bewegung/Angriff
        if(this.scene.canIMoveThere(pos)){
            if(this.scene.currentCard.type == 0) //bewegungskarte ausgewählt
                this.move(pos)
            if(this.scene.currentCard.type == 1) //angriffskarte ausgewählt
                this.scene.gameField[pos.y][pos.x].damage(1)
            
            this.scene.playerMoved()
        }
    }

    move(pos){
        this.movingSound()
        var worldPos = this.getWorldPos()
        this.scene.gameField[worldPos.y][worldPos.x] = null //alte position auf karte wird gelöscht
        this.setPosition(pos.x, pos.y, true)
        this.scene.gameField[pos.y][pos.x] = this; // neue position wird auf karte eingetragen
    }

    //Sound beim Bewegen einer Figur
    movingSound(){
        var moving = this.scene.sound.add('move')
        moving.setVolume(0.4)
        moving.play()
    }

    setPosition(x, y, interpolate){
        //Javascript hält sich für witzig und ruft diese funktion automatisch auf bevor "spriteOffset"
        //existiert also verhindern wir das mit dem if statement
        if(this.spriteOffset == undefined) return

        var screenPos = this.scene.worldPosToScreenPos(x, y)
        var newX = screenPos.x + this.spriteOffset[0];
        var newY = screenPos.y + this.spriteOffset[1];

        if(interpolate == false){
            this.x = newX
            this.y = newY
            return
        }

        this.scene.tweens.add({
            targets: this,
            x: newX,
            y: newY,
            duration: 500,
            ease: 'Power3' // Easing function
        });

    }
}