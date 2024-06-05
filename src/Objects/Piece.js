export default class player extends Phaser.GameObjects.Sprite {

    scene;

    spriteOffset = [16, 8];

    constructor(_scene, pos_x, pos_y){
        super(_scene)
        this.scene = _scene
        this.setTexture('piece')
        this.scene.add.existing(this)
        this.setPosition(pos_x, pos_y)
        console.log(this.getWorldPos())
        this.scene.input.on('pointerdown', () => this.click());
    }

    getWorldPos(){
        return this.scene.screenToWorldPos(this.x, this.y+this.scene.TILE_HEIGHT)
    }

    click(){
        var x = this.scene.game.input.mousePointer.worldX
        var y = this.scene.game.input.mousePointer.worldY+this.scene.TILE_HEIGHT
        var pos = this.scene.screenToWorldPos(x, y);
        if(this.scene.canIMoveThere(pos)){
            this.setPosition(pos.x, pos.y)
            this.scene.playerMoved()
        }
    }

    setPosition(x, y){
        if(this.spriteOffset == undefined) return
        var screenPos = this.scene.worldPosToScreenPos(x, y)
        this.x = screenPos.x + this.spriteOffset[0];
        this.y = screenPos.y + this.spriteOffset[1];

    }
}