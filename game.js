const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const coin = document.getElementById("coin");

const menu = document.getElementById("menu");
const hud = document.getElementById("hud");
const gameOver = document.getElementById("gameOver");
const pauseScreen = document.getElementById("pauseScreen");

const scoreText = document.getElementById("score");
const coinsText = document.getElementById("coins");
const livesText = document.getElementById("lives");

const finalScore = document.getElementById("finalScore");
const finalCoins = document.getElementById("finalCoins");

let running = false;
let paused = false;
let jumping = false;

let score = 0;
let coins = 0;
let lives = 3;

let speed = 6;

let obstacleX = window.innerWidth + 200;
let coinX = window.innerWidth + 500;

let lastTime = 0;


/* START */

function startGame() {

  menu.style.display = "none";
  gameOver.style.display = "none";
  pauseScreen.style.display = "none";

  hud.style.display = "flex";

  score = 0;
  coins = 0;
  lives = 3;

  speed = 6;

  obstacleX = window.innerWidth + 200;
  coinX = window.innerWidth + 500;

  player.style.bottom = "90px";

  scoreText.textContent = score;
  coinsText.textContent = coins;
  livesText.textContent = lives;

  running = true;
  paused = false;

  lastTime = performance.now();

  requestAnimationFrame(gameLoop);
}


/* JUMP */

function jump() {

  if (!running || paused || jumping) return;

  jumping = true;

  let height = 0;

  const up = setInterval(() => {

    if (paused) return;

    height += 10;

    player.style.bottom = (90 + height) + "px";

    if (height >= 170) {

      clearInterval(up);

      const down = setInterval(() => {

        if (paused) return;

        height -= 10;

        player.style.bottom =
          (90 + height) + "px";

        if (height <= 0) {

          clearInterval(down);

          player.style.bottom = "90px";

          jumping = false;
        }

      }, 20);
    }

  }, 20);
}


/* TELEFОНҒА TOUCH */

document.addEventListener("touchstart", function(e) {

  if (e.target.tagName === "BUTTON") return;

  jump();

});


/* КОМПЬЮТЕР */

document.addEventListener("keydown", function(e) {

  if (e.code === "Space") {
    jump();
  }

});


/* GAME LOOP */

function gameLoop(time) {

  if (!running) return;

  if (paused) {
    requestAnimationFrame(gameLoop);
    return;
  }

  let delta = (time - lastTime) / 16.67;

  lastTime = time;

  obstacleX -= speed * delta;
  coinX -= speed * delta;

  obstacle.style.left = obstacleX + "px";
  coin.style.left = coinX + "px";


  /* КЕДЕРГІ ӨТТІ */

  if (obstacleX < -70) {

    obstacleX =
      window.innerWidth +
      250 +
      Math.random() * 350;

    score++;

    scoreText.textContent = score;


    /* Жылдамдық біртіндеп артады */

    if (score % 5 === 0) {
      speed += 0.7;
    }
  }


  /* ЖАҢА МОНЕТА */

  if (coinX < -50) {

    coinX =
      window.innerWidth +
      300 +
      Math.random() * 500;

    coin.style.bottom =
      (140 + Math.random() * 170) + "px";
  }


  /* COLLISION */

  checkObstacle();
  checkCoin();


  requestAnimationFrame(gameLoop);
}


/* КЕДЕРГІМЕН СОҒЫЛУ */

function checkObstacle() {

  const p = player.getBoundingClientRect();
  const o = obstacle.getBoundingClientRect();

  if (
    p.right > o.left + 8 &&
    p.left < o.right - 8 &&
    p.bottom > o.top + 8 &&
    p.top < o.bottom - 8
  ) {

    obstacleX =
      window.innerWidth +
      300 +
      Math.random() * 400;

    lives--;

    livesText.textContent = lives;

    /* Жеңіл соғылу */

    player.style.transform = "scale(.8)";

    setTimeout(() => {
      player.style.transform = "scale(1)";
    }, 150);


    if (lives <= 0) {
      endGame();
    }
  }
}


/* МОНЕТА */

function checkCoin() {

  const p = player.getBoundingClientRect();
  const c = coin.getBoundingClientRect();

  if (
    p.right > c.left &&
    p.left < c.right &&
    p.bottom > c.top &&
    p.top < c.bottom
  ) {

    coins++;

    coinsText.textContent = coins;

    coinX =
      window.innerWidth +
      400 +
      Math.random() * 500;
  }
}


/* GAME OVER */

function endGame() {

  running = false;

  finalScore.textContent = score;
  finalCoins.textContent = coins;

  hud.style.display = "none";

  gameOver.style.display = "block";
}


/* PAUSE */

function pauseGame() {

  if (!running) return;

  paused = !paused;

  if (paused) {
    pauseScreen.style.display = "block";
  } else {
    pauseScreen.style.display = "none";
    lastTime = performance.now();
  }
}
