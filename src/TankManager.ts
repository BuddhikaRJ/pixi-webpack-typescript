import {Container, Rectangle, Sprite, Texture} from "pixi.js";
import { Bullet } from "./Bullet";
import { CONFIG } from "./gameConfig";
import { Keyboard } from "./Keyboard";

export class TankManager {
    tankWidth = 30;
    tankHeight = 30;

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

    bulletSpeedX : number;
    bulletSpeedY : number;

    bulletsArray : Bullet[] = [];
    gunTicker = 0;
    bulletTickMax = 10;
    shootWaitTickmax = 10;
    bulletCount = 3;
    bulletId = 0;

    shootState : any = {
        shooting: 0,
        waiting : 1
    }
    currentShootState = this.shootState.waiting;
    gameWorld : Container;


    constructor(_spritesheet : Texture, parent: Container){
        this.gameWorld = parent;
        let tex = new Texture(_spritesheet.baseTexture);
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

        this.vX = 0;
        this.vY = 0;

        this.bulletSpeedX = 1;
        this.bulletSpeedY = 0;

        for (let index = 0; index < this.bulletCount; index++) {
            const bullet = new Bullet(tex)
            this.bulletsArray.push(bullet);
        }
    }

    update(dt: number){
        this.move(dt);
        
        switch (this.currentShootState) {
            case this.shootState.waiting:
                console.log("wait");
                
                this.gunTicker += dt;
                this.gunTicker = this.gunTicker > this.shootWaitTickmax ? this.shootWaitTickmax : this.gunTicker;
                if(this.gunTicker === this.shootWaitTickmax){
                    this.currentShootState = this.shootState.shooting;
                    this.gunTicker = 0;
                }
                break;
            case this.shootState.shooting:
                this.gunTicker += dt;
                this.gunTicker = this.gunTicker > this.bulletTickMax ? this.bulletTickMax : this.gunTicker;
                if(this.gunTicker === this.bulletTickMax){
                    if(this.bulletId < this.bulletCount) {
                        this.shoot();
                        this.bulletId += 1;
                    }
                    else{
                        this.currentShootState = this.shootState.waiting;
                        this.bulletId = 0;
                    }
                    this.gunTicker = 0;
                }
                break;

            default:
                break;
        }

        this.bulletsArray.forEach(element => {
            element.update(dt);
        });
    }

    move(dt: number) {
        this.tankSprite.x += this.vX * this.moveSpeed * dt;
        this.tankSprite.y += this.vY * this.moveSpeed * dt;
    }

    shoot(){
        console.log("shoot");
        const b = this.bulletsArray[this.bulletId]
        this.gameWorld.addChild(b.bulletSprite);
        b.setMoving(this.tankSprite.x, this.tankSprite.y, this.bulletSpeedX, this.bulletSpeedY);
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

        this.bulletSpeedX = this.vX;
        this.bulletSpeedY = this.vY;
    }
}