import { BaseTexture, Container, Loader, Rectangle, Sprite, Texture } from "pixi.js";
import { CONFIG } from "./gameConfig";
import { Gun } from "./Gun";
import { Keyboard } from "./Keyboard";
import { TankManager } from "./TankManager";
import { HayTile, WallTile } from "./Tile";

export class GameManager {
    gameWorld: Container;
    assetLoader: Loader;
    stage: Container;
    tankManager : TankManager;
    gun : Gun;
    testHayTile1 : HayTile;
    testWallTile : WallTile;

    constructor(_assets: Loader, _stage: Container) {
        this.gameWorld = new Container();
        this.assetLoader = _assets;
        this.stage = _stage;

        let tex = this.assetLoader.resources[CONFIG.ASSETS.game_sprite].texture;
        this.tankManager = new TankManager(tex!, this.gameWorld);
        this.gameWorld.addChild(this.tankManager.tankSprite);

        this.gun = new Gun(tex!, this.gameWorld, this.tankManager);

        this.testHayTile1 = new HayTile(tex!, this.tankManager, this.gun.bulletsArray, this.gameWorld);
        this.testWallTile = new WallTile(tex!, this.tankManager, this.gun.bulletsArray, this.gameWorld);

        this.testHayTile1.tileSprite.position.set(200);
        this.testWallTile.tileSprite.position.set(700)
    }

    update(dt: number){
        this.testHayTile1.update();
        this.testWallTile.update(); 
        
        this.tankManager.update(dt);

        this.gun.update(dt); 

    }
}