import * as engine from './engine';

const gameDiv = document.getElementById('engine');
const ballLayer = engine.LayerFactory(gameDiv);
const paddleLayer = engine.LayerFactory(gameDiv);
const gameOver = document.getElementById('game-over');
const ball = engine.BallFactory({ layer: ballLayer });
const paddle = engine.PaddleFactory({
  layer: paddleLayer,
  width: 75,
  height: 10,
  x: (paddleLayer.width - 75) / 2,
  y: paddleLayer.height - 10,
});

gameOver.style.visibility = 'hidden';
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
      gameOver.style.visibility = 'visible';
      return;
    }
  }
  bouncingBall.moveAroundStage();
});
