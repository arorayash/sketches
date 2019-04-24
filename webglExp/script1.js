var gl

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
  gl.clearColor(0, 0, 1, 1)
}

const draw = () => {
  // data about the wegGl states is stored in memory locations called buffers. Eg, COLOR_BUFFER_BIT
  gl.clear(gl.COLOR_BUFFER_BIT)
}

initGl()
draw()
