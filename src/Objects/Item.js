export default class Item extends Phaser.GameObjects.Sprite {

    scene;
    spriteOffset = [31, 0];
    gridPos;

    constructor(_scene, pos_x, pos_y){
        super(_scene)
        this.scene = _scene

        this.setTexture('item')
        this.gridPos = [pos_x, pos_y]
        this.scene.add.existing(this)
        this.setPosition(pos_x, pos_y)
        this.scene.gameField[pos_y][pos_x] = this;
        this.scaleX = 0.4
        this.scaleY = 0.4
        this.setDepth(this.y)
        this.shadow = this.scene.add.sprite(this.x, this.y+17, 'itemShadow')
        this.shadow.setDepth(5)
        this.shadow.alpha = 0.5
        this.shadow.scaleX = 0.25
        this.shadow.scaleY = 0.25
        console.log(this.shadow)
        this.scene.tweens.add({
            targets: this,
            y: { from: this.y-24, to: this.y-40}, // Animate alpha from 1 to 0
            duration: 1000,                     // Duration of 1 second
            yoyo: true,                         // Yoyo effect (reverse back to original value)
            repeat: -1,                         // Repeat indefinitely
            ease: 'Sine.easeInOut'              // Easing function
        });
    }

    setPosition(x, y){
        //Javascript hält sich für witzig und ruft diese funktion automatisch auf bevor "spriteOffset"
        //existiert also verhindern wir das mit dem if statement
        if(this.spriteOffset == undefined) return
        var screenPos = this.scene.worldPosToScreenPos(x, y);
        this.x = screenPos.x + this.spriteOffset[0];
        this.y = screenPos.y + this.spriteOffset[1];
    }

    delete(){
        this.shadow.destroy()
        this.destroy()
    }
}