import Phaser from "phaser"

class MainMenu extends Phaser.Scene {
  constructor() {
    super({ key: "menuScene" })
    this.singlePlayerSelected = true;
  }
  preload() {
    this.load.image("menu", "assets/main-menu.png")
    this.load.audio("title", "assets/title.mp3")
    this.load.image("select", "assets/select.png")
  }
  create() {
    this.add.image(80, 72, "menu")
    this.selectArrow = this.add.sprite(10, 117, "select")
    // this.sound.play("title")
    this.cursors = this.input.keyboard.createCursorKeys()
  }
  update() {
    if (this.cursors.right.isDown) {
      this.selectArrow.x = 89
      this.singlePlayerSelected = false;
    } else if (this.cursors.left.isDown) {
      this.selectArrow.x = 10
      this.singlePlayerSelected = true;
    } else if (this.singlePlayerSelected && this.cursors.space.isDown) {
      this.scene.start("gameScene")
    }
  }
}

export { MainMenu }
