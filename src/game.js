import { StageFactory, BallFactory, loop } from './engine';

const stage = StageFactory();
// drawRectangle({ x: 20, y: 40, width: 50, height: 50, style: '#ff0000', method: 'fill' });
// drawCircle({ method: 'fill' });
// drawRectangle({ style: 'rgba(0, 0, 255, 0.5)' });

const ball = BallFactory();

console.log(ball)

loop(ball.moveUpRight);
