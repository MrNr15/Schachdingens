export default class Item extends Phaser.GameObjects.Sprite {

    scene;
    spriteOffset = [41, 18 - 15];
    gridPos;

    constructor(_scene, pos_x, pos_y){
        super(_scene)
        this.scene = _scene

        //Animation
        this.setTexture('TODO')
        this.gridPos = [pos_x, pos_y]
        this.scene.add.existing(this)
        this.setPosition(pos_x, pos_y)
        this.scene.gameField[pos_y][pos_x] = this;
    }

    update(time, delta){
        this.setDepth(this.y)
    }

    setPosition(x, y){
        //Javascript hält sich für witzig und ruft diese funktion automatisch auf bevor "spriteOffset"
        //existiert also verhindern wir das mit dem if statement
        if(this.spriteOffset == undefined) return
        var screenPos = this.scene.worldPosToScreenPos(x, y);
        this.x = screenPos.x + this.spriteOffset[0];
        this.y = screenPos.y + this.spriteOffset[1];
    }
}