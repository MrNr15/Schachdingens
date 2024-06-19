export default class Cloud2 extends Phaser.GameObjects.Sprite {

    scene;

    speed = 50;


    constructor(_scene){
        super(_scene)
        this.scene = _scene
        
        this.setTexture('cloud2')
        this.scene.add.existing(this)
        this.x = Math.random()*this.scene.WIDTH
        this.y = Math.random()*this.scene.HEIGHT
        this.setDepth(-3)
    }

    update(time, delta){
        this.x += this.speed * delta/1000

        if(this.x > this.scene.WIDTH+200)
            this.x = -200;
    }
}