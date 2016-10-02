import keyCode from './key-codes';

export {
  LayerFactory,
  CircleFactory,
  RectangleFactory,
  BallFactory,
  PaddleFactory,
  MoveRightTrait,
  MoveLeftTrait,
  MoveAroundStageTrait,
  keyDownHandler,
  AddTraits,
  loop,
  BrickFactory,
  DisappearTrait,
};

function LayerFactory(element = undefined, width = 480, height = 320) {
  return assemble(ElementFactory(element), CanvasFactory(width, height));
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
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function AddTraits(...args) {
  return Object.assign({}, ...args);
}

function CircleFactory({
  layer,
  x = 240,
  y = 290,
  width = 20,
  method = 'fill',
  style = '#0095DD',
  factory = () => {},
} = {}) {
  const canvas = layer;
  const radius = width / 2;
  const ctx = canvas.getContext('2d');
  const draw = methods(ctx, style);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  draw[method]();
  ctx.closePath();
  return Object.assign({}, { layer, x, y, width, method, style, radius, factory });
}

function RectangleFactory({
  layer,
  x = 160,
  y = 10,
  width = 100,
  height = 40,
  method = 'fill',
  style = '#0095DD',
  factory = () => {},
} = {}) {
  const canvas = layer;
  const ctx = canvas.getContext('2d');
  const draw = methods(ctx, style);
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  draw[method]();
  ctx.closePath();
  return Object.assign({}, { layer, x, y, width, height, method, style, factory });
}

function BallFactory(...args) {
  const blueprint = Object.assign({ factory: BallFactory }, ...args);
  return Object.assign({}, CircleFactory(blueprint));
}

function PaddleFactory(...args) {
  const blueprint = Object.assign({ factory: PaddleFactory }, ...args);
  return Object.assign({}, RectangleFactory(blueprint));
}

function BrickFactory(...args) {
  const blueprint = Object.assign({ factory: BrickFactory }, ...args);
  return Object.assign({}, RectangleFactory(blueprint), ...args);
}

function DisappearTrait(product) {
  const obj = product;
  return Object.assign(
    {},
    {
      disappear() {
        const canvas = obj.layer;
        const ctx = canvas.getContext('2d');
        ctx.clearReact(obj.x, obj.y, obj.width, obj.height);
      },
    },
  );
}

function MoveAroundStageTrait(product) {
  const obj = product;
  const radius = product.radius;
  const canvas = obj.layer;
  const ctx = canvas.getContext('2d');
  let horizontalDistance = 1;
  let verticalDistance = -1;
  let counter = 0;
  return Object.assign(
    {},
    product,
    {
      moveAroundStage() {
        if (counter) ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (obj.y + verticalDistance < 0 + radius ||
          obj.y + verticalDistance > canvas.height - radius) {
          verticalDistance = -verticalDistance;
        }
        if (obj.x + horizontalDistance < radius ||
          obj.x + horizontalDistance > canvas.width - radius) {
          horizontalDistance = -horizontalDistance;
        }
        obj.x += horizontalDistance;
        obj.y += verticalDistance;
        obj.factory(obj);
        counter += 1;
      },
    },
    CurrentPositionTrait(obj),
  );
}

function MoveRightTrait(product, key) {
  const obj = product;
  const canvas = obj.layer;
  const ctx = canvas.getContext('2d');
  return Object.assign(
    {},
    {
      moveRight(e) {
        if (e.keyCode === keyCode[key] && obj.x < (canvas.width - obj.width)) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          obj.x += 30;
          obj.factory(obj);
        }
      },
    },
    CurrentPositionTrait(obj),
  );
}

function MoveLeftTrait(product, key) {
  const obj = product;
  const canvas = obj.layer;
  const ctx = canvas.getContext('2d');
  return Object.assign(
    {},
    {
      moveLeft(e) {
        if (e.keyCode === keyCode[key] && obj.x > 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          obj.x -= 30;
          obj.factory(obj);
        }
      },
    },
    CurrentPositionTrait(obj),
  );
}

function CurrentPositionTrait(product) {
  const obj = product;
  return { currentPosition: () => ({ x: obj.x, y: obj.y }) };
}

function keyDownHandler(...args) {
  const handlers = [...args];
  handlers.forEach(handler => document.addEventListener('keydown', handler));
}

function assemble(element, canvas) {
  const el = element;
  const canv = canvas;
  if (el.style.position !== 'relative') el.style.position = 'relative';
  canv.style.position = 'absolute';
  canv.style.left = 0;
  canv.style.top = 100;
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
  setInterval(cb, 10);
}

