"use client";

import { useEffect, useRef } from "react";

const VERT = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

// DNA-inspired concentric ripple rings — cyan · violet · emerald
const FRAG = `
  precision highp float;
  uniform vec2  resolution;
  uniform float time;

  void main(void) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    float t  = time * 0.022;
    float lw = 0.0028;

    /* deep navy base */
    vec3 col = vec3(0.016, 0.023, 0.062);

    float angle = atan(uv.y, uv.x);
    float r     = length(uv);

    /* cyan rings — helix-twisted */
    for (int i = 0; i < 6; i++) {
      float fi    = float(i);
      float twist = sin(angle * 3.5 + t * 2.4) * 0.07;
      float d     = abs(fract(t + fi * 0.175) * 5.5 - r + twist);
      col += (lw * fi * fi / max(d, 0.001)) * vec3(0.133, 0.827, 0.933);
    }

    /* violet rings — counter-phase, slower drift */
    for (int i = 0; i < 5; i++) {
      float fi    = float(i);
      float twist = cos(angle * 2.5 - t * 1.8) * 0.065;
      float d     = abs(fract(t * 0.82 + 0.46 + fi * 0.21) * 5.0 - r + twist);
      col += (lw * fi * fi / max(d, 0.001)) * vec3(0.506, 0.549, 0.973);
    }

    /* emerald accent — inner, subtle */
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float d  = abs(fract(t * 1.25 + 0.68 + fi * 0.38) * 3.8 - r * 0.88);
      col += (lw * 0.28 / max(d, 0.001)) * vec3(0.063, 0.725, 0.506);
    }

    /* radial vignette */
    float vig = 1.0 - smoothstep(0.28, 1.55, r);
    col *= vig;

    /* exposure tone-map — neon glow without full clipping */
    col = 1.0 - exp(-col * 1.8);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function HeroShader() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId = 0;

    const init = async () => {
      const THREE = await import("three");

      const camera = new THREE.Camera();
      camera.position.z = 1;

      const scene    = new THREE.Scene();
      const geometry = new THREE.PlaneGeometry(2, 2);

      const uniforms = {
        time:       { value: 0.0 },
        resolution: { value: new THREE.Vector2() },
      };

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader:   VERT,
        fragmentShader: FRAG,
      });

      scene.add(new THREE.Mesh(geometry, material));

      const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      container.appendChild(renderer.domElement);

      const resize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        renderer.setSize(w, h);
        uniforms.resolution.value.set(renderer.domElement.width, renderer.domElement.height);
      };
      resize();

      const ro = new ResizeObserver(resize);
      ro.observe(container);

      const tick = () => {
        animId = requestAnimationFrame(tick);
        uniforms.time.value += 0.04;
        renderer.render(scene, camera);
      };
      tick();

      // cleanup stored on the ref so outer cleanup can call it
      (container as any).__threeCleanup = () => {
        cancelAnimationFrame(animId);
        ro.disconnect();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
        geometry.dispose();
        material.dispose();
      };
    };

    init();

    return () => {
      (container as any).__threeCleanup?.();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    />
  );
}
