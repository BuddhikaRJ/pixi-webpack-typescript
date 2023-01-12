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
    
    vX : number;
    vY : number;


    constructor(_spritesheet : Texture){
        this.tankSprite = new Sprite(_spritesheet);
        this.tankSprite.texture.frame = new Rectangle(...CONFIG.TEXTURE_COORDS.SQUARE);
        this.tankSprite.anchor.set(0.5);

        //keyboard input
        this.upKey = new Keyboard(
            "ArrowUp", 
            ()=>{this.setMovement(this.directions.up)}, 
            ()=>{
                if(!this.downKey.isDown && this.vX === 0){
                    this.vY = 0;
                }
            }
            );

        this.downKey = new Keyboard(
            "ArrowDown", 
            ()=>{this.setMovement(this.directions.down)}, 
            ()=>{
                if(!this.upKey.isDown && this.vX === 0){
                    this.vY = 0;
                }
            }
            );

        this.leftKey = new Keyboard(
            "ArrowLeft", 
            ()=>{this.setMovement(this.directions.left)}, 
            ()=>{
                if(!this.rightKey.isDown && this.vY === 0){
                    this.vX = 0;
                }
            }
            );

        this.rightKey = new Keyboard(
            "ArrowRight", 
            ()=>{this.setMovement(this.directions.right)}, 
            ()=>{
                if(!this.leftKey.isDown && this.vY === 0){
                    this.vX = 0;
                }
            }
            );


        this.vX = 0;
        this.vY = 0;
    }

    move(dt: number) {
        this.tankSprite.x += this.vX * this.moveSpeed * dt;
        this.tankSprite.y += this.vY * this.moveSpeed * dt;
    }

    setMovement(dir : number) {
        switch (dir) {
            case this.directions.up:
                this.vX = 0;
                this.vY = -1;
                this.tankSprite.rotation = -1.57;
                break;
            case this.directions.down:
                this.vX = 0;
                this.vY = 1;
                this.tankSprite.rotation = 1.57;
                break;
            case this.directions.left:
                this.vX = -1;
                this.vY = 0;
                this.tankSprite.rotation = -3.14;
                break;
            case this.directions.right:
                this.vX = 1;
                this.vY = 0;
                this.tankSprite.rotation = 0;
                break;
            default:
                break;
        }
    }
}