const cvs = document.getElementById("canvas");
const cvs2 = document.getElementById("canvas2");
const Start = document.getElementById("Button");
const reStart = document.getElementById("Button1");
const tScrin1 = document.getElementById("tuchScrin");
const tScrin2 = document.getElementById("tuchScrin2");
const tScrin3 = document.getElementById("tuchScrin3");
const single = document.getElementById("single");
const Score = document.querySelector(".SCORE");
const nextTxt = document.querySelector(".next");
const EndScore = document.getElementById('i');
const TextX = document.querySelectorAll('.into');
const ctx = cvs.getContext("2d");
const ctx2 = cvs2.getContext("2d");

// intro
let sourav = 0,
  barui = 0,
  fps = 0;
 
//  TextX[0].innerHTML = ""

function gg() {
  sourav += 1;
  if (sourav == 1) {
    tScrin1.style.background = "#000000d0";
    tScrin1.style.animation = "ani linear 3s";
    TextX[0].innerHTML = "Press This Line To Go Left";
  }
  if (sourav == 170 - fps) {
    barui += 1;
    if (barui == 1) {
      TextX[0].innerHTML = "";
      TextX[1].innerHTML = "Press This Line To Go Down";
      tScrin2.style.background = "#000000d0";
      tScrin2.style.animation = "ani linear 3s";
    } else if (barui == 2) {  
      tScrin3.style.background = "#000000d0";
      tScrin3.style.animation = "ani linear 3s";
      TextX[1].innerHTML = "";
      TextX[2].innerHTML = "Press This Line To Go Right";
    } else if (barui == 3) {
      TextX[2].innerHTML = "";
      tScrin1.style.animation = "";
      tScrin1.style.animation = "ani2 linear 3s";
      tScrin2.style.animation = "";
      tScrin2.style.animation = "ani2 linear 3s";
      tScrin3.style.animation = "";
      tScrin3.style.animation = "ani2 linear 3s";
      single.style.zIndex = 6;
    }else if (barui >= 4) {
      Start.style.color = randomColor();
      single.style.zIndex = -6;
    }
    sourav = 2;
  }
  requestAnimationFrame(gg);
}
gg(); 

function GameOver(){
  EndScore.innerHTML = "Your Score : " + score;
  reStart.style.zIndex = "5";
}
function forCss() { 
  fps = 170;
  tScrin1.style.background = "transparent";
  tScrin2.style.background = "transparent";
  tScrin3.style.background = "transparent";
  Start.style.zIndex = -2;
  nextTxt.innerHTML = "Next Piece";
  Score.innerHTML = "Score : 0";
  TextX[0].innerHTML = "";
  TextX[1].innerHTML = "";
  TextX[2].innerHTML = "";  
  single.style.zIndex = -6;
}
 
const row = 23;
const col = 13;
const rowCol = 40; 
const sq = 50;  
let score = 0;
let time = 0;

let presentNumber = -1;
let nextNumber = 0;

let presentColor = -1;
let nextColor = 0;

const bg = "#0f0f0f"; // for background color
const bdr = "#0a0a0a"; // for border color

// pieces and color
const PIECES = [Z, S, T, O, L, I, J];

// store next piece
const nextP = [];
// store next color
const nextC = [];

let Nboard = []; 

let board = [];

// for mobile controle

// generate random color
function randomColor() {
  const hex = "0123456789ABCDEF";
  var rColor = "#";
  for (let i = 0; i < 6; i++) {
    rColor += hex[Math.floor(Math.random() * hex.length)];
  }
  return rColor;
}

