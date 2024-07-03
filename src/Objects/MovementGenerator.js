//hier werden alle KartenBewegungen gespeichert
//kann aufgerufen werden, um eine zufällige zurückzugeben
export default class MovementGenerator {
        cost1 = [[
            [0,0,0,0,0],
            [0,0,1,0,0],
            [0,1,0,1,0],
            [0,0,1,0,0],
            [0,0,0,0,0]
        ],[
            [0,0,1,0,0],
            [0,0,0,0,0],
            [1,0,0,0,1],
            [0,0,0,0,0],
            [0,0,1,0,0]
        ],[
            [0,0,0,0,0],
            [1,1,0,1,1],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0]
        ],[
            [0,0,0,0,0],
            [0,0,0,0,0],
            [1,1,0,0,0],
            [0,0,1,0,0],
            [0,0,1,0,0]
        ],[
            [0,0,0,0,0],
            [0,1,0,1,0],
            [0,0,0,0,0],
            [0,1,0,1,0],
            [0,0,0,0,0]
        ]]
        cost2 = [[
            [0,0,1,0,0],
            [0,0,1,0,0],
            [1,1,0,1,1],
            [0,0,1,0,0],
            [0,0,1,0,0]
        ],[
            [0,1,0,1,0],
            [1,0,0,0,1],
            [0,0,0,0,0],
            [1,0,0,0,1],
            [0,1,0,1,0]
        ],[
            [1,1,0,1,1],
            [1,0,0,0,1],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,1,0,0]
        ],[
            [0,0,1,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [1,0,0,0,1],
            [1,1,0,1,1]
        ],[
            [1,0,0,0,1],
            [0,1,0,1,0],
            [0,0,0,0,0],
            [0,1,0,1,0],
            [1,0,0,0,1]
        ]]
        cost3 = [[
            [1,0,1,0,1],
            [0,1,0,1,0],
            [1,0,0,0,1],
            [0,1,0,1,0],
            [1,0,1,0,1]
        ],[
            [0,1,1,1,0],
            [1,0,1,0,1],
            [1,1,0,1,1],
            [1,0,1,0,1],
            [0,1,1,1,0]
        ],[
            [1,0,1,0,1],
            [0,1,0,1,0],
            [1,0,0,0,1],
            [0,1,0,1,0],
            [1,0,1,0,1]
        ]]
        cost4 = [[
            [1,1,1,1,1],
            [1,1,1,1,1],
            [1,1,0,1,1],
            [1,1,1,1,1],
            [1,1,1,1,1]
        ]]

    getMovement(cost){
        if(cost == 1){
            var index = parseInt(Math.random() * this.cost1.length)
            return this.cost1[index]
        }
        if(cost == 2){
            var index = parseInt(Math.random() * this.cost2.length)
            return this.cost2[index]
        }
        if(cost == 3){
            var index = parseInt(Math.random() * this.cost3.length)
            return this.cost3[index]
        }
        if(cost == 4){
            var index = parseInt(Math.random() * this.cost4.length)
            return this.cost4[index]
        }
        if(cost == 5){
            var tmove = 
            [
                [0,0,1,0,0],
                [0,0,0,0,0],
                [1,0,0,0,1],
                [0,0,0,0,0],
                [0,0,1,0,0]
            ]
        return tmove;
        }if(cost == 6){
            var amove = 
            [
                [0,0,1,0,0],
                [0,1,1,1,0],
                [1,1,0,1,1],
                [0,1,1,1,0],
                [0,0,1,0,0]
            ]
        return amove;
        }
        //Fallback
        var index = parseInt(Math.random() * this.cost1.length)
            return this.cost1[index]
    }

    

}