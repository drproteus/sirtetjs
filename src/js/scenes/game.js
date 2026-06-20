import Phaser from "phaser"
import { Piece, t } from "../lib/pieces"

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

    this.piece = this.getRandomPiece(0, 0)
    this.buttonCWRotate = this.input.keyboard.addKey("X")
    this.buttonCCWRotate = this.input.keyboard.addKey("C")
    this.cursors = this.input.keyboard.createCursorKeys()
    this.movingX = false;
    this.rotating = false;
    this.pieceLayer.putTilesAt(this.piece.render(), this.piece.x, this.piece.y)
  }
  update(t, delta) {
    let newX = this.piece.x
    let newY = this.piece.y
    let step = delta / 1000.0
    // increase falltime by factor of 4 if "down" is held down
    this.fallTime += (this.cursors.down.isDown ? 4 : 1) * step
    if (this.fallTime >= this.fallSpeed) {
      if (this.piece.checkContact()) {
        console.log("Contact!")
        // TODO add a timer and countdown to give some time before the piece is written to playfield
        this.commitPiece()
        this.piece = this.getRandomPiece(0, 0)
        return
      }
      else
        newY += 1
      this.fallTime = 0
    }
    if (!this.movingX) {
      if (this.cursors.right.isDown) {
        if (this.piece.canMoveRight())
          newX += 1;
        else
          console.log("Collision to the right!")
        this.movingX = true;
      } else if (this.cursors.left.isDown) {
        if (this.piece.canMoveLeft())
          newX -= 1;
        else
          console.log("Collision to the left!")
        this.movingX = true;
      }
    } else if (this.cursors.right.isUp && this.cursors.left.isUp)
      this.movingX = false;
    this.piece.x = newX
    this.piece.y = newY
    if (!this.rotating) {
      if (this.buttonCWRotate.isDown) {
        if (this.piece.canRotateCW()) {
          this.rotateCW()
          this.rotating = true
        }
      } else if (this.buttonCCWRotate.isDown) {
        if (this.piece.canRotateCCW()) {
          this.rotateCCW()
          this.rotating = true
        }
      }
    } else if (this.buttonCCWRotate.isUp && this.buttonCWRotate.isUp)
      this.rotating = false
    // redraw piece
    this.playfieldMap.destroyLayer(this.pieceLayer)
    this.pieceLayer = this.playfieldMap.createBlankLayer(1, this.playfieldTiles, 16, 0)
    this.pieceLayer.putTilesAt(this.piece.render(), this.piece.x, this.piece.y)
  }
  getRandomPiece(x, y) {
    // TODO use appropriate stats distribution for new pieces
    let i = Math.floor(Math.random() * t.length);
    let p = new Piece(t[i], this.playfield)
    p.x = x
    p.y = y
    return p
  }
  rotateCW() {
    console.log("Rotating CW")
    if (this.piece.canRotateCW())
      this.piece.rotateCW()
    else
      console.log("CW rotate blocked, would collide!")
  }
  rotateCCW() {
    console.log("Rotating CCW")
    if (this.piece.canRotateCCW())
      this.piece.rotateCCW()
    else
      console.log("CCW rotate blocked, would collide!")
  }
  commitPiece() {
    console.log("Applying piece to playfield")
    let r = this.piece.render()
    for (let i = 0; i < r[0].length; i++) {
      for (let j = 0; j < r.length; j++) {
        if (r[j][i] < 0) continue
        this.playfield[this.piece.y + j][this.piece.x + i] = r[j][i]
      }
    }
    this.playfieldLayer.putTilesAt(this.playfield, 0, 0)
  }
}

export { GameScene }
