"use client"

import { useEffect, useRef, useState } from "react"

const vertexSource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`

const fragmentSource = `
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = fragCoord / iResolution;
    vec2 centeredUV = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);

    float time = iTime * 0.4;

    vec2 mouse = iMouse / iResolution;
    vec2 rippleCenter = 2.0 * mouse - 1.0;

    vec2 distortion = centeredUV;
    for (float i = 1.0; i < 8.0; i++) {
        distortion.x += 0.5 / i * cos(i * 2.0 * distortion.y + time + rippleCenter.x * 3.1415);
        distortion.y += 0.5 / i * cos(i * 2.0 * distortion.x + time + rippleCenter.y * 3.1415);
    }

    float wave = abs(sin(distortion.x + distortion.y + time));
    float glow = smoothstep(0.9, 0.2, wave);

    // Warm stone/amber palette matching #F5F0E8 brand
    float r = glow * 0.62;
    float g = glow * 0.50;
    float b = glow * 0.28;

    fragColor = vec4(r, g, b, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`

interface SmokeyBackgroundProps {
  className?: string
}

export function SmokeyBackground({ className = "" }: SmokeyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const mousePosRef = useRef({ x: 0, y: 0 })
  const isHoveringRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl")
    if (!gl) return

    const compileShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vs = compileShader(gl.VERTEX_SHADER, vertexSource)
    const fs = compileShader(gl.FRAGMENT_SHADER, fragmentSource)
    if (!vs || !fs) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    const posBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW)
    const posLoc = gl.getAttribLocation(program, "a_position")
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const resLoc = gl.getUniformLocation(program, "iResolution")
    const timeLoc = gl.getUniformLocation(program, "iTime")
    const mouseLoc = gl.getUniformLocation(program, "iMouse")

    const startTime = Date.now()
    let animId: number

    const render = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }
      const t = (Date.now() - startTime) / 1000
      gl.uniform2f(resLoc, width, height)
      gl.uniform1f(timeLoc, t)
      const mx = isHoveringRef.current ? mousePosRef.current.x : width / 2
      const my = isHoveringRef.current ? height - mousePosRef.current.y : height / 2
      gl.uniform2f(mouseLoc, mx, my)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      animId = requestAnimationFrame(render)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mousePosRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const handleEnter = () => { isHoveringRef.current = true }
    const handleLeave = () => { isHoveringRef.current = false }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseenter", handleEnter)
    canvas.addEventListener("mouseleave", handleLeave)

    render()
    return () => {
      cancelAnimationFrame(animId)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseenter", handleEnter)
      canvas.removeEventListener("mouseleave", handleLeave)
    }
  }, [])

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
      {/* Slight blur on the shader for softness */}
      <div className="absolute inset-0 backdrop-blur-[2px]" />
    </div>
  )
}
