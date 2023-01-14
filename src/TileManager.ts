import { Container, Texture } from "pixi.js";
import { Bullet } from "./Bullet";
import { CONFIG } from "./gameConfig";
import { TankManager } from "./TankManager";
import { HayTile, Tile, WallTile } from "./Tile";

export class TileManager {
    tileLinkedListHead : Tile | undefined;
    tileLinkedListTail : Tile | undefined;
    tileListLength = 0;

    hayTileCount = 25;
    wallTileCount = 50;
    totalTiles = this.hayTileCount + this.wallTileCount;

    tilePosArray : { x: number; y: number; }[];
    tilesArray : Tile [];

    tileHeight = 35;
    tileWidth = 35;

    constructor(_spritesheet : Texture, _player : TankManager, _bullets : Bullet[], _parent : Container){
        this.tilePosArray = this.generateRandomPositions(CONFIG.RENDERER_WIDTH, CONFIG.RENDERER_HEIGHT, _player);

        this.tilesArray = [];

        for (let index = 0; index < this.hayTileCount; index++) {
            let tile = new HayTile(_spritesheet, _player, _bullets, _parent)
            this.appendTileToList(tile);
            this.tilesArray.push(tile);
        }

        for (let index = 0; index < this.wallTileCount; index++) {
            let walltile = new WallTile(_spritesheet, _player, _bullets, _parent);
            this.appendTileToList(walltile);
            this.tilesArray.push(walltile);
        }

        for (let index = 0; index < this.totalTiles; index++) {
            this.tilesArray[index].tileSprite.position.set(this.tilePosArray[index].x, this.tilePosArray[index].y)
        }
    }

    appendTileToList(_tile : Tile) {
        if(!this.tileLinkedListHead){
            this.tileLinkedListHead = _tile
            this.tileLinkedListTail = this.tileLinkedListHead;
        }

        else {
            this.tileLinkedListTail!.next = _tile
            this.tileLinkedListTail =_tile
        }

        this.tileListLength ++;
    }

    update(){
        this.tileLinkedListHead?.update();
    }

    generateRandomPositions(grid_width: number, grid_height: number, player: TankManager) {
        const positions = [];
        const playerpos = player.tankSprite.x+','+player.tankSprite.y;
        const takenPositions = new Set([playerpos]);
        const totalTiles = this.wallTileCount + this.hayTileCount;
        while (positions.length < totalTiles) {
            var x = Math.floor(Math.random() * (grid_width / this.tileWidth)) * this.tileWidth + (this.tileWidth / 2);
        var y = Math.floor(Math.random() * (grid_height / this.tileHeight)) * this.tileHeight + (this.tileHeight / 2);
            const position = x + ',' + y;
            if (!takenPositions.has(position)) {
                takenPositions.add(position);
                positions.push({x: x, y: y});
            }
        }
        console.log(positions);
        
        return positions;
    }
}