import { Container, Rectangle, Sprite, Texture } from "pixi.js";
import { Bullet } from "./Bullet";
import { CONFIG } from "./gameConfig";
import { TankManager } from "./TankManager";

class Tile {
    //player reference
    tankObj : TankManager;

    //bullet reference
    bulletsArray : Bullet [];

    //sprite
    tileSprite : Sprite;

    //world
    gameWorld : Container;

    isActive = false;


    constructor(_spritesheet: Texture, _player : TankManager, _bullets : Bullet[], _parent:Container) {
        let tex = new Texture(_spritesheet.baseTexture);
        tex.frame = new Rectangle(...CONFIG.TEXTURE_COORDS.SQUARE);
        this.tileSprite = new Sprite(tex);
        this.tileSprite.anchor.set(0.5);

        this.tankObj = _player;

        this.bulletsArray = _bullets;

        this.gameWorld = _parent;

        this.gameWorld.addChild(this.tileSprite);

        this.isActive = true;
    }

    update(){
        //if colliding player, stop movement
        if(!this.isActive)return;

        if(this.isBoxCollision(this.tankObj.tankSprite, this.tileSprite)){
            this.tankObj.isinContactWithTile = this.hitIsFacingTowardsTile();
            if(this.tankObj.isinContactWithTile){
                this.tankObj.onHitTile()
            }
        }

        //if colliding bullet do relevant response
        this.bulletsArray.forEach(element => {
            if(this.isBoxCollision(element.bulletSprite, this.tileSprite)){
                this.onHitBullet(element);
            }
        });
    }

    isBoxCollision(p1 : Sprite, p2 : Sprite){
        const b1 = p1.getBounds();
        const b2 = p2.getBounds();
        return b1.x + b1.width > b2.x && b1.x < b2.x + b2.width && b1.y + b1.height > b2.y && b1.y < b2.y + b2.height;
    }

    hitIsFacingTowardsTile(){
        //obj2 = tank, 1=tile
        let vCollision = {x: this.tankObj.tankSprite.x - this.tileSprite.x, y: this.tankObj.tankSprite.y - this.tileSprite.y};
        let distance = Math.sqrt(vCollision.x * vCollision.x + vCollision.y * vCollision.y);
        let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
        let vRelativeVelocity = {x : - this.tankObj.vX, y : - this.tankObj.vY};
        let dot = vCollisionNorm.x * vRelativeVelocity.x + vCollisionNorm.y * vRelativeVelocity.y;
        console.log(dot>0);
        return  dot > 0;
        
    }

    onHitBullet(_bullet : Bullet){

    }
}

export class HayTile extends Tile {
    Health = 100;
    constructor(_spritesheet: Texture, _player : TankManager, _bullets : Bullet[], _parent:Container){
        super(_spritesheet, _player, _bullets, _parent);
        this.tileSprite.tint = 0X66aa66
    }

    onHitBullet(_bullet : Bullet): void {
        console.log("hay");
        if(!_bullet.isActive)return;
        _bullet.isActive = false;
        if(!this.tileSprite.visible) return;
        this.gameWorld.removeChild(_bullet.bulletSprite);

        console.log(this.Health);

        if (this.Health > 0) {
            this.Health -= _bullet.damage;
            return;
        }

        this.tileSprite.visible = false;
        this.isActive = false;
    }
}

export class WallTile extends Tile {
    constructor(_spritesheet: Texture, _player : TankManager, _bullets : Bullet[], _parent:Container){
        super(_spritesheet, _player, _bullets, _parent);
        this.tileSprite.tint = 0Xcc6666;
    }

    onHitBullet(_bullet : Bullet): void {
        if(!_bullet.isActive)return;
        _bullet.isActive = false;
        this.gameWorld.removeChild(_bullet.bulletSprite);
        console.log("wall");
    }
}