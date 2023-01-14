import { Container, Sprite, Texture } from "pixi.js";
import { Bullet } from "./Bullet";
import { Keyboard } from "./Keyboard";
import { TankManager } from "./TankManager";

export class Gun {
    //render
    player : TankManager;
    gameWorld : Container;

    //shooting
    bulletsArray : Bullet[] = [];
    gunTicker = 0;
    bulletTickMax = 10;
    shootWaitTickmax = 10;
    bulletCount = 3;
    bulletId = 0;
    bulletsPerShot = 0;
    shootState: any = {
        shooting: 0,
        waiting: 1
    }
    currentShootState = this.shootState.waiting;

    //type switch
    switchGunKey : Keyboard;
    GUN_DATA : any = {
        RED : {
            color : 0xff0000,
            damage : 10,
            bulletsPerShot : 2
        },
        BLUE : {
            color : 0X0000ff,
            damage : 20,
            bulletsPerShot : 3
        },
        GREEN : {
            color : 0x00ff00,
            damage : 25,
            bulletsPerShot : 1
        },
    }
    gunTypes = Object.keys(this.GUN_DATA);
    gunTypesCount = this.gunTypes.length;
    gunTypeId = 0;
    currentGunType : any;

    constructor(_spritesheet : Texture, parent: Container, player: TankManager){
        this.gameWorld = parent;
        this.player =player;
        for (let index = 0; index < this.bulletCount; index++) {
            const bullet = new Bullet(_spritesheet);
            this.bulletsArray.push(bullet);
        }
        this.applyGunTypeChanges(this.GUN_DATA.RED);

        this.switchGunKey = new Keyboard(
            "t", 
            ()=>{
                this.selectNewGun()
            }, 
            ()=>{})
    }

    update(dt: number){
        switch (this.currentShootState) {
            case this.shootState.waiting:
                // console.log("wait");
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
                    if(this.bulletId < this.bulletsPerShot) {
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
        // console.log("shoot");
        const b = this.bulletsArray[this.bulletId]
        this.gameWorld.addChild(b.bulletSprite);
        b.bulletSprite.tint = this.currentGunType.color;
        b.damage = this.currentGunType.damage;
        b.setMoving(this.player.tankSprite.x, this.player.tankSprite.y, this.player.gunX, this.player.gunY);
    }

    selectNewGun(){
        this.gunTypeId += 1;
        this.gunTypeId %= this.gunTypesCount;
        this.applyGunTypeChanges(this.GUN_DATA[this.gunTypes[this.gunTypeId]])
    }

    applyGunTypeChanges(typeObj : any){
        this.currentGunType = typeObj;
        this.player.tankSprite.tint = this.currentGunType.color;
        this.bulletsPerShot = typeObj.bulletsPerShot;
    }

}