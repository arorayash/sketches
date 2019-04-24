var gl, shaderProgram

// Vertices - points in 3D space
// Shaders - which define how the vertices are interpreted and rendered on the screen

// The params should not be hard-coded, compiling the shaders again for a different set of values
// Ideally, Shaders should be dynamic programs, which depend upon the params passed into them - use attributes for the same

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

  // Since coords is defined as an attribute - it allows us to find it from our program and pass values to it
  const vs = `
  attribute vec4 coords;
  attribute float pointSize;
  void main(void) {
      gl_Position = coords;
      gl_PointSize = pointSize;
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

const createVertices = () => {
  // Getting coords and setting it to a different value
  let coords = gl.getAttribLocation(shaderProgram, "coords")
  // vertexAttrib3f supplies the value of w as 1 by default
  gl.vertexAttrib3f(coords, 0.0, 0.5, 0.0)

  let pointSize = gl.getAttribLocation(shaderProgram, "pointSize")
  gl.vertexAttrib1f(pointSize, 20.0)
}

initGl()
createShaders()
createVertices()
draw()
