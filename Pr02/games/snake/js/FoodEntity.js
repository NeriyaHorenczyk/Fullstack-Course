import {Entity} from '../../../js/engine/Entity.js';
import Vector from '../../../js/engine/Vector.js';


export default class FoodEntity extends Entity{
    type = 'food';
    
    
    constructor(){
        super();
        this.position = new Vector(50,50); //temp default position
        this.size = new Vector(10,10);
    }


    render(ctx, debug){
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }
}