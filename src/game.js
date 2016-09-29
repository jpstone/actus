import { LayerFactory, BallFactory, PaddleFactory, loop } from './engine';

const gameDiv = { element: document.getElementById('engine') };
const ballLayer = LayerFactory(gameDiv);
const paddleLayer = LayerFactory(gameDiv);
// drawRectangle({ x: 20, y: 40, width: 50, height: 50, style: '#ff0000', method: 'fill' });
// drawCircle({ method: 'fill' });
// drawRectangle({ style: 'rgba(0, 0, 255, 0.5)' });

const ball = BallFactory(ballLayer);
PaddleFactory({
  layer: paddleLayer,
  width: 75,
  height: 10,
  x: (paddleLayer.layer.width - 75) / 2,
  y: paddleLayer.layer.height - 10,
});

loop(ball.moveUpRight);
