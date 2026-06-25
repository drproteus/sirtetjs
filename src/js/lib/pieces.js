// https://tetris.wiki/Nintendo_Rotation_System
const t = ["i", "o", "j", "l", "s", "t", "z"];
const T = {
  "i": [
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ]
  ],
  "o": [
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ]
  ],
  "j": [
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
  ],
  "l": [
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0],
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
  ],
  "s": [
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  "t": [
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
    ],
  ],
  "z": [
    [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0],
    ],
  ],
}

class Piece {
  constructor(shape, playfield) {
    this.index = 0
    this.shape = shape
    this.rotations = T[shape]
    this.x = 0
    this.y = 0
    this.playfield = playfield
  }
  getShape() {
    return this.rotations[this.index]
  }
  getCWIndex() {
    return (this.index + 1) % this.rotations.length;
  }
  getCCWIndex() {
    let i = (this.index - 1) % this.rotations.length;
    if (i < 0) i = i + this.rotations.length;
    return i;
  }
  rotateCW() {
    this.index = this.getCWIndex();
  }
  rotateCCW() {
    this.index = this.getCCWIndex();
  }
  getTilemapIndex(x, y) {
    if (this.getShape()[y][x] == 0) {
      return -1
    }
    if (this.shape !== "i") {
      switch (this.shape) {
        case "o":
          return 5
        case "j":
          return 6
        case "l":
          return 9
        case "s":
          return 8
        case "t":
          return 6
        case "z":
          return 10
      }
    } else {
      if (this.index == 0) {
        // Horizontal
        switch (x) {
          case 0:
            return 0
          case 1:
            return 1
          case 2:
            return 1
          case 3:
            return 2
        }
      } else {
        // Vertical
        switch (y) {
          case 0:
            return 3
          case 1:
            return 7
          case 2:
            return 7
          case 3:
            return 11
        }
      }
    }
  }
  render() {
    let s = this.getShape()
    // Copy the rotation so we're not editing it directly.
    let r = s.slice().map((arr) => arr.slice())
    for (let i = 0; i < r.length; i++) {
      for (let j = 0; j < r[0].length; j++) {
        r[i][j] = this.getTilemapIndex(j, i)
      }
    }
    return r;
  }
  checkContact() {
    let s = this.getShape()
    for (let i = 0; i < s[0].length; i++) {
      for (let j = 0; j < s.length; j++) {
        if (s[j][i] < 1) continue
        if (this.y + j < 0) continue
        if (this.y + j + 1 >= this.playfield.length) {
          // floor hit
          return true
        } else if (this.playfield[this.y + j + 1][this.x + i] != -1) {
          // touching an occupied cell
          return true
        }
      }
    }
    return false
  }
  canMoveRight() {
    let s = this.getShape()
    for (let i = 0; i < s[0].length; i++) {
      for (let j = 0; j < s.length; j++) {
        if (s[j][i] < 1) continue
        if (this.y + j < 0) continue
        if (this.x + i + 1 >= this.playfield[0].length) {
          // wall to the left of current block
          return false
        } else if (this.playfield[this.y + j][this.x + i + 1] != -1) {
          // collide with occupied cell
          return false
        }
      }
    }
    return true
  }
  canMoveLeft() {
    let s = this.getShape()
    for (let i = 0; i < s[0].length; i++) {
      for (let j = 0; j < s.length; j++) {
        if (s[j][i] < 1) continue
        if (this.y + j < 0) continue
        if (this.x + i - 1 < 0) {
          // wall to the left of current block
          return false
        } else if (this.playfield[this.y + j][this.x + i - 1] != -1) {
          // collide with occupied cell
          return false
        }
      }
    }
    return true
  }
  canRotateCW() {
    return this.canRotateToIndex(this.getCWIndex())
  }
  canRotateCCW() {
    return this.canRotateToIndex(this.getCCWIndex())
  }
  canRotateToIndex(i) {
    let s = this.rotations[this.getCWIndex()]
    for (let i = 0; i < s[0].length; i++) {
      for (let j = 0; j < s.length; j++) {
        if (s[j][i] < 1) continue
        if (this.y + i < 0) continue
        if (this.x + i < 0) {
          // would rotate into left wall
          return false
        } else if (this.x + i >= this.playfield[0].length) {
          // would rotate into right wall
          return false
        } else if (this.y + j >= this.playfield.length) {
          // would rotate beneath playfield floor
          return false
        } else if (this.playfield[this.y + j][this.x + i] != -1) {
          // would rotate into occupied cell
          return false
        }
      }
    }
    return true
  }
}

export { Piece, T, t }
