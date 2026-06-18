import Phaser from "phaser"
import { Piece, ZPiece, SPiece, IPiece, LPiece, JPiece, OPiece } from "../lib/pieces"

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
  }
  update(t, delta) {
    this.fallTime += delta / 1000.0
    if (this.fallTime >= this.fallSpeed) {
      this.piece.y += 1
      this.fallTime = 0
    }
    this.playfieldMap.destroyLayer(this.pieceLayer)
    this.pieceLayer = this.playfieldMap.createBlankLayer(1, this.playfieldTiles, 16, 0)
    this.pieceLayer.putTilesAt(this.piece.render(), this.piece.x, this.piece.y)
  }
  checkCollisions(newX, newY) {
    return false
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
