export default class Enemy extends Phaser.GameObjects.Sprite {

    scene;
    spriteOffset = [31, 1];
    movement = [
        [0,0,0,0,0],
        [0,1,0,1,0],
        [0,0,0,0,0],
        [0,1,0,1,0],
        [0,0,0,0,0],
    ]
    attack = [
        [0,0,0,0,0],
        [0,1,0,1,0],
        [0,0,0,0,0],
        [0,1,0,1,0],
        [0,0,0,0,0],
    ]

    attacks = 2;

    moveTime=250; //milliseconds to finish move animation

    lives = 2;

    gridPos;

    constructor(_scene, pos_x, pos_y){
        super(_scene)
        this.scene = _scene

        //Animation
        const anim = this.scene.anims.create({
            key: 'attack2',
            frames: this.scene.anims.generateFrameNumbers('enemy2Attack', {start: 0, end: 4}),
            frameRate: 20,
            repeat: 1
        });
        const anim2 = this.scene.anims.create({
            key: 'idle2',
            frames: [{ key: 'enemy2Attack', frame: 0 }],
            frameRate: 10,
        })
        const anim3 = this.scene.anims.create({
            key: 'schaden2',
            frames: this.scene.anims.generateFrameNumbers('enemy2Schaden', {start: 0, end: 3}),
            frameRate: 5,
        })
        const anim4 = this.scene.anims.create({
            key: 'death2',
            frames: this.scene.anims.generateFrameNumbers('enemy2Tod', {start: 0, end: 3}),
            frameRate: 20,
        })
        this.setTexture('enemy2Attack')

        this.gridPos = [pos_x, pos_y]
        this.scene.add.existing(this)
        this.setPosition(pos_x, pos_y, false)
        this.scene.gameField[pos_y][pos_x] = this;
        
        this.scaleX = 1/455 * 64
        this.scaleY = 1/455 * 64

        this.on('animationcomplete', () => {
            if(this.lives <= 0){
                this.death()
            }else{
                this.play('idle2')
            }
        });

        this.healthbar = this.scene.add.sprite(this.x, this.y+32, 'healthBar', 2)
        this.healthbar.setDepth(1000000)
        this.healthbar.scaleY = 0.5
        this.healthbar.scaleX = 0.8
        this.healthbar.visible = false

    }

    showMovement(){
        this.scene.resetMovePossiblilitys()
        for(var x = 0; x < 5; x++){
            for(var y = 0; y < 5; y++){
                if(this.movement[y][x] == 0 && this.attack[y][x] == 0) continue;
                var checkingPos = [this.gridPos[0] + x-2, this.gridPos[1] + y-2]

                if(this.scene.canGoLayer.getTileAt(checkingPos[0], checkingPos[1]) == null) continue;

                this.scene.canGoLayer.getTileAt(checkingPos[0], checkingPos[1]).visible = true
                if(this.movement[y][x])
                    this.scene.canGoLayer.putTileAt(1,checkingPos[0], checkingPos[1])
                if(this.attack[y][x])
                    this.scene.canGoLayer.putTileAt(3,checkingPos[0], checkingPos[1])
                if(this.movement[y][x] && this.attack[y][x])
                    this.scene.canGoLayer.putTileAt(2,checkingPos[0], checkingPos[1])
            }
        }
    }

    update(time, delta){
        this.setDepth(this.y)
        if(this.lives == 2)
            this.healthbar.visible = false
        else
            this.healthbar.visible = true
        this.healthbar.setFrame(this.lives)
        this.healthbar.x = this.x
        this.healthbar.y = this.y + 32
    }

