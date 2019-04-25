var gl, shaderProgram, vertices

// Vertices - points in 3D space
// Shaders - which define how the vertices are interpreted and rendered on the screen

// The params should not be hard-coded, compiling the shaders again for a different set of values
// Ideally, Shaders should be dynamic programs, which depend upon the params passed into them - use attributes for the same

// Vertex Buffers
// - An array of vertices stored in memory on the GPU

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
  // last arg defines how many times to draw
  // Options - LINE, LINE_STRIP, LINE_LOOP - varies how the points are used
  gl.drawArrays(gl.TRIANGLES, 0, 3)
}

const createShaders = () => {
  // Shader types -
  // 1. Vertex Shader - How the vertices are transformed, scaled, translated
  // 2. Fragment Shader - define the colors of the pixels drawn by the vertices

  // vec4(0.0, 0.0, 0.0, 0.1) => x, y, z, w - w is important for the matrix 3D operations

  // Since coords is defined as an attribute - it allows us to find it from our program and pass values to it
  // Value of attribute can be different for each vertices
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

  // precision mediump float; = tells the shader that we'll be using medium precision of floating point values
  const fs = `
  precision mediump float;
  uniform vec4 color;
  void main(void) {
      gl_FragColor = color;
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
  vertices = [-0.5, -0.5, 0.0, 0.5, -0.5, 0.0, 0.0, 0.5, 0.0]

  // Create the buffer
  let buffer = gl.createBuffer()
  // Bind the buffer to a target - setting the buffer as target of future buffer operations
  // For different buffers, there are different buffer targets. Here, buffer target => ARRAY_BUFFER
  // Float32Array => an array of 32-bit floating point values
  // STATIC_DRAW - we'll be using the values often, but they won't be changing much, there are different type that can be passed depending on the use case
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

  // Getting coords and setting it to a different value
  let coords = gl.getAttribLocation(shaderProgram, "coords")
  // Don't need to mention the buffer again here as it's already bound
  // 3 - each vertex will have three values
  gl.vertexAttribPointer(coords, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(coords)
  // Since the work of buffer is done, unbind it
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  let pointSize = gl.getAttribLocation(shaderProgram, "pointSize")
  gl.vertexAttrib1f(pointSize, 20.0)

  let color = gl.getUniformLocation(shaderProgram, "color")
  gl.uniform4f(color, 1.0, 0.0, 1.0, 1.0)
}

initGl()
createShaders()
createVertices()
draw()
