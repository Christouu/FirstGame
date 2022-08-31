let playerState = "bite";
const dropdown = document.getElementById("animations");
dropdown.addEventListener("change", function (e) {
  playerState = e.target.value;
});

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = 600);
const CANVAS_HEIGHT = (canvas.height = 600);

const spriteWidth = 575; // my image is 6876px width and have 12  columns sooo 6876/12 = 573 but i added some pixels for to be sure the whole img is gonna fit
const spriteHeight = 523; //5230px height of image with 10 rows

let gameFrame = 0;
let staggerFrames = 9;
const spriteAnimations = [];
const animationState = [
  {
    name: "idle",
    frames: 7,
  },
  {
    name: "jump",
    frames: 7,
  },
  {
    name: "fall",
    frames: 7,
  },
  {
    name: "run",
    frames: 9,
  },
  {
    name: "dizzy",
    frames: 11,
  },
  {
    name: "sit",
    frames: 5,
  },
  {
    name: "roll",
    frames: 7,
  },
  {
    name: "bite",
    frames: 7,
  },
  {
    name: "ko",
    frames: 12,
  },
  {
    name: "getHit",
    frames: 4,
  },
];

animationState.forEach((state, index) => {
  let frames = {
    location: [],
  };

  for (let i = 0; i < state.frames; i++) {
    let positionX = i * spriteWidth;
    let positionY = index * spriteHeight;
    frames.location.push({ x: positionX, y: positionY });
  }

  spriteAnimations[state.name] = frames;
});

console.log(spriteAnimations);

//creates html img element
const playerImage = new Image();
playerImage.src = "shadow_dog.png";

function animate() {
  //build in method
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  //ctx.fillRect(50, 50, 100, 100); // make an rect angle
  let position =
    Math.floor(gameFrame / staggerFrames) %
    spriteAnimations[playerState].location.length;
  // 6 is here because we have 7 animation frames horizontaly counting from 0

  let frameX = spriteWidth * position;
  let frameY = spriteAnimations[playerState].location[position].y;

  //draw image works with 3, 5 or 9 arguments
  //first argument is the image you want to draw
  //then its x and y coordinates
  //4 and 5 argument are width and height
  ctx.drawImage(
    playerImage,
    frameX,
    frameY,
    spriteWidth,
    spriteHeight,
    0,
    0,
    spriteWidth,
    spriteHeight
  );
  //js will fit you image based on width and height
  //ctx.drawImage(playerImage, sx, sy, sw, sh, dx, dy, dw, dh);
  //sx, sy, sw, sh (source) -> rect angle area you want to cut from the image
  //dx, dy, dw, dh (detination) -> where on our destination canvas we want to draw that cropped part on to. The last 4 arguments are like 0,0, CANVAS_WIDTH, CANVAS_HEIGHT
  //Like this we are drawing the frame at its individual size.

  //   if (gameFrame % staggerFrames === 0) {
  //     if (frameX < 6) frameX++; // cycle between anymation frames horizontaly
  //     else frameX = 0;
  //   }

  //frameX * spriteWidth change frame for x line (horizontaly)
  //frameY * spriteHeight change frame for y line (verticaly)

  gameFrame++;
  //animates the same react angle over and over
  requestAnimationFrame(animate);
}

animate();
