import {Rectangle, Sprite, Texture} from "pixi.js";
import { CONFIG } from "./gameConfig";
import { Keyboard } from "./Keyboard";

export class TankManager {
    moveSpeed = 10;
    tankSprite : Sprite;
    upKey : Keyboard;
    downKey : Keyboard;
    leftKey : Keyboard;
    rightKey : Keyboard;
    directions : any = {
        none : -1,
        up : 3,
        down : 1,
        left : 2,
        right : 0
    }
    currentDirection : any;


    constructor(_spritesheet : Texture){
        this.tankSprite = new Sprite(_spritesheet);
        this.tankSprite.texture.frame = new Rectangle(...CONFIG.TEXTURE_COORDS.SQUARE);
        this.tankSprite.anchor.set(0.5);

        this.upKey = new Keyboard("ArrowUp", ()=>{this.setMovement(this.directions.up)}, ()=>{this.setMovement(this.directions.none)});
        this.downKey = new Keyboard("ArrowDown", ()=>{this.setMovement(this.directions.down)}, ()=>{this.setMovement(this.directions.none)});
        this.leftKey = new Keyboard("ArrowLeft", ()=>{this.setMovement(this.directions.left)}, ()=>{this.setMovement(this.directions.none)});
        this.rightKey = new Keyboard("ArrowRight", ()=>{this.setMovement(this.directions.right)}, ()=>{this.setMovement(this.directions.none)});

        this.currentDirection = this.directions.none;
    }

    move(dt: number) {
        switch (this.currentDirection) {
            case this.directions.up:
                this.tankSprite.y -= this.moveSpeed * dt;
                break;
            case this.directions.down:
                this.tankSprite.y += this.moveSpeed * dt;
                break;
            case this.directions.left:
                this.tankSprite.x -= this.moveSpeed * dt;
                break;
            case this.directions.right:
                this.tankSprite.x += this.moveSpeed * dt;
                break;
            default:
                break;
        }
    }

    setMovement(dir : number) {
        this.currentDirection = dir;
        if(dir >= 0) this.tankSprite.rotation = 1.57 * dir
    }
}