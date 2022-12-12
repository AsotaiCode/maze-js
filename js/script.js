// キャンバスを設定 /////////////////////////////////////
let canvas = document.getElementById("maze-canvas");
let context = canvas.getContext("2d");

// 定数定義 ////////////////////////////////////////////
const SCREEN_SIZE_W     = canvas.width;
const SCREEN_SIZE_H     = canvas.height;

const BLOCK_SIZE        = 10;

const BLOCK_IMAGE_PATH  = "images/block.png";
const FLOOR_IMAGE_PATH  = "images/floor.png";

// 変数定義 ////////////////////////////////////////////


// 画像を取得 //////////////////////////////////////////
let blockImage = new Image();
blockImage.src = BLOCK_IMAGE_PATH;
let floorImage = new Image();
floorImage.src = FLOOR_IMAGE_PATH;

// クラス定義 ///////////////////////////////////////////
class Maze {
    constructor() {
        this.blocks = []
        this.isCreated = false;

        this.blockNumX = 0;
        this.blockNumY = 0;
        this.blockSize = 0;

        this.offsetX = 0;
        this.offsetY = 0;
    }
    create(blockSize) {
        this.blockSize = blockSize;

        this.blockNumX = Math.floor(SCREEN_SIZE_W / blockSize);
        this.blockNumY = Math.floor(SCREEN_SIZE_H / blockSize);

        if (this.blockNumX % 2 == 0) {
            this.blockNumX -= 1;
        }
        if (this.blockNumY % 2 == 0) {
            this.blockNumY -= 1;
        }

        let blankX = SCREEN_SIZE_W - this.blockNumX * blockSize;
        let blankY = SCREEN_SIZE_H - this.blockNumY * blockSize;
        this.offsetX = blankX / 2.0;
        this.offsetY = blankY / 2.0;

        this.blocks.splice(0);
        
        // 枠と柱
        for (let i = 0; i < this.blockNumY; i++) {
            let blockRaw = []
            for (let j = 0; j < this.blockNumX; j++) {
                if (i == 0 || i == this.blockNumY - 1 || j == 0 || j == this.blockNumX - 1) {
                    blockRaw.push(1);
                }
                else if (i % 2 == 0 && j % 2 == 0) {
                    blockRaw.push(1);
                }
                else {
                    blockRaw.push(0);
                }
            }
            this.blocks.push(blockRaw);
        }
        // 棒倒し法
        for (let i = 2; i <= this.blockNumY - 3; i += 2) {
            for (let j = 2; j <= this.blockNumX - 3; j += 2) {
                let vecMax = (i == 2) ? 4 : 3;
                let vec = Math.floor(Math.random() * vecMax);

                while (true) {
                    if (vec == 0) {
                        if (this.blocks[i][j + 1] == 0) {
                            this.blocks[i][j + 1] = 1;
                            break;
                        }
                    }
                    else if (vec == 1) {
                        if (this.blocks[i][j - 1] == 0) {
                            this.blocks[i][j - 1] = 1;
                            break;
                        }
                    }
                    else if (vec == 2) {
                        if (this.blocks[i + 1][j] == 0) {
                            this.blocks[i + 1][j] = 1;
                            break;
                        }
                    }
                    else if (vec == 3) {
                        if (this.blocks[i - 1][j] == 0) {
                            this.blocks[i - 1][j] = 1;
                            break;
                        }
                    }
                    vec++;
                    vec = vec % vecMax;
                }
            }
        }

        this.isCreated = true;
    }
    draw(ratio) {
        if (this.isCreated) {
            for (let i = 0; i < this.blockNumY; i++) {
                for (let j = 0; j < this.blockNumX; j++) {
                    let image;
                    if (this.blocks[i][j] == 1) {
                        image = blockImage;
                    }
                    else {
                        image = floorImage;
                    }
                    context.drawImage(
                        image,
                        this.offsetX + this.blockSize * j,
                        this.offsetY + this.blockSize * i,
                        this.blockSize,
                        this.blockSize);
                }
            }
        }
    }
}

// インスタンス /////////////////////////////////////////
let maze = new Maze();

// 関数定義 /////////////////////////////////////////////
function fillDrawWhite() {
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

// クリックイベント //////////////////////////////////////
$("#button-s").click(function() {
    console.log("click button S");
    $("#input-range").val("0");
    maze.create(BLOCK_SIZE * 5);

    fillDrawWhite();
    maze.draw(0);
});

$("#button-m").click(function() {
    console.log("click button M");
    $("#input-range").val("0");
    maze.create(BLOCK_SIZE * 2);

    fillDrawWhite();
    maze.draw(0);
});

$("#button-l").click(function() {
    console.log("click button L");
    $("#input-range").val("0");
    maze.create(BLOCK_SIZE);
    
    fillDrawWhite();
    maze.draw(0);
});

// スライダーが変化したときのイベント ////////////////////
$("#input-range").on("input", function() {
    maze.draw($("#input-range").val() / 100.0);
});