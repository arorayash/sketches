var gl, shaderProgram

// Vertices - points in 3D space
// Shaders - which define how the vertices are interpreted and rendered on the screen

const initGl = () => {
  const canvas = document.getElementById("canvas")
  gl = canvas.getContext("webgl")
  // define what portion of the canvas is to be used
  gl.viewport(0, 0, canvas.width, canvas.height)
  // clearing the canvas to a particular color - no change will reflect on the canvas yet,
  // as the canvas is not cleared yet, we only set the color we want the clear canvas to.
  // WebGl is a state based system - most of the code is organized in two parts -
  // 1. init function - that defines and sets different params
  // 2. draw function - which sets the states that render something
  gl.clearColor(1, 1, 1, 1)
}

const draw = () => {
  // data about the wegGl states is stored in memory locations called buffers. Eg, COLOR_BUFFER_BIT
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.POINTS, 0, 1)
}

const createShaders = () => {
  // Shader types -
  // 1. Vertex Shader - How the vertices are transformed, scaled, translated
  // 2. Fragment Shader - define the colors of the pixels drawn by the vertices

  // vec4(0.0, 0.0, 0.0, 0.1) => x, y, z, w - w is important for the matrix 3D operations
  const vs = `
  void main(void) {
      gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
      gl_PointSize = 10.0;
  }
  `

  // Create s shader object, use the `vs` string as its source code and the compile that into
  // and actual functioning shader
  const vertexShader = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vertexShader, vs)
  gl.compileShader(vertexShader)

  // Fragment shader -
  const fs = `
  void main(void) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  }
  `

  // Create s shader object, use the `vs` string as its source code and the compile that into
  // and actual functioning shader
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(fragmentShader, fs)
  gl.compileShader(fragmentShader)

  shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)
  gl.useProgram(shaderProgram)
}

initGl()
createShaders()
draw()
