var gl,
  shaderProgram,
  vertices,
  vertexCount = 10000,
  mouseX = 0,
  mouseY = 0

// Vertices - points in 3D space
// Shaders - which define how the vertices are interpreted and rendered on the screen

// The params should not be hard-coded, compiling the shaders again for a different set of values
// Ideally, Shaders should be dynamic programs, which depend upon the params passed into them - use attributes for the same

// Vertex Buffers
// - An array of vertices stored in memory on the GPU

const map = (value, minSrc, maxSrc, minDst, maxDst) =>
  (((value - minSrc) / (maxSrc - minSrc)) * (maxDst - minDst) + minDst).toFixed(
    5
  )

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

  canvas.addEventListener("mousemove", onMouseMove)
}

const draw = () => {
  for (let i = 0; i < vertexCount * 2; i += 2) {
    const dx = vertices[i] - mouseX
    const dy = vertices[i + 1] - mouseY
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 0.1) {
      vertices[i] = mouseX + (dx / dist) * 0.1
      vertices[i + 1] = mouseY + (dy / dist) * 0.1
    } else {
      vertices[i] += Math.random() * 0.01 - 0.005
      vertices[i + 1] += Math.random() * 0.01 - 0.005
    }
  }
  // bufferSubData - used to update some subset of our data. Params - target type, offset = 0 , since we are updating all the vertices
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(vertices))
  // data about the wegGl states is stored in memory locations called buffers. Eg, COLOR_BUFFER_BIT
  gl.clear(gl.COLOR_BUFFER_BIT)
  // last arg defines how many times to draw
  // Options - LINE, LINE_STRIP, LINE_LOOP - varies how the points are used
  gl.drawArrays(gl.POINTS, 0, vertexCount)

  requestAnimationFrame(draw)
}

const onMouseMove = event => {
  mouseX = map(event.clientX, 0, event.target.width, -1, 1)
  mouseY = map(event.clientY, 0, event.target.height, 1, -1)
}

const createShaders = () => {
  const vertexShader = getShader(gl, "shader-vs")
  const fragmentShader = getShader(gl, "shader-fs")

  shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)
  gl.useProgram(shaderProgram)
}

const createVertices = () => {
  vertices = []
  for (let i = 0; i < vertexCount; i++) {
    vertices.push(Math.random() * 2 - 1) // random values from -1 to 1
    vertices.push(Math.random() * 2 - 1)
  }

  // Create the buffer
  let buffer = gl.createBuffer()
  // Bind the buffer to a target - setting the buffer as target of future buffer operations
  // For different buffers, there are different buffer targets. Here, buffer target => ARRAY_BUFFER
  // Float32Array => an array of 32-bit floating point values
  // STATIC_DRAW - we'll be using the values often, but they won't be changing much, there are different type that can be passed depending on the use case
  // DYNAMIC_DRAW - values will be changing too
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW)

  // Getting coords and setting it to a different value
  let coords = gl.getAttribLocation(shaderProgram, "coords")
  // Don't need to mention the buffer again here as it's already bound
  // 3 - each vertex will have three values
  gl.vertexAttribPointer(coords, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(coords)
  // Since the work of buffer is done, unbind it
  // gl.bindBuffer(gl.ARRAY_BUFFER, null)

  let pointSize = gl.getAttribLocation(shaderProgram, "pointSize")
  gl.vertexAttrib1f(pointSize, 1.0)

  let color = gl.getUniformLocation(shaderProgram, "color")
  gl.uniform4f(color, 0.0, 0.0, 1.0, 1.0)
}

/*
 * https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context
 */
// id - script id
function getShader(gl, id) {
  var shaderScript, theSource, currentChild, shader

  shaderScript = document.getElementById(id)

  if (!shaderScript) {
    return null
  }

  theSource = ""
  currentChild = shaderScript.firstChild

  while (currentChild) {
    if (currentChild.nodeType == currentChild.TEXT_NODE) {
      theSource += currentChild.textContent
    }

    currentChild = currentChild.nextSibling
  }
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER)
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER)
  } else {
    // Unknown shader type
    return null
  }
  gl.shaderSource(shader, theSource)

  // Compile the shader program
  gl.compileShader(shader)

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    )
    return nulls
  }

  return shader
}

initGl()
createShaders()
createVertices()
draw()