function allInOne() {
  // The Object pieces
  class Piece {
    constructor(tetromino, color, border) {
      this.tetromino = tetromino;
      this.color = color;
      this.border = border;

      this.tetrominoN = 0; // We start for the first pattern
      this.activeTetromino = this.tetromino[this.tetrominoN];

      // We need to controle the piece
      this.x = 4;
      this.y = -3;
    }

    // fill function
    fill(color, border) {
      for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
          // we draw only occupied squares
          if (this.activeTetromino[r][c]) {
            drawSquare(this.x + c, this.y + r, color, border);
          }
        }
      }
    }

    // Draw a piece to board
    draw() {
      this.fill(this.color, this.border);
    }

    // unDraw the piece to board
    unDraw() {
      drawBoard();
    }

    // Move down the piece
    moveDown() {
      if (!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
        dropStart = Date.now();
      } else {
        // generate new piece
        p.lock();
        p = randomPiece();
        randomNPiece();
        Score.innerHTML = "Score : " + score;
      }
    }

    // Move the piece Right
    moveRight() {
      if (!this.collision(1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
        dropStart = Date.now();
      }
    }

    // Move the piece left
    moveLeft() {
      if (!this.collision(-1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
        dropStart = Date.now();
      }
    }

    // Rotate the piece
    rotate() {
      let nextPattern = this.tetromino[
        (this.tetrominoN + 1) % this.tetromino.length
      ];
      let kick = 0;
      if (this.collision(0, 0, nextPattern)) {
        if (this.x > col / 2) {
          // it's the right wall
          kick = -1;
        } else {
          // it's the left wall
          kick = 1;
        }
      }
      if (!this.collision(kick, 0, nextPattern)) {
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
      }
      dropStart = Date.now();
    }

    // lock the piece
    lock() {
      for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
          // we skip the white square
          if (!this.activeTetromino[r][c]) {
            continue;
          }
          // piece to lock on top then game over
          if (this.y + r < 0) {
            // stop request animation frame
            gameOver = true;
            GameOver();
            break;
          }
          // we lock the piece
          board[this.y + r][this.x + c] = this.color;
        }
      }
      // remove full rows
      for (r = 0; r < row; r++) {
        let fullRow = true;
        for (c = 0; c < col; c++) {
          fullRow = fullRow && board[r][c] != bg;
        }

        if (fullRow) {
          // if the row is full
          // we move sown all the rows above it
          for (let y = r; y > 1; y--) {
            for (c = 0; c < col; c++) {
              board[y][c] = board[y - 1][c];
            }
          }
          // change all piece color
          const newRandomColorForAll = randomColor();
          for (let ro = 0; ro < row; ro++) {
            for (let co = 0; co < col; co++) {
              if (board[ro][co] != bg) {
                board[ro][co] = newRandomColorForAll;
              }
            }
          }

          // the top row board[0][...] has no row avobe it
          for (c = 0; c < col; c++) {
            board[0][c] = bg;
          }
          // increment the score
          score += 10;
          time += 10;
        }
      }
      drawBoard();
    }

    // collision function

    collision(x, y, piece) {
      for (r = 0; r < piece.length; r++) {
        for (c = 0; c < piece.length; c++) {
          // if the square is empty, we skip it
          if (!piece[r][c]) {
            continue;
          }
          // coordinates of the piece after movement
          let newX = this.x + c + x;
          let newY = this.y + r + y;

          // corditions
          if (newX < 0 || newX >= col || newY >= row) {
            return true;
          }

          // skip newY < 0 ; board [-1] crush the game
          if (newY < 0) {
            continue;
          }
          // chack if there is a locked piece alrady in place

          if (board[newY][newX] != bg) {
            return true;
          }
        }
      }
      return false;
    }
  }

  function Ndraw(piece, color, bdr) {
    let pieceN = piece[0];
    for (r = 0; r < piece[0].length; r++) {
      for (c = 0; c < piece[0].length; c++) {
        // we draw only occupied squares
        if (pieceN[r][c]) {
          drawNpiece(c, r, color, bdr); // for show next piece
        }
      }
    }
  }

  // Draw a Square
  function drawSquare(x, y, color, border) {
    ctx.fillStyle = color;
    ctx.fillRect(x * sq, y * sq, sq, sq);

    ctx.strokeStyle = border;
    ctx.strokeRect(x * sq, y * sq, sq, sq);
  }

  function drawNpiece(x, y, color, border) {
    ctx2.fillStyle = color;
    ctx2.fillRect(x * rowCol, y * rowCol, rowCol, rowCol);

    ctx2.strokeStyle = border;
    ctx2.strokeRect(x * rowCol, y * rowCol, rowCol, rowCol);
  }

  // create piece show board
  for (r = 0; r < 5; r++) {
    Nboard[r] = [];
    for (c = 0; c < 5; c++) {
      Nboard[r][c] = "white";
    }
  }

  // Draw piece show board
  function drawNboard() {
    for (r = 0; r < 5; r++) {
      for (c = 0; c < 6; c++) {
        ctx2.clearRect(0, 0, 300, 300);
        drawNpiece(c, r, Nboard[r][c], bdr);
      }
    }
  }
  drawNboard();

  // Create a the board
  for (r = 0; r < row; r++) {
    board[r] = [];
    for (c = 0; c < col; c++) {
      board[r][c] = bg;
    }
  }

  // Draw the board
  function drawBoard() {
    for (r = 0; r < row; r++) {
      for (c = 0; c < col; c++) {
        drawSquare(c, r, board[r][c], bdr);
      }
    }
  }

  drawBoard();

  // push random number
  function pushRandomNumberAndColor() {
    nextP.push(Math.floor(Math.random() * PIECES.length));
    nextC.push(randomColor());
  }
  pushRandomNumberAndColor();

  // generate random pieces
  function randomPiece() {
    pushRandomNumberAndColor();
    presentNumber += 1; // present index number
    presentColor += 1; // present index number
    return new Piece(
      PIECES[nextP[presentNumber]],
      nextC[presentColor],
      randomColor()
    );
  }
  let p = randomPiece();

  // generate random pieces
  function randomNPiece() {
    nextNumber += 1; // next index number
    nextColor += 1; // next index number
    drawNboard();
    Ndraw(PIECES[nextP[nextNumber]], nextC[nextColor], randomColor());
  }
  randomNPiece();

  // control the piece
  document.addEventListener("keydown", (e) => {
    if (e.keyCode == 37) {
      p.moveLeft();
    } else if (e.keyCode == 39) {
      p.moveRight();
    } else if (e.keyCode == 40) {
      p.moveDown();
    } else if (e.keyCode == 38) {
      p.rotate();
    }
  }); 

  // Drop the piece every 1sec
  let dropStart = Date.now();
  function drop() {
    gameOver = false;
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > 1000 - time) {
      p.moveDown();
      dropStart = Date.now();
    }
    if (!gameOver) {
      requestAnimationFrame(drop);
    }
  }

  drop();

  // for scrin touch control
  let bs = false;
  let s = 10;
  let a = 0;
  let b = 0;
  let mx = "none";
  tScrin1.addEventListener("touchstart", () => {
    mx = "Left";
    bs = true;
    update();
  });

  tScrin2.addEventListener("touchstart", () => {
    mx = "Down";
    bs = true;
    update();
  });

  tScrin3.addEventListener("touchstart", () => {
    mx = "Right";
    bs = true;
    update();
  });

  tScrin1.addEventListener("touchend", () => {
    end();
  });
  tScrin2.addEventListener("touchend", () => {
    end();
  });
  tScrin3.addEventListener("touchend", () => {
    end();
  });

  function end() {
    bs = false;
    s = 10;
    update();
    if (b < 10) {
      p.rotate();
    }
    b = 0;
    a = 0;
  }

  function update() {
    if (!gameOver) {
      a += 1;
      b += 1;
      if (a == s) {
        if (mx == "Down") {
          p.moveDown();
        } else if (mx == "Left") {
          p.moveLeft();
        } else if (mx == "Right") {
          p.moveRight();
        }
        a = 0;
        s = 5;
      }
      if (bs) {
        requestAnimationFrame(update);
      }
    }
  }
}

Start.addEventListener("click", () => {
  allInOne();
  forCss();
});
