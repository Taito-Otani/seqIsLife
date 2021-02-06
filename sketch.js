var s = function(p) {
  var v1 = 0;
  var v2 = 0;
  var v3 = 0;
  let w;
  let columns;
  let rows;
  let board;
  let next;
  let pos = 0;
  let cWhite;
  let cBlack;
  let cBlue;
  let cOrange;

  //--------------- Setup ---------------------
  p.setup = function() {
    p.createCanvas(innerWidth, innerHeight);
    initColor();

    // Calculate columns and rows
    p.frameRate(12);
    columns = 16;
    rows = 8;
    w = p.width / 16;
    // Wacky way to make a 2D array is JS
    board = new Array(columns);
    for (let i = 0; i < columns; i++) {
      board[i] = new Array(rows);
    }
    // Going to use multiple 2D arrays and swap them
    next = new Array(columns);
    for (i = 0; i < columns; i++) {
      next[i] = new Array(rows);
    }
    init();
    // カンマ区切りで入力したい値を追加できます。
    window.max.bindInlet('set_value', function(_v1, _v2, _v3) {
      if(_v1 > columns){return}
      pos = _v1;
      v2 = _v2;
      v3 = _v3;
    });
  };

  //--------------- Draw ---------------------
  p.draw = function() {
    // カンマ区切りで出力したい値を追加できます。
    p.background(cWhite);
    generate();
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        if ((board[i][j] == 1)) p.fill(cOrange);
        else p.fill(cWhite);
        p.stroke(cBlack);
        p.rect(i * w, j * w, w - 1, w - 1);
      }
    }
    p.fill(cBlue, 30);
    p.rect(pos * w, 0, w, w * rows);
    // p.print(board[pos][0], board[pos][1], board[pos][2], board[pos][3])

    window.max.outlet('output', board[pos][0], board[pos][1], board[pos][2], board[pos][3],board[pos][4],board[pos][5],board[pos][6],board[pos][7]);

  };

  initColor = function() {
    cWhite = p.color(80, 80, 80, 100);
    cBlack = p.color(29, 21, 15);
    cBlue = p.color(255, 55, 26, 50);
    cOrange = p.color(255, 141, 46);
  };
  //--------------- ReSize---------------------
  //画面サイズの自動調整
  p.windowResized = function() {
    p.resizeCanvas(innerWidth, innerHeight);
  }


  // reset board when mouse is pressed
  p.mousePressed = function() {
    if (p.mouseButton === p.RIGHT) {
      let posX = p.floor(p.map(p.mouseX, 0, p.width, 0, columns));
      let posY = p.floor(p.map(p.mouseY, 0, p.height, 0, rows));
      board[posX][posY] = 1;
    } else {
      init();
    }
  };

  // Fill board randomly
  init = function() {
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        // Lining the edges with 0s
        if (i == 0 || j == 0 || i == columns - 1 || j == rows - 1) board[i][j] = 0;
        // Filling the rest randomly
        else board[i][j] = p.floor(p.random(2));
        next[i][j] = 0;
      }
    }
  };

  // The process of creating the new generation
  generate = function() {

    // Loop through every spot in our 2D array and check spots neighbors
    for (let x = 1; x < columns - 1; x++) {
      for (let y = 1; y < rows - 1; y++) {
        // Add up all the states in a 3x3 surrounding grid
        let neighbors = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            neighbors += board[x + i][y + j];
          }
        }

        // A little trick to subtract the current cell's state since
        // we added it in the above loop
        neighbors -= board[x][y];
        // Rules of Life
        if ((board[x][y] == 1) && (neighbors < 2)) next[x][y] = 0; // Loneliness
        else if ((board[x][y] == 1) && (neighbors > 3)) next[x][y] = 0; // Overpopulation
        else if ((board[x][y] == 0) && (neighbors == 3)) next[x][y] = 1; // Reproduction
        else next[x][y] = board[x][y]; // Stasis
      }
    };

    // Swap!
    let temp = board;
    board = next;
    next = temp;
  };
};

const myp5 = new p5(s);
