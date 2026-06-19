import Phaser from "phaser"
import { Piece, ZPiece, SPiece, IPiece, LPiece, JPiece, OPiece } from "../lib/pieces"

const EVENT = {
  NO_COLLISIONS: 0,
  LEFT_WALL_COLLIDE: 1,
  RIGHT_WALL_COLLIDE: 2,
  FLOOR_COLLIDE: 3,
  TILE_COLLIDE: 4,
}

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "gameScene" })
    this.widthTiles = 10;
    this.heightTiles = 18;
    this.playfield = [
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    ]
    this.fallTime = 0
    this.fallSpeed = 0.5 // seconds per cell fall
  }
  preload() {
    this.load.image("field", "assets/field.png")
    this.load.audio("type-a", "assets/type-a.mp3")
    this.load.image("blocks", "assets/block-map.png")
  }
  create() {
    this.sound.stopAll()
    this.sound.play("type-a")
    this.add.image(80, 72, "field")

    this.playfieldMap = this.make.tilemap({ data: this.playfield, tileWidth: 8, tileHeight: 8 })
    this.playfieldTiles = this.playfieldMap.addTilesetImage("blocks")
    this.playfieldLayer = this.playfieldMap.createLayer(0, this.playfieldTiles, 16, 0)
    this.pieceLayer = this.playfieldMap.createBlankLayer(1, this.playfieldTiles, 16, 0)

    this.piece = new JPiece()
    this.piece.x = 0
    this.piece.y = 0
    this.input.keyboard.on("keydown-X", this.rotateCW, this)
    this.input.keyboard.on("keydown-C", this.rotateCCW, this)
    this.cursors = this.input.keyboard.createCursorKeys()
    this.movingX = false;
  }
  update(t, delta) {
    let newX = this.piece.x
    let newY = this.piece.y
    this.fallTime += delta / 1000.0
    if (this.fallTime >= this.fallSpeed) {
      newY += 1
      this.fallTime = 0
    }
    if (!this.movingX) {
      if (this.cursors.right.isDown) {
        newX += 1;
        this.movingX = true;
      } else if (this.cursors.left.isDown) {
        newX -= 1;
        this.movingX = true;
      }
    } else if (this.cursors.right.isUp && this.cursors.left.isUp) {
      this.movingX = false;
    }
    if (this.checkCollisions(newX, newY)) {
      console.log("COLLISIONS!")
      this.movingX = false
      return
    }
    this.piece.x = newX
    this.piece.y = newY
    this.playfieldMap.destroyLayer(this.pieceLayer)
    this.pieceLayer = this.playfieldMap.createBlankLayer(1, this.playfieldTiles, 16, 0)
    this.pieceLayer.putTilesAt(this.piece.render(), this.piece.x, this.piece.y)
  }
  checkCollisions(x, y) {
    let s = this.piece.getShape()
    for (let i = 0; i < s[0].length; i++) {
      for (let j = 0; j < s.length; j++) {
        if (s[j][i] < 1) continue
        if (x + i < 0) {
          // collides with left side of playfield
          console.log("Collide with LEFT")
          return EVENT.LEFT_WALL_COLLIDE
        } else if (x + i >= this.widthTiles) {
          // collides with right side of playfield
          console.log("Collide with RIGHT")
          return EVENT.RIGHT_WALL_COLLIDE
        } else if (y + j + 1 > this.heightTiles) {
          // hit the floor of the playfield
          console.log("Collid with FLOOR")
          return EVENT.FLOOR_COLLIDE
        } else if (this.playfield[y + j][x + i] != -1) {
          // collides with filled tile
          // TODO treat this special?
          console.log("Collide with TILE", x + i, y + j, this.playfield[x + i][y + j])
          return EVENT.TILE_COLLIDE
        }
      }
    }
    return EVENT.NO_COLLISIONS
  }
  rotateCW() {
    console.log("Rotating CW")
    this.piece.rotateCW()
  }
  rotateCCW() {
    console.log("Rotating CCW")
    this.piece.rotateCCW()
  }
}

export { GameScene }
