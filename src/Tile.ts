import { Container, Rectangle, Sprite, Text, Texture } from "pixi.js";
import { Bullet } from "./Bullet";
import { CONFIG } from "./gameConfig";
import { TankManager } from "./TankManager";

export class Tile {
    //config values
    tileWidth = 35;
    tileHeight = 35;

    //player reference
    tankObj : TankManager;

    //bullet reference
    bulletsArray : Bullet [];

    //sprite
    tileSprite : Sprite;

    //world
    gameWorld : Container;

    //state
    isActive = false;
    next!: Tile;


    constructor(_spritesheet: Texture, _player : TankManager, _bullets : Bullet[], _parent:Container) {
        let tex = new Texture(_spritesheet.baseTexture);
        tex.frame = new Rectangle(...CONFIG.TEXTURE_COORDS.SQUARE);
        this.tileSprite = new Sprite(tex);
        this.tileSprite.width = this.tileWidth;
        this.tileSprite.height = this.tileHeight;
        this.tileSprite.anchor.set(0.5);

        this.tankObj = _player;

        this.bulletsArray = _bullets;

        this.gameWorld = _parent;

        this.gameWorld.addChild(this.tileSprite);

        this.isActive = true;
    }

    update(){
        
        if(!this.isActive){
            this.next.update();
            return;
        };

        //if colliding player, stop movement
        if(this.isBoxCollision(this.tankObj.tankSprite, this.tileSprite)){
            this.tankObj.isinContactWithTile = this.hitIsFacingTowardsTile();
            if(this.tankObj.isinContactWithTile){
                this.tankObj.onHitTile()
            }
        }

        //if colliding bullet do relevant response
        this.bulletsArray.forEach(bullet => {
            if(bullet.isActive && this.isBoxCollision(bullet.bulletSprite, this.tileSprite)){
                this.onHitBullet(bullet);
            }
        });

        if(!this.next) return;
        this.next!.update();
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
        // console.log(dot>0);
        return  dot > 0;
        
    }

    onHitBullet(_bullet : Bullet){

    }
}

export class HayTile extends Tile {
    Health = 100;
    healthTxt : Text;

    constructor(_spritesheet: Texture, _player : TankManager, _bullets : Bullet[], _parent:Container){
        super(_spritesheet, _player, _bullets, _parent);
        this.tileSprite.tint = 0X66aa66;
        this.healthTxt = new Text(this.Health, {fill: 0Xffffff, fontSize: '20px', fontWeight:'700'});
        this.healthTxt.anchor.set(0.5);
        this.tileSprite.addChild(this.healthTxt)
    }

    onHitBullet(_bullet : Bullet): void {
        if(!this.isActive) return;

        _bullet.onCollision();

        if (this.Health -_bullet.damage > 0) {
            this.Health -= _bullet.damage;
            this.healthTxt.text = this.Health;
            return;
        }

        this.gameWorld.removeChild(this.tileSprite);
        this.isActive = false;
    }
}

export class WallTile extends Tile {
    constructor(_spritesheet: Texture, _player : TankManager, _bullets : Bullet[], _parent:Container){
        super(_spritesheet, _player, _bullets, _parent);
        this.tileSprite.tint = 0Xcc6666;
    }

    onHitBullet(_bullet : Bullet): void {
        // console.log("wall");
        
        _bullet.onCollision();
    }
}