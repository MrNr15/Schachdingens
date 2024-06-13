//hier werden alle KartenBewegungen gespeichert
//kann aufgerufen werden, um eine zufällige zurückzugeben
export default class MovementGenerator {
    movements = [[
        [0,0,1,0,0],
        [0,0,1,0,0],
        [1,1,0,1,1],
        [0,0,1,0,0],
        [0,0,1,0,0]
    ],[
        [0,1,1,1,0],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [0,1,1,1,0]
    ],[
        [1,1,0,1,1],
        [1,1,0,1,1],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0]
    ],[
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [1,1,0,1,1],
        [1,1,0,1,1]
    ]]

    getMovement(){
        var index = parseInt(Math.random() * this.movements.length)
        return this.movements[index]
    }
}