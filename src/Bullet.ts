import { BaseTexture, Rectangle, Sprite, Texture } from "pixi.js";
import { CONFIG } from "./gameConfig";

export class Bullet {
    bulletSprite : Sprite;
    vX = 0;
    vY = 0;
    moveSpeed = 10;
    isActive = false;
    damage = 0;

    constructor(_spritesheet: Texture) {
        let tex = new Texture(_spritesheet.baseTexture);
        this.bulletSprite = new Sprite(tex);
        this.bulletSprite.texture.frame = new Rectangle(...CONFIG.TEXTURE_COORDS.CIRCLE);
        this.bulletSprite.anchor.set(0.5);
        this.bulletSprite.scale.set(0.2)
    }

    update(dt: number) {
        if(!this.isActive)return;
        this.bulletSprite.x += this.vX * this.moveSpeed * dt;
        this.bulletSprite.y += this.vY * this.moveSpeed * dt;
    }

    setMoving(x:number, y:number, _vx:number, _vy:number){
        this.bulletSprite.position.set(x,y);
        this.vX = _vx;
        this.vY = _vy;
        this.isActive = true;
    }

}