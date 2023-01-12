import { Container, Sprite, Texture } from "pixi.js";
import { Bullet } from "./Bullet";
import { TankManager } from "./TankManager";

export class Gun {
    player : TankManager;
    gameWorld : Container;

    bulletsArray : Bullet[] = [];
    gunTicker = 0;
    bulletTickMax = 10;
    shootWaitTickmax = 10;
    bulletCount = 3;
    bulletId = 0;

    shootState: any = {
        shooting: 0,
        waiting: 1
    }
    currentShootState = this.shootState.waiting;

    constructor(_spritesheet : Texture, parent: Container, player: TankManager){
        this.gameWorld = parent;
        this.player =player;
        for (let index = 0; index < this.bulletCount; index++) {
            const bullet = new Bullet(_spritesheet);
            this.bulletsArray.push(bullet);
        }
    }

    update(dt: number){
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

    shoot(){
        console.log("shoot");
        const b = this.bulletsArray[this.bulletId]
        this.gameWorld.addChild(b.bulletSprite);
        b.setMoving(this.player.tankSprite.x, this.player.tankSprite.y, this.player.gunX, this.player.gunY);
    }

}