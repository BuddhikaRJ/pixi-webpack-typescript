import { Container, Texture } from "pixi.js";
import { Bullet } from "./Bullet";
import { CONFIG } from "./gameConfig";
import { TankManager } from "./TankManager";
import { HayTile, Tile, WallTile } from "./Tile";

export class TileManager {
    tileLinkedListHead!: Tile;
    tileLinkedListTail! : Tile;
    tileListLength = 0;

    hayTileCount = 25;
    wallTileCount = 50;
    totalTiles = this.hayTileCount + this.wallTileCount;

    tilePosArray : { x: number; y: number; }[];
    tilesArray : Tile [] = [];

    tileHeight = 35;
    tileWidth = 35;

    loopIndex = 0;

    constructor(_spritesheet : Texture, _player : TankManager, _bullets : Bullet[], _parent : Container){
        this.tilePosArray = this.generateRandomPositions(CONFIG.RENDERER_WIDTH, CONFIG.RENDERER_HEIGHT, _player);

        for (this.loopIndex = 0; this.loopIndex < this.hayTileCount; this.loopIndex++) {
            let tile = new HayTile(_spritesheet, _player, _bullets, _parent)
            this.appendTileToList(tile);
            this.tilesArray.push(tile);
        }

        for (this.loopIndex = 0; this.loopIndex < this.wallTileCount; this.loopIndex++) {
            let walltile = new WallTile(_spritesheet, _player, _bullets, _parent);
            this.appendTileToList(walltile);
            this.tilesArray.push(walltile);
        }

        for (this.loopIndex = 0; this.loopIndex < this.totalTiles; this.loopIndex++) {
            this.tilesArray[this.loopIndex].tileSprite.position.set(this.tilePosArray[this.loopIndex].x, this.tilePosArray[this.loopIndex].y)
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
        this.tileLinkedListHead.update();
    }

    generateRandomPositions(_grid_width: number, _grid_height: number, _player: TankManager) {
        const positions = [];
        const playerpos = _player.tankSprite.x+','+_player.tankSprite.y;
        //add player pos to set and avoid overlapping player position
        const takenPositions = new Set([playerpos]);
        const totalTiles = this.wallTileCount + this.hayTileCount;
        while (positions.length < totalTiles) {
            var x = Math.floor(Math.random() * (_grid_width / this.tileWidth)) * this.tileWidth + (this.tileWidth / 2);
        var y = Math.floor(Math.random() * (_grid_height / this.tileHeight)) * this.tileHeight + (this.tileHeight / 2);
            const position = x + ',' + y;
            if (!takenPositions.has(position)) {
                takenPositions.add(position);
                positions.push({x: x, y: y});
            }
        }
        
        return positions;
    }
}