"use client";

import React, { useRef, useEffect, useCallback } from "react";
import {
  Clock,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  SRGBColorSpace,
  MathUtils,
  Vector2,
  Vector3,
  MeshPhysicalMaterial,
  Color,
  Object3D,
  InstancedMesh,
  PMREMGenerator,
  SphereGeometry,
  AmbientLight,
  PointLight,
  ACESFilmicToneMapping,
  Raycaster,
  Plane,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { cn } from "@/lib/utils";

// ─── Renderer / Scene Manager ────────────────────────────────────────────────
class ThreeCore {
  canvas: HTMLCanvasElement;
  camera: PerspectiveCamera;
  scene: Scene;
  renderer: WebGLRenderer;
  size = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0 };

  onBeforeRender: (state: { elapsed: number; delta: number }) => void =
    () => {};
  onAfterResize: (size: typeof this.size) => void = () => {};

  private clock = new Clock();
  private rafId = 0;
  private resizeTimer?: ReturnType<typeof setTimeout>;
  private resizeObs?: ResizeObserver;
  private intersectObs?: IntersectionObserver;
  private isVisible = false;
  private elapsed = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.camera = new PerspectiveCamera(50, 1, 0.1, 100);
    this.scene = new Scene();
    this.renderer = new WebGLRenderer({
      canvas,
      powerPreference: "high-performance",
      alpha: true,
      antialias: true,
    });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.canvas.style.display = "block";
    this.initObservers();
    this.resize();
  }

  private initObservers() {
    const parent = this.canvas.parentElement;
    if (parent) {
      this.resizeObs = new ResizeObserver(() => this.scheduleResize());
      this.resizeObs.observe(parent);
    } else {
      window.addEventListener("resize", () => this.scheduleResize());
    }
    this.intersectObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.startLoop();
        } else {
          this.stopLoop();
        }
      },
      { threshold: 0 }
    );
    this.intersectObs.observe(this.canvas);
    document.addEventListener("visibilitychange", () => {
      if (this.isVisible) {
        document.hidden ? this.stopLoop() : this.startLoop();
      }
    });
  }

  private scheduleResize() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => this.resize(), 100);
  }

  resize() {
    const parent = this.canvas.parentElement;
    const w = parent ? parent.offsetWidth : window.innerWidth;
    const h = parent ? parent.offsetHeight : window.innerHeight;
    this.size.width = w;
    this.size.height = h;
    this.size.ratio = w / h;
    this.camera.aspect = this.size.ratio;
    this.camera.updateProjectionMatrix();
    const fovRad = (this.camera.fov * Math.PI) / 180;
    this.size.wHeight = 2 * Math.tan(fovRad / 2) * this.camera.position.z;
    this.size.wWidth = this.size.wHeight * this.size.ratio;
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.onAfterResize(this.size);
  }

  private startLoop() {
    if (this.isVisible) return;
    this.isVisible = true;
    this.clock.start();
    const tick = () => {
      this.rafId = requestAnimationFrame(tick);
      const delta = Math.min(this.clock.getDelta(), 0.1);
      this.elapsed += delta;
      this.onBeforeRender({ elapsed: this.elapsed, delta });
      this.renderer.render(this.scene, this.camera);
    };
    tick();
  }

  private stopLoop() {
    if (!this.isVisible) return;
    cancelAnimationFrame(this.rafId);
    this.isVisible = false;
    this.clock.stop();
  }

  dispose() {
    this.stopLoop();
    this.resizeObs?.disconnect();
    this.intersectObs?.disconnect();
    this.scene.clear();
    this.renderer.dispose();
  }
}

// ─── Physics ─────────────────────────────────────────────────────────────────
interface PhysicsConfig {
  count: number;
  maxX: number;
  maxY: number;
  maxZ: number;
  gravity: number;
  friction: number;
  minSize: number;
  maxSize: number;
}

class BallPhysics {
  positions: Float32Array;
  velocities: Float32Array;
  sizes: Float32Array;
  cursor = new Vector3();

  constructor(private cfg: PhysicsConfig) {
    this.positions = new Float32Array(cfg.count * 3);
    this.velocities = new Float32Array(cfg.count * 3);
    this.sizes = new Float32Array(cfg.count);
    this.initPositions();
    this.initSizes();
  }

  private initPositions() {
    const { count, maxX, maxY, maxZ } = this.cfg;
    for (let i = 0; i < count; i++) {
      const b = i * 3;
      this.positions[b] = MathUtils.randFloatSpread(maxX);
      this.positions[b + 1] = MathUtils.randFloatSpread(maxY);
      this.positions[b + 2] = MathUtils.randFloatSpread(maxZ);
    }
  }

  initSizes() {
    for (let i = 0; i < this.cfg.count; i++) {
      this.sizes[i] = MathUtils.randFloat(this.cfg.minSize, this.cfg.maxSize);
    }
  }

