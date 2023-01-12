import { Container, Loader, Rectangle, Sprite } from "pixi.js";
import { CONFIG } from "./gameConfig";
import { Keyboard } from "./Keyboard";

export class GameManager {
    gameWorld: Container;
    assetLoader: Loader;
    stage: Container;
    testSprite: Sprite;

    upKey : Keyboard;

    constructor(_assets: Loader, _stage: Container) {
        this.gameWorld = new Container();
        this.assetLoader = _assets;
        this.stage = _stage;

        this.testSprite = new Sprite(this.assetLoader.resources[CONFIG.ASSETS.game_sprite].texture);
        this.testSprite.texture.frame = new Rectangle(...CONFIG.TEXTURE_COORDS.SQUARE)
        this.gameWorld.addChild(this.testSprite);

        this.upKey = new Keyboard(" ", ()=>{console.log("press")}, ()=>{console.log("release");
        })
        
    }

    update(dt: number){
        this.testSprite.rotation += dt*0.1;
    }
}