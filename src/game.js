import * as engine from './engine';

let isGameOver = false;
const gameDiv = document.getElementById('engine');
const ballLayer = engine.LayerFactory(gameDiv);
const brickLayer = engine.LayerFactory(gameDiv);
const paddleLayer = engine.LayerFactory(gameDiv);
const gameOver = document.getElementById('game-over');

const bricks = Array.from(Array(3)).map(() => Array.from(Array(5))).map((row, rowIndex) => (
  row.map((brick, brickIndex) => {
    const width = 75;
    const height = 20;
    const margin = 10;
    const x = 30;
    const y = 30;
    return engine.RectangleFactory({
      layer: brickLayer,
      x: (brickIndex * (width + margin)) + x,
      y: (rowIndex * (height + margin)) + y,
      width,
      height,
    });
  })
));

console.log(bricks);

const ball = engine.BallFactory({ layer: ballLayer });
const paddle = engine.PaddleFactory({
  layer: paddleLayer,
  width: 75,
  height: 10,
  x: (paddleLayer.width - 75) / 2,
  y: paddleLayer.height - 10,
});
const bouncingBall = engine.AddTraits(engine.MoveAroundStageTrait(ball));
const playerPaddle = engine.AddTraits(
  engine.MoveRightTrait(paddle, 'rightArrow'),
  engine.MoveLeftTrait(paddle, 'leftArrow')
);

engine.keyDownHandler(playerPaddle.moveRight, playerPaddle.moveLeft);
engine.loop(() => {
  const ballPosition = bouncingBall.currentPosition();
  const paddlePosition = playerPaddle.currentPosition();
  if (ballPosition.y - bouncingBall.radius === bouncingBall.layer.height - bouncingBall.width) {
    if (ballPosition.x < paddlePosition.x || ballPosition.x > paddlePosition.x + paddle.width) {
      isGameOver = true;
      gameOver.style.visibility = 'visible';
      return;
    }
  }
  if (!isGameOver) bouncingBall.moveAroundStage();
});
