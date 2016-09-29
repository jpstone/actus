export { LayerFactory, CircleFactory, RectangleFactory, BallFactory, PaddleFactory, loop };

function LayerFactory({ width = 480, height = 320, element = undefined } = {}) {
  return { layer: assemble(ElementFactory(element), CanvasFactory(width, height)) };
}

function ElementFactory(element) {
  if (typeof element === 'object') {
    if (element.layer) {
      return element.layer;
    } else if (element.nodeName) {
      return element;
    }
  } else if (typeof element === 'string') {
    return document.getElementById(element);
  }
  return document.body;
}

function CanvasFactory(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function CircleFactory({
  layer,
  x = 240,
  y = 160,
  width = 40,
  method = 'stroke',
  style = 'green',
} = {}) {
  const canvas = getCanvas(layer);
  const radius = width / 2;
  const ctx = canvas.getContext('2d');
  const draw = methods(ctx, style);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  draw[method]();
  ctx.closePath();
  return { layer: canvas, x, y, width, radius, method, style };
}

function RectangleFactory({
  layer,
  x = 160,
  y = 10,
  width = 100,
  height = 40,
  method = 'stroke',
  style = 'green',
} = {}) {
  const canvas = getCanvas(layer);
  const ctx = canvas.getContext('2d');
  const draw = methods(ctx, style);
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  draw[method]();
  ctx.closePath();
  return { layer: canvas, x, y, width, height, method, style };
}

function BallFactory({
  layer,
  x = 480 / 2,
  y = 320 - 30,
  width = 20,
  radius = 10,
  method = 'fill',
  style = '#0095dd',
} = {}) {
  const canvas = getCanvas(layer);
  const instructions = { layer: canvas, x, y, width, radius, method, style };
  return Object.assign(
    {},
    MoveUpRightFactory(Object.assign({ factory: BallFactory }, CircleFactory(instructions)))
  );
}

function PaddleFactory({
  layer,
  x,
  y,
  width,
  height,
  method = 'fill',
  style = '#0095DD',
} = {}) {
  const canvas = getCanvas(layer);
  const instructions = { layer: canvas, x, y, width, height, method, style };
  return Object.assign({}, RectangleFactory(instructions));
}

function MoveUpRightFactory(item) {
  const obj = item;
  const radius = item.radius;
  const canvas = obj.layer;
  const ctx = canvas.getContext('2d');
  let horizontalDistance = 2;
  let verticalDistance = -2;
  let counter = 0;
  return {
    moveUpRight: () => {
      if (counter) ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (obj.y + verticalDistance < radius - 2 ||
        obj.y + verticalDistance > canvas.height - (radius - 2)) {
        verticalDistance = -verticalDistance;
      }
      if (obj.x + horizontalDistance < radius - 2 ||
        obj.x + horizontalDistance > canvas.width - (radius - 2)) {
        horizontalDistance = -horizontalDistance;
      }
      obj.x += horizontalDistance;
      obj.y += verticalDistance;
      obj.factory(obj);
      counter += 1;
    },
    currentPosition: () => ({ x: obj.x, y: obj.y }),
  };
}

function assemble(element, canvas) {
  const el = element;
  const canv = canvas;
  if (el.style.position !== 'relative') el.style.position = 'relative';
  canv.style.position = 'absolute';
  canv.style.left = 0;
  canv.style.top = 0;
  el.appendChild(canv);
  Array.from(document.getElementsByTagName('canvas')).forEach((layer, index) => {
    const layerUpdate = layer;
    layerUpdate.style.zIndex = index;
  });
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
  setInterval(cb, 20);
}

function getCanvas(layer) {
  if (layer && layer.layer) {
    return layer.layer;
  }

  return layer;
}

