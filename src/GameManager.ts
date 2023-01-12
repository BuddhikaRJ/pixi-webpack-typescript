import { BaseTexture, Container, Loader, Rectangle, Sprite, Texture } from "pixi.js";
import { CONFIG } from "./gameConfig";
import { Gun } from "./Gun";
import { Keyboard } from "./Keyboard";
import { TankManager } from "./TankManager";

export class GameManager {
    gameWorld: Container;
    assetLoader: Loader;
    stage: Container;
    tankManager : TankManager;
    gun : Gun;

    constructor(_assets: Loader, _stage: Container) {
        this.gameWorld = new Container();
        this.assetLoader = _assets;
        this.stage = _stage;

        let tex = this.assetLoader.resources[CONFIG.ASSETS.game_sprite].texture;
        this.tankManager = new TankManager(tex!, this.gameWorld);
        this.gameWorld.addChild(this.tankManager.tankSprite);

        this.gun = new Gun(tex!, this.gameWorld, this.tankManager);
        
    }

    update(dt: number){
        
        this.tankManager.update(dt);

        this.gun.update(dt);
    }
}