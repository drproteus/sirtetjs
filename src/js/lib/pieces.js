// https://tetris.wiki/Nintendo_Rotation_System
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
  constructor(shape) {
    this.index = 0
    this.shape = shape
    this.rotations = T[shape]
    this.x = 0
    this.y = 0
  }
  getShape() {
    return this.rotations[this.index]
  }
  rotateCW() {
    this.index = (this.index + 1) % this.rotations.length;
  }
  rotateCCW() {
    this.index = (this.index - 1) % this.rotations.length;
    if (this.index < 0) {
      this.index = this.index + this.rotations.length;
    }
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
}

class IPiece extends Piece {
  constructor() {
    super("i")
  }
}

class OPiece extends Piece {
  constructor() {
    super("o")
  }
}

class JPiece extends Piece {
  constructor() {
    super("j")
  }
}

class LPiece extends Piece {
  constructor() {
    super("l")
  }
}

class SPiece extends Piece {
  constructor() {
    super("s")
  }
}

class TPiece extends Piece {
  constructor() {
    super("t")
  }
}

class ZPiece extends Piece {
  constructor() {
    super("z")
  }
}

export { Piece, IPiece, OPiece, JPiece, LPiece, SPiece, TPiece, ZPiece }
