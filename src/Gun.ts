import { Container, Texture } from "pixi.js";
import { Bullet } from "./Bullet";
import { Keyboard } from "./Keyboard";
import { TankManager } from "./TankManager";

export class Gun {
    //configurable values
    bulletPoolsize = 3;
    bulletTickMax = 10;
    shootWaitTickmax = 10;
    GUN_TYPE_DATA : any = {
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

    //render
    player : TankManager;
    gameWorld : Container;

    //shooting
    bulletPool : Bullet[] = [];
    gunTicker = 0;
    bulletId = 0;
    bulletsPerShot = 0;
    SHOOT_STATE: any = {
        SHOOTING: 0,
        WAITING: 1
    }
    currentShootState = this.SHOOT_STATE.WAITING;

    //type switch
    switchGunKey : Keyboard;
    gunTypesArray = Object.keys(this.GUN_TYPE_DATA);
    gunTypesCount = this.gunTypesArray.length;
    gunTypeArrId = 0;
    currentGunType : any;

    constructor(_spritesheet : Texture, parent: Container, player: TankManager){
        this.gameWorld = parent;
        this.player =player;
        for (let index = 0; index < this.bulletPoolsize; index++) {
            const bullet = new Bullet(_spritesheet, parent);
            this.bulletPool.push(bullet);
        }
        this.applyGunTypeChanges(this.GUN_TYPE_DATA.RED);

        this.switchGunKey = new Keyboard(
            "t", 
            ()=>{
                this.selectNewGun()
            }, 
            ()=>{})
    }

    update(dt: number){
        switch (this.currentShootState) {
            case this.SHOOT_STATE.WAITING:
                // console.log("wait");
                this.gunTicker += dt;
                this.gunTicker = this.gunTicker > this.shootWaitTickmax ? this.shootWaitTickmax : this.gunTicker;
                if(this.gunTicker === this.shootWaitTickmax){
                    this.currentShootState = this.SHOOT_STATE.SHOOTING;
                    this.gunTicker = 0;
                }
                break;
            case this.SHOOT_STATE.SHOOTING:
                this.gunTicker += dt;
                this.gunTicker = this.gunTicker > this.bulletTickMax ? this.bulletTickMax : this.gunTicker;
                if(this.gunTicker === this.bulletTickMax){
                    if(this.bulletId < this.bulletsPerShot) {
                        this.shoot();
                        this.bulletId += 1;
                    }
                    else{
                        this.currentShootState = this.SHOOT_STATE.WAITING;
                        this.bulletId = 0;
                    }
                    this.gunTicker = 0;
                }
                break;

            default:
                break;
        }

        this.bulletPool.forEach(element => {
            element.update(dt);
        });
    }

    shoot(){
        // console.log("shoot");
        const b = this.bulletPool[this.bulletId]
        this.gameWorld.addChild(b.bulletSprite);
        b.bulletSprite.tint = this.currentGunType.color;
        b.damage = this.currentGunType.damage;
        b.setMoving(this.player.tankSprite.x, this.player.tankSprite.y, this.player.gunX, this.player.gunY);
    }

    selectNewGun(){
        this.gunTypeArrId += 1;
        this.gunTypeArrId %= this.gunTypesCount;
        this.applyGunTypeChanges(this.GUN_TYPE_DATA[this.gunTypesArray[this.gunTypeArrId]])
    }

    applyGunTypeChanges(typeObj : any){
        this.currentGunType = typeObj;
        this.player.tankSprite.tint = this.currentGunType.color;
        this.bulletsPerShot = typeObj.bulletsPerShot;
    }

}