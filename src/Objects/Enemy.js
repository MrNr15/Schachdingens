export default class Enemy extends Phaser.GameObjects.Sprite {

    scene;
    spriteOffset = [32, 18 - 13];
    movement = [
        [0,0,0,0,0],
        [0,1,1,1,0],
        [0,1,1,1,0],
        [0,1,1,1,0],
        [0,0,0,0,0],
    ]

    attacks = 2;

    moveTime=250; //milliseconds to finish move animation

    lives = 1;

    constructor(_scene, pos_x, pos_y){
        super(_scene)
        this.scene = _scene

        //Animation
        const anim = this.scene.anims.create({
            key: 'attack',
            frames: this.scene.anims.generateFrameNumbers('enemy1.2Attack', {start: 0, end: 4}),
            frameRate: 20,
            repeat: 1
        });
        const anim2 = this.scene.anims.create({
            key: 'idle',
            frames: [{ key: 'enemy1.2Attack', frame: 0 }],
            frameRate: 10,
        })
        this.setTexture('enemy1.2Attack')

        this.scene.add.existing(this)
        this.setPosition(pos_x, pos_y, false)
        this.scene.gameField[pos_y][pos_x] = this;
        this.scaleX = 1/750 * 64
        this.scaleY = 1/750 * 64
    }

    update(time, delta){
        this.setDepth(this.y)
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
        var worldPos = this.getWorldPos()

        for(var x = 0; x < 5; x++){
            for(var y = 0; y < 5; y++){
                if(this.movement[y][x] == 0) continue;
                var checkingPos = [worldPos.x + x-2, worldPos.y + y-2]

                if(checkingPos[0] == playerPos.x && checkingPos[1] == playerPos.y) return true;
            }
        }
        return false;
    }

    bewegung(){
        var playerPos = this.scene.player.getWorldPos()
        var worldPos = this.getWorldPos()
        var bestMove = [worldPos.x, worldPos.y]
        var bestDistance = 9999999

        for(var x = 0; x < 5; x++){
            for(var y = 0; y < 5; y++){
                if(this.movement[y][x] == 0) continue;
                var checkingPos = [worldPos.x + x-2, worldPos.y + y-2]

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
        this.scene.gameField[worldPos.y][worldPos.x] = null //alte position auf karte wird gelöscht
        this.setPosition(bestMove[0], bestMove[1], true)
        this.scene.gameField[bestMove[1]][bestMove[0]] = this; // neue position wird auf karte eingetragen
    }

    //flipped den sprite damit der gegner in die richtung der position guckt
    alignSprite(x, y){
        //flip sprite to point towards movment
        if(this.scene.worldPosToScreenPos(x, y).x < this.x-this.spriteOffset[0])
            this.flipX = false
        if(this.scene.worldPosToScreenPos(x, y).x > this.x-this.spriteOffset[1])
            this.flipX = true
    }

    angriff(){
        var playerPos = this.scene.player.getWorldPos()
        this.alignSprite(playerPos.x, playerPos.y)
        this.scene.player.damage(1);
        this.play('attack')
    }

    //Sound beim Bewegen einer Figur
    movingSound(){
        var moving = this.scene.sound.add('move')
        moving.setVolume(0.4)
        moving.play()
    }

    getWorldPos(){
        return this.scene.screenToWorldPos(this.x, this.y+this.scene.TILE_HEIGHT)//Gott weiß warum man hier was draufrechnen muss
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
            var pos = this.getWorldPos()
            this.scene.gameField[pos.y][pos.x] = null
            const index = this.scene.enemys.indexOf(this);
            if (index > -1) { // only splice array when item is found
                this.scene.enemys.splice(index, 1); // 2nd parameter means remove one item only
            }
            this.destroy()
        }
    }
}