  update(delta: number) {
    const { count, gravity, friction, maxX, maxY } = this.cfg;
    const pos = this.positions;
    const vel = this.velocities;
    const cur = this.cursor;

    for (let i = 0; i < count; i++) {
      const b = i * 3;
      let px = pos[b], py = pos[b + 1], pz = pos[b + 2];
      let vx = vel[b], vy = vel[b + 1], vz = vel[b + 2];

      // Cursor attraction within range
      const dx = cur.x - px;
      const dy = cur.y - py;
      const dz = cur.z - pz;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < 12 && dist > 0.01) {
        const str = 0.012 / dist;
        vx += dx * str;
        vy += dy * str;
        vz += dz * str;
      }

      vy -= delta * gravity;
      vx *= friction;
      vy *= friction;
      vz *= friction;

      px += vx;
      py += vy;
      pz += vz;

      if (Math.abs(px) > maxX) { px = Math.sign(px) * maxX; vx *= -0.5; }
      if (Math.abs(py) > maxY) { py = Math.sign(py) * maxY; vy *= -0.5; }

      pos[b] = px; pos[b + 1] = py; pos[b + 2] = pz;
      vel[b] = vx; vel[b + 1] = vy; vel[b + 2] = vz;
    }
  }
}

// ─── Instanced Sphere Mesh ────────────────────────────────────────────────────
const _dummy = new Object3D();

class BallPit extends InstancedMesh {
  physics: BallPhysics;

  constructor(renderer: WebGLRenderer, cfg: PhysicsConfig & { colors: string[] }) {
    // FIX: RoomEnvironment takes NO arguments in Three.js r152+
    const pmrem = new PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment()).texture;
    pmrem.dispose();

    const geo = new SphereGeometry(1, 32, 32);
    const mat = new MeshPhysicalMaterial({
      envMap: envTexture,
      metalness: 0.55,
      roughness: 0.15,
      transmission: 0.25,
      thickness: 0.6,
      envMapIntensity: 1.4,
    });

    super(geo, mat, cfg.count);
    this.physics = new BallPhysics(cfg);
    this.applyColors(cfg.colors);
  }

  applyColors(colors: string[]) {
    const c = new Color();
    for (let i = 0; i < this.count; i++) {
      this.setColorAt(i, c.set(colors[i % colors.length]));
    }
    if (this.instanceColor) this.instanceColor.needsUpdate = true;
  }

  tick(delta: number) {
    this.physics.update(delta);
    for (let i = 0; i < this.count; i++) {
      _dummy.position.fromArray(this.physics.positions, i * 3);
      _dummy.scale.setScalar(this.physics.sizes[i]);
      _dummy.updateMatrix();
      this.setMatrixAt(i, _dummy.matrix);
    }
    this.instanceMatrix.needsUpdate = true;
  }
}

// ─── Component ───────────────────────────────────────────────────────────────
export interface InteractiveHeroProps {
  className?: string;
  colors?: string[];
  count?: number;
  gravity?: number;
  children?: React.ReactNode;
}

// Dermacol-inspired palette — pinks, blacks, whites, soft blush
const DEFAULT_COLORS = ["#FF85A1", "#1A1A1A", "#FFFFFF", "#FCE7F3", "#FF4D6D"];

export const InteractiveHero: React.FC<InteractiveHeroProps> = ({
  className,
  colors = DEFAULT_COLORS,
  count,
  gravity,
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Pointer / touch state
  const pointer = useRef(new Vector2(0, 0));

  const handlePointerMove = useCallback((e: PointerEvent) => {
    pointer.current.set(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    );
  }, []);

  // Touch support for mobile
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!e.touches[0]) return;
    pointer.current.set(
      (e.touches[0].clientX / window.innerWidth) * 2 - 1,
      -(e.touches[0].clientY / window.innerHeight) * 2 + 1
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;

    const cfg = {
      count: count ?? (isMobile ? 35 : 60),
      minSize: isMobile ? 0.5 : 0.6,
      maxSize: isMobile ? 1.2 : 1.5,
      gravity: gravity ?? 0.05,
      friction: 0.975,
      maxX: 15,
      maxY: 10,
      maxZ: 5,
      colors,
    };

    const three = new ThreeCore(canvas);
    three.camera.position.set(0, 0, 20);

    // Lighting
    const ambient = new AmbientLight(0xffffff, 0.6);
    const point1 = new PointLight(0xff85a1, 80, 50);
    const point2 = new PointLight(0xffffff, 40, 50);
    point1.position.set(5, 8, 10);
    point2.position.set(-8, -5, 8);
    three.scene.add(ambient, point1, point2);

    const balls = new BallPit(three.renderer, cfg);
    three.scene.add(balls);

    const raycaster = new Raycaster();
    const plane = new Plane(new Vector3(0, 0, 1), 0);
    const hit = new Vector3();

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    three.onBeforeRender = ({ delta }) => {
      raycaster.setFromCamera(pointer.current, three.camera);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        balls.physics.cursor.copy(hit);
      }
      balls.tick(delta);
    };

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);
      three.dispose();
    };
  }, [colors, count, gravity, handlePointerMove, handleTouchMove]);

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 touch-none"
      />
      {children && (
        <div className="relative z-10 pointer-events-none flex items-center justify-center h-full w-full">
          {children}
        </div>
      )}
    </div>
  );
};

export default InteractiveHero;