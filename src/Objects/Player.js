export default class Player extends Phaser.GameObjects.Sprite {

    scene;

    spriteOffset = [29, 8];

    lives = 3;

    constructor(_scene, pos_x, pos_y){
        super(_scene)
        this.scene = _scene

        //Animation

        const anim4 = this.scene.anims.create({
            key: 'playerDamage',
            frames: this.scene.anims.generateFrameNumbers('playerSchaden', {start: 0, end: 3}),
            frameRate: 8,
        })
        const anim2 = this.scene.anims.create({
            key: 'idlePlayer',
            frames: [{ key: 'player', frame: 0}],
            frameRate: 10,
        })
        const anim1 = this.scene.anims.create({
            key: 'deathPlayer',
            frames: this.scene.anims.generateFrameNumbers('playerTod', {start: 0, end: 3}),
            frameRate: 20,
        })
        const anim5 = this.scene.anims.create({
            key: 'playerAttack1',
            frames: this.scene.anims.generateFrameNumbers('playerAttack1', {start: 0, end: 3}),
            frameRate: 25,
        });
        const anim6 = this.scene.anims.create({
            key: 'playerAttack2',
            frames: this.scene.anims.generateFrameNumbers('playerAttack2', {start: 0, end: 3}),
            frameRate: 25,
        });
        const anim7 = this.scene.anims.create({
            key: 'playerAttack3',
            frames: this.scene.anims.generateFrameNumbers('playerAttack3', {start: 0, end: 3}),
            frameRate: 25,
        });
        const anim8 = this.scene.anims.create({
            key: 'playerAttack4',
            frames: this.scene.anims.generateFrameNumbers('playerAttack4', {start: 0, end: 3}),
            frameRate: 25,
        });
        this.setTexture('player')

        this.scene.add.existing(this)
        this.setPosition(pos_x, pos_y, false)
        this.scene.gameField[pos_y][pos_x] = this;
        this.scene.input.on('pointerdown', () => this.click());
        this.scaleX = 1/680*64
        this.scaleY = 1/680*64

        this.on('animationcomplete', () => {
            if(this.lives <= 0){
                this.death()
            }else{
                this.play('idlePlayer')
            }
        });
    }

    update(time, delta){
        this.setDepth(this.y)
    }

    getWorldPos(){
        return this.scene.screenToWorldPos(this.x, this.y + this.scene.TILE_HEIGHT)
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
            if(this.scene.currentCard.type == 1){ //angriffskarte ausgewählt
                this.attackSound()
                this.scene.gameField[pos.y][pos.x].damage(1)
                if(true){
                    this.play('playerAttack1')
                }else if(false){
                    this.play('playerAttack2')
                }else if(false){
                    this.play('playerAttack3')
                }else if(false){
                    this.play('playerAttack4')
                }
            }
            
            this.scene.playerMoved()
            return
        }

        //wenn man auf das spielfeld klickt wird die karte abgewählt
        if(this.scene.canGoLayer.getTileAt(pos.x, pos.y) != null){
            let objectAtPos = this.scene.gameField[pos.y][pos.x]
            if(objectAtPos == null)
                this.scene.unselectCard()
            else if(objectAtPos != this)
                objectAtPos.showMovement()
                
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

    damage(amount){
        this.lives -= amount;
        if (this.lives <= 0)
            this.play("deathPlayer")
        else
            this.play("playerDamage")
    }

    attackSound(){
        var attack = this.scene.sound.add('attackSound')
        attack.setRate(2)
        attack.setVolume(0.4)
        attack.play()
    }

    death(){
        this.visible = false
        this.scene.gameLost()
    }
}