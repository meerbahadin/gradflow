import { FRAGMENT_SHADER, VERTEX_SHADER } from './shader'

export type Vec3 = [number, number, number]

/** Everything one frame needs. Colors are 0–1 per channel. */
export type FrameUniforms = {
  time: number
  time2: number
  color1: Vec3
  color2: Vec3
  color3: Vec3
  scale: number
  noise: number
  type: number
  prevType: number
  /** 0 shows `prevType`, 1 shows `type` */
  mix: number
  /** x, y in uv space and the lens strength */
  pointer: Vec3
}

export type GradientRenderer = {
  /**
   * Draws one frame into the bottom-left `width` × `height` device pixels of
   * the canvas. `cssWidth`/`cssHeight` are what the shaders see as resolution.
   */
  draw: (
    uniforms: FrameUniforms,
    width: number,
    height: number,
    cssWidth: number,
    cssHeight: number
  ) => void
  dispose: () => void
}

const UNIFORMS = [
  'u_time',
  'u_time2',
  'u_color1',
  'u_color2',
  'u_color3',
  'u_scale',
  'u_type',
  'u_prevType',
  'u_mix',
  'u_noise',
  'u_resolution',
  'u_pointer',
] as const

type Locations = Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>

type GL = WebGLRenderingContext

function compile(gl: GL, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (!gl.isContextLost()) {
      console.error('gradflow: shader failed to compile', gl.getShaderInfoLog(shader))
    }
    gl.deleteShader(shader)
    return null
  }

  return shader
}

function link(gl: GL) {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
  const program = gl.createProgram()
  if (!vertex || !fragment || !program) return null

  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.bindAttribLocation(program, 0, 'position')
  gl.linkProgram(program)

  // the program keeps the compiled code alive on its own
  gl.deleteShader(vertex)
  gl.deleteShader(fragment)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    if (!gl.isContextLost()) {
      console.error('gradflow: program failed to link', gl.getProgramInfoLog(program))
    }
    gl.deleteProgram(program)
    return null
  }

  return program
}

/**
 * A minimal WebGL renderer for the gradient shader: one program, one
 * full-screen triangle. Returns null when the browser won't hand out a
 * context — callers should treat that as "nothing to draw", not as an error.
 */
export function createRenderer(
  canvas: HTMLCanvasElement,
  options: { preserveDrawingBuffer?: boolean } = {}
): GradientRenderer | null {
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: options.preserveDrawingBuffer ?? false,
    powerPreference: 'high-performance',
  })
  if (!gl) return null

  let program: WebGLProgram | null = null
  let buffer: WebGLBuffer | null = null
  let locations: Locations | null = null

  const setup = () => {
    program = link(gl)
    if (!program) return

    // a single triangle that overshoots the viewport covers it without the
    // diagonal seam a two-triangle quad has
    buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    )
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    gl.useProgram(program)
    locations = Object.fromEntries(
      UNIFORMS.map((name) => [name, gl.getUniformLocation(program!, name)])
    ) as Locations
  }

  // browsers drop contexts under memory pressure or when a page holds too
  // many; without preventDefault the context is never offered back
  const onLost = (event: Event) => {
    event.preventDefault()
    program = null
    locations = null
  }
  const onRestored = () => setup()

  canvas.addEventListener('webglcontextlost', onLost)
  canvas.addEventListener('webglcontextrestored', onRestored)

  setup()

  return {
    draw(u, width, height, cssWidth, cssHeight) {
      if (!program || !locations) return

      gl.viewport(0, 0, width, height)
      gl.uniform1f(locations.u_time, u.time)
      gl.uniform1f(locations.u_time2, u.time2)
      gl.uniform3fv(locations.u_color1, u.color1)
      gl.uniform3fv(locations.u_color2, u.color2)
      gl.uniform3fv(locations.u_color3, u.color3)
      gl.uniform1f(locations.u_scale, u.scale)
      gl.uniform1i(locations.u_type, u.type)
      gl.uniform1i(locations.u_prevType, u.prevType)
      gl.uniform1f(locations.u_mix, u.mix)
      gl.uniform1f(locations.u_noise, u.noise)
      gl.uniform2f(locations.u_resolution, cssWidth, cssHeight)
      gl.uniform3fv(locations.u_pointer, u.pointer)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    },

    dispose() {
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      if (buffer) gl.deleteBuffer(buffer)
      if (program) gl.deleteProgram(program)
      program = null
      locations = null
    },
  }
}
