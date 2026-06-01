import Phaser from "phaser"

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
    this.load.image("blocks", "assets/debug-block-map.png")
  }
  create() {
    this.sound.stopAll()
    this.sound.play("type-a")
    this.add.image(80, 72, "field")

    this.playfieldMap = this.make.tilemap({ data: this.playfield, tileWidth: 8, tileHeight: 8 })
    const tiles = this.playfieldMap.addTilesetImage("blocks")
    const layer = this.playfieldMap.createLayer(0, tiles, 16, 0)
  }
  update() {
    // Get a random tile, fill if empty or increment it's tile index.
    let x = Math.floor(Math.random() * this.widthTiles)
    let y = Math.floor(Math.random() * this.heightTiles)
    let v = this.playfieldMap.getTileAt(x, y)
    let n = 1;
    if (v) {
      n = (v.index + 1) % 3
    }
    this.playfieldMap.putTileAt(n, x, y)
    // Delete a random tile
    x = Math.floor(Math.random() * this.widthTiles)
    y = Math.floor(Math.random() * this.heightTiles)
    this.playfieldMap.removeTileAt(x, y)
  }
}

export { GameScene }
