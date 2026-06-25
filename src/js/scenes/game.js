import Phaser from "phaser"
import { Piece, t } from "../lib/pieces"

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "gameScene" })
  }
  preload() {
    this.load.image("field", "assets/field.png")
    this.load.audio("type-a", "assets/type-a.mp3")
    this.load.image("blocks", "assets/block-map.png")

    this.load.bitmapFont("tetris", "assets/tetris_1.png", "assets/tetris.xml")
  }
  create() {
    this.widthTiles = 10;
    this.heightTiles = 20;
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
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    ]
    this.fallTime = 0
    this.fallSpeed = 0.5 // seconds per cell fall
    // this.sound.stopAll()
    // this.sound.play("type-a")
    this.add.image(80, 72, "field")

    this.scoreText = this.add.bitmapText(8 * (this.widthTiles + 4), 8 * 3, "tetris", "0")
    this.levelText = this.add.bitmapText(8 * (this.widthTiles + 5), 8 * 7, "tetris", "0")
    this.linesText = this.add.bitmapText(8 * (this.widthTiles + 5), 8 * 10, "tetris", "0")


    this.playfieldMap = this.make.tilemap({ data: this.playfield, tileWidth: 8, tileHeight: 8 })
    this.playfieldTiles = this.playfieldMap.addTilesetImage("blocks")
    this.playfieldLayer = this.playfieldMap.createLayer(0, this.playfieldTiles, 16, -16)
    this.pieceLayer = this.playfieldMap.createBlankLayer(1, this.playfieldTiles, 16, -16)

    this.spawnPosition = [(this.widthTiles / 2) - 2, 0]

    this.piece = this.getRandomPiece(this.spawnPosition[0], this.spawnPosition[1])
    this.buttonCWRotate = this.input.keyboard.addKey("C")
    this.buttonCCWRotate = this.input.keyboard.addKey("X")
    this.cursors = this.input.keyboard.createCursorKeys()
    this.movingX = false;
    this.rotating = false;
    this.pieceLayer.putTilesAt(this.piece.render(), this.piece.x, this.piece.y)

    this.linesCleared = 0;
    this.score = 0;
    this.level = 0;
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
        if (this.checkBlockOut()) {
          alert("BLOCK OUT");
          this.scene.restart();
          return
        }
        this.piece = this.getRandomPiece(this.spawnPosition[0], this.spawnPosition[1])
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
    this.pieceLayer = this.playfieldMap.createBlankLayer(1, this.playfieldTiles, 16, -16)
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
    this.checkLines();
  }
  checkLines() {
    console.log("Checking lines for completion")
    this.playfield = this.playfield.filter((row) => {
      for (let i = 0; i < row.length; i++) {
        if (row[i] == -1) {
          return true
        }
      }
      return false
    });
    let linesCompleted = this.heightTiles - this.playfield.length;
    if (linesCompleted < 1) return
    console.log(`Cleared ${linesCompleted} lines`)
    for (let i = 0; i < linesCompleted; i++) {
      this.playfield.unshift(this.getBlankLine());
    }
    this.playfieldLayer.putTilesAt(this.playfield, 0, 0);
    this.linesCleared += linesCompleted
    this.updateScore(linesCompleted)
    console.log("Lines: ", this.linesCleared);
    console.log("Score: ", this.score);
  }
  getBlankLine() {
    return [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
  }
  updateScore(n) {
    let m = 0;
    switch (n) {
      case 1:
        m = 40;
        break;
      case 2:
        m = 100;
        break;
      case 3:
        m = 300;
        break;
      case 4:
        m = 1000;
        break;
    }
    this.score += m * (this.level + 1)
    this.scoreText.text = this.score
    this.linesText.text = n
  }
  checkBlockOut() {
    // TODO: This doesn't seem accurate
    // Consider: (https://tasvideos.org/4536S#Losing)
    let topLine = this.playfield[0];
    for (let i = 0; i < this.widthTiles; i++) {
      if (topLine[i] != -1) {
        return true
      }
    }
    return false
  }
}

export { GameScene }
