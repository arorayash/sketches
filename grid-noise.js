const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palette = require("nice-color-palettes");

const settings = {
  dimensions: [2048, 2048]
};

const sketch = () => {
  const count = 50;
  const margin = 200;
  const colors = random.pick(palette);

  const createGrid = (width, height) => {
    const points = [];
    for (x = 0; x < count; x += 1) {
      for (y = 0; y < count; y += 1) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const radius = Math.abs(random.noise2D(u, v)) * 0.12;
        points.push({
          color: random.pick(colors),
          radius,
          rotation: random.noise2D(u, v),
          position: [u, v]
        });
      }
    }
    return points;
  };

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    const points = createGrid(width, height).filter(() => random.value() > 0.5);

    points.forEach(point => {
      const { radius, position, rotation, color } = point;
      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);
      context.save();
      context.fillStyle = color;
      context.font = `${radius * width}px Helvetica`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText("▷", 0, 0);
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
