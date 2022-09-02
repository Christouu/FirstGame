/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById("collisionCanvas");
const collisionCtx = collisionCanvas.getContext("2d");
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let score = 0;
let gameOver = false;
ctx.font = "50px Impact";

let explosions = [];

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;

let ravens = [];

class Raven {
  constructor() {
    this.spriteWIdth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.5 + 0.4; // multiply is faster than division
    this.width = this.spriteWIdth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width; // ravens to fly to the left
    this.y = Math.random() * (canvas.height - this.height);
    this.directionX = Math.random() * 5 + 3; //speed of the raven
    this.directionY = Math.random() * 5 - 2.5; // vertical speed so that raven can bounce (number is betwee -2.5 and 2.5)
    this.markedForDelete = false;
    this.image = new Image();
    this.image.src = "raven.png";
    this.frame = 0;
    this.maxFrame = 4;
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 10 + 10;
    this.randomColor = [
      Math.floor(Math.random() * 255), //red
      Math.floor(Math.random() * 255), //green
      Math.floor(Math.random() * 255), //blue color
    ];
    this.color = `rgb(${this.randomColor[0]}, ${this.randomColor[1]}, ${this.randomColor[2]})`;
  }

  update(deltaTime) {
    if (this.y < 0 || this.y > canvas.height - this.height) {
      this.directionY = this.directionY * -1;
    }

    this.x -= this.directionX;
    this.y += this.directionY;
    if (this.x < 0 - this.width) this.markedForDelete = true; // marked for delete frames that are crossed the left width of the screen

    this.timeSinceFlap += deltaTime;

    if (this.timeSinceFlap > this.flapInterval) {
      if (this.frame > this.maxFrame) this.frame = 0;
      else this.frame++;
      this.timeSinceFlap = 0;
    }

    if (this.x < 0 - this.width) gameOver = true;
  }

  draw() {
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    collisionCtx.fillStyle = this.color;
    collisionCtx.fillRect(this.x, this.y, this.width, this.height);

    ctx.drawImage(
      this.image,
      this.frame * this.spriteWIdth,
      0,
      this.spriteWIdth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

const raven = new Raven();

function animate(timestamp) {
  //timestamp is in miliseconds

  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear old drawings from the previous frame
  collisionCtx.clearRect(0, 0, canvas.width, canvas.height);

  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextRaven += deltaTime; //check for ms for you pc how fast can it create a new raven. this helps for slower pcs
  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
    ravens.sort((a, b) => a.width - b.width);
  }

  drawScore(); // here is draw score is behind ravens

  [...ravens, ...explosions].forEach((r) => r.update(deltaTime));
  [...ravens, ...explosions].forEach((r) => r.draw());
  ravens = ravens.filter((r) => !r.markedForDelete); //contains ravens only visible on the screen
  explosions = explosions.filter((e) => !e.markedForDelete);

  if (!gameOver) requestAnimationFrame(animate);
  else drawGameOver();
}

animate(0);

function drawScore() {
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 50, 75);
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 55, 80);
}

function drawGameOver() {
  ctx.textAlign = "center";

  ctx.fillStyle = "black";
  ctx.fillText(
    "GAME OVER ZAGYBENQK RANK 2! Score: " + score,
    canvas.width / 2,
    canvas.height / 2
  );

  ctx.fillStyle = "white";
  ctx.fillText(
    "GAME OVER ZAGYBENQK RANK 2! Score: " + score,
    canvas.width / 2 + 5,
    canvas.height / 2 + 5
  );
}

window.addEventListener("click", function (e) {
  const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);

  const pc = detectPixelColor.data;
  ravens.forEach((r) => {
    if (
      r.randomColor[0] === pc[0] &&
      r.randomColor[1] === pc[1] &&
      r.randomColor[2] === pc[2]
    ) {
      r.markedForDelete = true;
      score++;
      explosions.push(new Explosion(r.x, r.y, r.width));
    }
  });
});

class Explosion {
  constructor(x, y, size) {
    this.image = new Image();
    this.image.src = "boom.png";
    this.spriteWIdth = 200;
    this.spriteHeight = 179;
    this.size = size;
    this.x = x; // size of the frame
    this.y = y;
    this.frame = 0;
    this.sound = new Audio();
    this.sound.src = "boom2.wav";
    this.timeSinceLastFrame = 0;
    this.frameInterval = 200;
    this.markedForDelete = false;
  }

  update(deltaTime) {
    if (this.frame === 0) this.sound.play();

    this.timeSinceLastFrame += deltaTime;

    if (this.timeSinceLastFrame > this.frameInterval) {
      this.frame++;
      this.timeSinceLastFrame = 0;
      if (this.frame > 5) this.markedForDelete = true;
    }
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWIdth,
      0,
      this.spriteWIdth,
      this.spriteHeight,
      this.x,
      this.y - this.size / 4,
      this.size,
      this.size
    );
  }
}
