export default class player extends Phaser.GameObjects.Sprite {

    scene;

    spriteOffset = [16, 8]

    constructor(_scene, pos_x, pos_y){
        super(_scene)
        this.scene = _scene
        this.setTexture('piece')
        var pos = this.scene.worldPosToScreenPos(pos_x, pos_y)
        this.x = pos[0] + this.spriteOffset[0]
        this.y = pos[1] + this.spriteOffset[1]
        this.scene.add.existing(this)

        this.scene.input.on('pointerdown', () => this.click());
    }
    update(time, delta) {
    }

    click(){
        var x = this.scene.game.input.mousePointer.worldX
        var y = this.scene.game.input.mousePointer.worldY
        this.setWorldPosition(x, y)
    }

    setWorldPosition(x, y){
        //zuerst wird die position auf der TileMap bestimmt und dann damit die echte Position berechnet
        //Dadurch wird die position sozusagen auf das passende Tile gesnapped
        var pos = this.scene.screenToWorldPos(x, y);
        var pos = this.scene.worldPosToScreenPos(pos[0], pos[1])
        this.x = pos[0] + this.spriteOffset[0];
        this.y = pos[1] + this.spriteOffset[1];
    }
}