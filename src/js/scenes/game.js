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
    this.playfieldMap.setCollisionByExclusion([-1])

    this.piece = new JPiece()
    this.pieceMap = this.make.tilemap({ data: this.piece.render(), tileWidth: 8, tileHeight: 8 })
    this.pieceTiles = this.pieceMap.addTilesetImage("blocks")
    this.pieceLayer = this.pieceMap.createLayer(0, this.pieceTiles, 16, 32)
    this.pieceMap.setCollisionByExclusion([-1], false)

    this.input.keyboard.on("keydown-Z", this.rotateCW, this)
    this.input.keyboard.on("keydown-X", this.rotateCCW, this)
    this.cursors = this.input.keyboard.createCursorKeys()
  }
  update(t, delta) {
    // this.pieceLayer.setY(this.pieceLayer.y += 0.5)
    if (this.cursors.down.isDown) {
      this.pieceLayer.setY(this.pieceLayer.y += 1)
    } else if (this.cursors.up.isDown) {
      this.pieceLayer.setY(this.pieceLayer.y -= 1)
    }
    if (this.cursors.right.isDown) {
      this.pieceLayer.setX(this.pieceLayer.x += 1)
    } else if (this.cursors.left.isDown) {
      this.pieceLayer.setX(this.pieceLayer.x -= 1)
    }
  }
  checkCollisions() {

  }
  rotateCW() {
    console.log("Rotating CW")
    this.piece.rotateCW()
    this.pieceMap.putTilesAt(this.piece.render(), 0, 0)
  }
  rotateCCW() {
    console.log("Rotating CCW")
    this.piece.rotateCCW()
    this.pieceMap.putTilesAt(this.piece.render(), 0, 0)
  }
}

export { GameScene }