    //wird nach einem spielerzug gerufen
    //berechnet den abstand zum spieler für jeden möglichen zug und geht dann dahin wo er am nächsten kommt
    //index ist der index vom enemy in scene.enemys
    move(index, attacks){
        if(this.canAttack()){
            this.angriff()
        }else{
            this.bewegung()
        }

        //animation abwarten
        var enemys = this.scene.enemys
        var enemy = this //"this" bezieht sich im timer auf was anderes also machen wir eine kopie
        setTimeout(function(){

            //nochmal bewegen
            if(attacks > 1){
                enemy.move(index, attacks-1)
                return
            }

            //wenn alle bewegungne aufgebraucht sind
            //nächster enemy wird zum bewegen aufgerufen
            if(enemys.length > index+1)
                enemys[index+1].move(index+1, enemys[index+1].attacks);

        }, this.moveTime);
    }

    canAttack(){
        var playerPos = this.scene.player.getWorldPos()

        for(var x = 0; x < 5; x++){
            for(var y = 0; y < 5; y++){
                if(this.attack[y][x] == 0) continue;
                var checkingPos = [this.gridPos[0] + x-2, this.gridPos[1] + y-2]

                if(checkingPos[0] == playerPos.x && checkingPos[1] == playerPos.y) return true;
            }
        }
        return false;
    }

    bewegung(){
        var playerPos = this.scene.player.getWorldPos()
        var bestMove = [this.gridPos[0], this.gridPos[1]]
        var bestDistance = 9999999

        for(var x = 0; x < 5; x++){
            for(var y = 0; y < 5; y++){
                if(this.movement[y][x] == 0) continue;
                var checkingPos = [this.gridPos[0] + x-2, this.gridPos[1] + y-2]

                //If there is no Tile we cant move there
                if(this.scene.canGoLayer.getTileAt(checkingPos[0], checkingPos[1]) == null) continue;
                //If there is already a piece there we cant move there
                if(this.scene.gameField[checkingPos[1]][checkingPos[0]] != null) continue;

                var distance = Math.pow(checkingPos[0] - playerPos.x, 2)
                +  Math.pow(checkingPos[1] - playerPos.y, 2)
                if (distance < bestDistance){
                    bestDistance = distance;
                    bestMove = [checkingPos[0], checkingPos[1]]
                }
            }
        }

        this.movingSound()

        this.alignSprite(bestMove[0], bestMove[1])

        //Bewegung
        this.scene.gameField[this.gridPos[1]][this.gridPos[0]] = null //alte position auf karte wird gelöscht
        this.setPosition(bestMove[0], bestMove[1], true)
        this.scene.gameField[bestMove[1]][bestMove[0]] = this; // neue position wird auf karte eingetragen
        this.gridPos = bestMove
    }

    //flipped den sprite damit der gegner in die richtung der position guckt
    alignSprite(x, y){
        //flip sprite to point towards movment
        if(this.scene.worldPosToScreenPos(x, y).x < this.x-this.spriteOffset[0])
            this.flipX = true
        if(this.scene.worldPosToScreenPos(x, y).x > this.x-this.spriteOffset[0])
            this.flipX = false
    }

    angriff(){
        this.kauen()
        var playerPos = this.scene.player.getWorldPos()
        this.alignSprite(playerPos.x, playerPos.y)
        this.scene.player.damage(1);
        this.play('attack2')
    }

    //Sound beim Bewegen einer Figur
    movingSound(){
        var moving = this.scene.sound.add('move')
        moving.setVolume(0.4)
        moving.play()
    }

     //sound beim kauen
     kauen(){
        var kauen = this.scene.sound.add('kauen')
        kauen.setRate(3)
        kauen.setVolume(0.4)
        kauen.play()
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
            duration: this.moveTime,
            ease: "Power3" // Easing function
        });
    }

    damage(amount){
        
        this.lives -= amount
        if(this.lives <= 0){
            this.play('death2')
        }else{
            this.play('schaden2')
        }
    }

    death(){
        this.scene.gameField[this.gridPos[1]][this.gridPos[0]] = null
            const index = this.scene.enemys.indexOf(this);
            if (index > -1) { // only splice array when item is found
                this.scene.enemys.splice(index, 1); // 2nd parameter means remove one item only
            }
            this.healthbar.destroy()
            this.destroy()
    }
}