/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 900);
const numberOfEnemies = 25;
const enemiesArr = [];

let gameFrame = 0;

// enemy1 = {
//   x: 0,
//   y: 0,
//   width: 200,
//   height: 200,
// };

class Enemy {
  constructor() {
    this.image = new Image();
    this.image.src = "enemies/enemy4.png";
    this.speed = Math.random() * 4 + 1;
    this.spriteWidth = 213;
    this.spriteHeight = 213;
    this.width = this.spriteWidth / 2.5;
    this.height = this.spriteHeight / 2.5;
    this.x = Math.random() * (canvas.width - this.width);
    this.y = Math.random() * (canvas.height - this.height);
    this.frame = 0;
    this.flapSpeed = Math.floor(Math.random() * 3 + 1);
    this.newX = Math.random() * canvas.width;
    this.newY = Math.random() * canvas.height;
    this.interval = Math.floor(Math.random() * 200 + 50); // make every enemy to have a random interval
  }

  update() {
    if (gameFrame % this.interval === 0) {
      // 60(harcode) or this.interval here is the speed for when to change to the new position
      this.newX = Math.random() * (canvas.width - this.width);
      this.newY = Math.random() * (canvas.height - this.height);
    }

    let dx = this.x - this.newX;
    let dy = this.y - this.newY;
    this.x -= dx / 70; // this 70 is for changing from the original position to a new slightly different position
    this.y -= dy / 70;

    if (this.x + this.width < 0) this.x = canvas.width; // this makes soo that we have endles movement for x line

    if (gameFrame % this.flapSpeed === 0) {
      this.frame > 4 ? (this.frame = 0) : this.frame++;
    }
  }

  draw() {
    // ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

// const enemy1 = new Enemy();
// const enemy2 = new Enemy();

for (let i = 0; i < numberOfEnemies; i++) {
  enemiesArr.push(new Enemy());
}

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  enemiesArr.forEach((e) => {
    e.update();
    e.draw();
  });
  gameFrame++;
  requestAnimationFrame(animate);
}

animate();
