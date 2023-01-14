import { Container, Loader} from "pixi.js";
import { CONFIG } from "./gameConfig";
import { Gun } from "./Gun";
import { TankManager } from "./TankManager";
import { TileManager } from "./TileManager";

export class GameManager {
    gameWorld: Container;
    assetLoader: Loader;
    stage: Container;
    tankManager : TankManager;
    gun : Gun;
    tileManager : TileManager;

    constructor(_assets: Loader, _stage: Container) {
        this.gameWorld = new Container();
        this.assetLoader = _assets;
        this.stage = _stage;

        const tex = this.assetLoader.resources[CONFIG.ASSETS.game_sprite].texture;
        
        this.tankManager = new TankManager(tex!, this.gameWorld);

        this.gun = new Gun(tex!, this.gameWorld, this.tankManager);

        this.tileManager = new TileManager(tex!, this.tankManager, this.gun.bulletsArray, this.gameWorld);

    }

    update(dt: number){
        this.tileManager.update();
        
        this.tankManager.update(dt);

        this.gun.update(dt); 

    }
}