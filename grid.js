const canvasSketch = require("canvas-sketch")
const { lerp } = require("canvas-sketch-util/math")
const random = require("canvas-sketch-util/random")
const palette = require("nice-color-palettes")

const settings = {
  dimensions: [2048, 2048]
}

const sketch = () => {
  const count = 5
  const margin = 400
  const colors = random.pick(palette)

  const createGrid = (width, height) => {
    const points = []
    for (x = 0; x < count; x += 1) {
      for (y = 0; y < count; y += 1) {
        const u = count <= 1 ? 0.5 : x / (count - 1)
        const v = count <= 1 ? 0.5 : y / (count - 1)
        points.push({
          color: random.pick(colors),
          position: [u, v]
        })
      }
    }
    return points
  }

  return ({ context, width, height }) => {
    context.fillStyle = "white"
    context.fillRect(0, 0, width, height)
    const points = createGrid(width, height)

    points.forEach(({ position, color }) => {
      const [u, v] = position
      const x = lerp(margin, width - margin, u)
      const y = lerp(margin, height - margin, v)
      context.beginPath()
      context.arc(x, y, 20, 0, Math.PI * 2, false)
      context.strokeStyle = color
      context.lineWidth = 15
      context.stroke()
    })
  }
}

canvasSketch(sketch, settings)
