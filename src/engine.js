let canvas;

export { StageFactory, CircleFactory, RectangleFactory, BallFactory, loop };

function StageFactory({ width = 480, height = 320, element = undefined } = {}) {
  canvas = assemble(ElementFactory(element), CanvasFactory(width, height));
  return canvas;
}

function ElementFactory(element) {
  if (typeof element === 'object') {
    return element;
  } else if (typeof element === 'string') {
    return document.getElementById(element);
  }
  return document.body;
}

function CanvasFactory(width, height) {
  const canv = document.createElement('canvas');
  canv.width = width;
  canv.height = height;
  return canv;
}

function RectangleFactory({
  x = 160,
  y = 10,
  width = 100,
  height = 40,
  method = 'stroke',
  style = 'green',
} = {}) {
  const ctx = canvas.getContext('2d');
  const draw = methods(ctx, style);
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  draw[method]();
  ctx.closePath();
  return { ctx, x, y, width, height, method, style };
}

function BallFactory({
  x = canvas.width / 2,
  y = canvas.height - 30,
  width = 20,
  method = 'fill',
  style = '#0095dd',
} = {}) {
  const details = { x, y, width, method, style };
  return Object.assign({}, MoveUpRightFactory(CircleFactory(details)));
}

function MoveUpRightFactory(drawing) {
  const sprite = drawing;
  let x = sprite.x;
  let y = sprite.y;
  let counter = 0;
  const horizontalDistance = 5;
  const verticalDistance = 0;
  return {
    moveUpRight: () => {
      if (counter) sprite.ctx.clearRect(0, 0, canvas.width, canvas.height);
      x += horizontalDistance;
      y += verticalDistance;
      BallFactory(Object.assign({}, sprite, { x, y }));
      counter++;
    },
    currentPosition: () => ({ x, y }),
  };
}

function assemble(element, canv) {
  element.appendChild(canv);
  return canv;
}

function stroke(style) {
  this.strokeStyle = style;
  this.stroke();
}

function fill(style) {
  this.fillStyle = style;
  this.fill();
}

function methods(ctx, style) {
  return { stroke: stroke.bind(ctx, style), fill: fill.bind(ctx, style) };
}

function loop(cb) {
  setInterval(cb, 10);
}

function CircleFactory({
  x = 240,
  y = 160,
  width = 40,
  method = 'stroke',
  style = 'green',
} = {}) {
  const radius = width / 2;
  const ctx = canvas.getContext('2d');
  const draw = methods(ctx, style);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  draw[method]();
  ctx.closePath();
  return { ctx, x, y, width, method, style };
}

