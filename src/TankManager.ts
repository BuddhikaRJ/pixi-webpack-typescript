import {Container, Rectangle, Sprite, Texture} from "pixi.js";
import { CONFIG } from "./gameConfig";
import { Keyboard } from "./Keyboard";

export class TankManager {
    //configurable values
    tankWidth = 30;
    tankHeight = 30;
    moveSpeed = 10;

    //render
    tankSprite : Sprite;
    gameWorld : Container;

    //keyboard input
    upKey : Keyboard;
    downKey : Keyboard;
    leftKey : Keyboard;
    rightKey : Keyboard;

    //movement
    directions : any = {
        none : -1,
        up : 3,
        down : 1,
        left : 2,
        right : 0
    }
    vX = 0;
    vY = 0;
    gunX = 0;
    gunY = 0;

    //collisions
    isinContactWithTile = false;

    constructor(_spritesheet : Texture, parent: Container){
        this.gameWorld = parent;

        const tex = new Texture(_spritesheet.baseTexture);
        this.tankSprite = new Sprite(tex);
        this.tankSprite.texture.frame = new Rectangle(...CONFIG.TEXTURE_COORDS.SQUARE);
        this.tankSprite.anchor.set(0.5);
        this.tankSprite.width = this.tankWidth;
        this.tankSprite.height = this.tankHeight;

        //#region keyboard input
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
        //#endregion

        this.tankSprite.position.set(875);
        this.tankSprite.rotation = -1.57;
        this.gunY =-1;

        this.gameWorld.addChild(this.tankSprite);
    }

    update(dt: number){
        this.move(dt);
    }

    move(dt: number) {
        this.tankSprite.x += this.vX * this.moveSpeed * dt;
        this.tankSprite.y += this.vY * this.moveSpeed * dt;

        this.tankSprite.y = this.tankSprite.y < this.tankHeight*0.5 ? this.tankHeight*0.5 : this.tankSprite.y;
        this.tankSprite.y = this.tankSprite.y > CONFIG.RENDERER_HEIGHT - this.tankHeight*0.5 ? CONFIG.RENDERER_HEIGHT - this.tankHeight*0.5 : this.tankSprite.y;

        this.tankSprite.x = this.tankSprite.x < this.tankWidth*0.5 ? this.tankWidth*0.5 : this.tankSprite.x;
        this.tankSprite.x = this.tankSprite.x > CONFIG.RENDERER_WIDTH - this.tankWidth*0.5 ? CONFIG.RENDERER_WIDTH - this.tankWidth*0.5 : this.tankSprite.x;
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

        this.gunX = this.vX;
        this.gunY = this.vY;

    }

    onHitTile(){
        console.log("hit");
        this.vX = 0;
        this.vY = 0;
    }
}