import * as engine from './engine';

const gameDiv = document.getElementById('engine');
const ballLayer = engine.LayerFactory(gameDiv);
const paddleLayer = engine.LayerFactory(gameDiv);
const gameOver = document.getElementById('game-over');
let ball = engine.BallFactory({ layer: ballLayer });
let paddle = engine.PaddleFactory({
  layer: paddleLayer,
  width: 75,
  height: 10,
  x: (paddleLayer.width - 75) / 2,
  y: paddleLayer.height - 10,
  factory: engine.PaddleFactory,
});

gameOver.style.visibility = 'hidden';
ball = engine.AddTraits(engine.MoveAroundStageTrait(ball));
paddle = engine.AddTraits(engine.MoveRightTrait(paddle), engine.MoveLeftTrait(paddle));

engine.keyDownHandler(paddle.moveRight, paddle.moveLeft);
engine.loop(() => {
  const position = ball.currentPosition();
  if (position.y - ball.radius === ball.layer.height - ball.width) {
    gameOver.style.visibility = 'visible';
    return;
  }
  ball.moveAroundStage();
});
