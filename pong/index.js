let canvas = document.getElementById("gameScenario");
let ctx = canvas.getContext("2d");

canvas.width = 300;
canvas.height = 400;

let ROWS = 5,
    COLS = 9,
    lives = 3,
    score = 0,
    bricks = {
        'all': [],
        'reset': function () {
            bricks.all = [];
            for (let i = 0; i < ROWS; i++) { // eje y
                for (let j = 0; j < COLS; j++) { // eje x
                    let brick = {
                        'width': brick_width,
                        'height': brick_height,
                        'x': 50 + padding.left + brick_width * j,
                        'y': 50 + padding.top + brick_height * i,
                        'canDraw': true
                    }
                    bricks.all.push(brick)
                }
            }
        }
    },
    brick_height = 5,
    brick_width = 21.75,
    status = 'waiting',
    walls = {
        'right': 250,
        'left': 50
    },
    ball = {
        'x': 0,
        'y': 0,
        'dx': 0,
        'dy': 0,
        'r': 2,
        'update': function () {
            if (ball.x + ball.dx + ball.r <= walls.left || ball.x + ball.dx + ball.r >= walls.right) { // choque derecha o izquierda
                ball.dx *= (-1);
            }
            if (ball.y + ball.dy + ball.r <= 0 || ball.y + ball.dy + ball.r >= canvas.height) { // choque arriba o abajo
                ball.dy *= (-1);
                //ball.dx = Math.floor(Math.random() * 6) - 3;
                ball.dx = 2; ball.x = canvas.width / 2;
                //ball.dy = Math.floor(Math.random() * 6) - 3;
                ball.dy = -2; ball.y = canvas.height / 2;
                lives -= 1;
            }
            ball.x += ball.dx; ball.y += ball.dy;
        },
        'collidePaddle': function (paddle) {
            if (paddle.y <= ball.y + ball.r){
                if (paddle.x <= ball.x + ball.r && paddle.x + paddle.width >= ball.x + ball.r) {
                    ball.dy *= (-1);
                }
            }
        },
        'collideBricks': function (bricks) {
            for (let i = 0; i < bricks.length; i++) {
                let brick = bricks[i];
                if (!brick.canDraw) {
                    continue;
                }
                if (ball.y + ball.r <= brick.y + brick.height) {
                    if (ball.x + ball.r >= brick.x && ball.x + ball.r <= brick.x + brick.width) {
                        bricks[i].canDraw = false;
                        score += 1;
                        ball.dy *= (-1);
                        break;
                    }
                }
            }
        }
    },
    user_speed = 2,
    paddle = {
        'x': canvas.width / 2,
        'y': canvas.height - 10,
        'width': 25,
        'height': 5,
        'dx': 0,
        'update': function () {
            if (paddle.x + paddle.dx <= walls.left || paddle.x + paddle.dx + paddle.width >= walls.right) {
                return;
            }
            paddle.x += paddle.dx;
        }
    },
    padding = {
        'left': 2,
        'top': 2
    };

for (let i = 0; i < ROWS; i++) { // eje y
    for (let j = 0; j < COLS; j++) { // eje x
        let brick = {
            'width': brick_width,
            'height': brick_height,
            'x': 50 + padding.left + brick_width * j,
            'y': 50 + padding.top + brick_height * i,
            'canDraw': true
        }
        bricks.all.push(brick)
    }
};

function onKeyDown(e) {
    if (e.keyCode === 39) {
        paddle.dx = user_speed;
    } else if (e.keyCode === 37) {
        paddle.dx = - user_speed;
    }
};

function onKeyUp(e) {
    if (e.keyCode === 39 || e.keyCode === 37) {
        paddle.dx = 0;
    }
};

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
};

function drawBricks() {
    ctx.beginPath();
    for (let i = 0; i < bricks.all.length; i++) {
        let brick = bricks.all[i];
        if (brick.canDraw) {
            ctx.rect(brick.x, brick.y, brick.width, brick.height);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.stroke();
        }
    }
    ctx.closePath();
};

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
};

function drawWalls() {
    ctx.beginPath();
    ctx.rect(walls.left - 2, 0, 2, canvas.height);
    ctx.rect(walls.right, 0, 2, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
};

function drawBackground() {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
};

function writeStatus() {
    ctx.textAlign = 'center';		
    ctx.font = '30pt Monospace';
    ctx.fillStyle = 'white';
    ctx.fillText(String(lives) + '  ' + String(score), canvas.width / 2, 40);
};

function update() {
    ball.update();
    paddle.update();
    ball.collidePaddle(paddle);
    ball.collideBricks(bricks.all);
};

function win() {
    if (score >= ROWS * COLS) {
        alert("YOU WIN");
        status = 'waiting'; lives = 3; score = 0; ball.x = 0; ball.y = 0;
        paddle.x = canvas.width / 2; paddle.y = canvas.height - 10; bricks.reset();
    }
    if (lives <= 0) {
        alert('YOU LOSE');
        status = 'waiting'; lives = 3; score = 0; ball.x = 0; ball.y = 0;
        paddle.x = canvas.width / 2; paddle.y = canvas.height - 10; bricks.reset();
    }
};

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();  drawWalls(); writeStatus(); drawBall(); drawBricks(); drawPaddle();
};

function mainLoop() {
    if (status != 'waiting') {
        update();
    }
    draw();
    win();
    requestAnimationFrame(mainLoop);
};

document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);

let left_button = document.getElementById('leftButton'),
    right_button = document.getElementById('rightButton'),
    start_button = document.getElementById('startButton');

start_button.onclick = function () {
    ball.dx = 2; ball.x = canvas.width / 2; ball.dy = -2; ball.y = canvas.height / 2;
    status = 'playing'; score = 0; lives = 3;
    bricks.reset();
};

left_button.onmousedown = function () { paddle.dx = -2; };
left_button.onmouseup = function () { paddle.dx = 0; };

right_button.onmousedown = function () { paddle.dx = 2; };
right_button.onmouseup = function () { paddle.dx = 0; };

mainLoop();