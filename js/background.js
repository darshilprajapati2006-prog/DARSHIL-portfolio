import * as THREE from "https://unpkg.com/three@0.179.1/build/three.module.js";

const CONNECTION_DISTANCE = 14;
const MAX_CONNECTIONS = 4;
const CELL_SIZE = CONNECTION_DISTANCE;

function getPerformanceTier() {
  const width = window.innerWidth;
  const isMobile = width <= 768 || "ontouchstart" in window;
  const isLowEnd = navigator.hardwareConcurrency <= 4 || isMobile;

  if (isMobile || width <= 900) {
    return {
      particleCount: 420,
      sphereCount: 8,
      fogCount: 50,
      pixelRatio: Math.min(window.devicePixelRatio || 1, 1.25),
      antialias: false,
      connectionSkip: 2,
      parallaxSkip: 2,
      sphereSegments: 12,
      usePhysicalMaterial: false,
      powerPreference: "low-power",
    };
  }

  if (isLowEnd || width <= 1180) {
    return {
      particleCount: 700,
      sphereCount: 12,
      fogCount: 80,
      pixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
      antialias: false,
      connectionSkip: 1,
      parallaxSkip: 1,
      sphereSegments: 16,
      usePhysicalMaterial: true,
      powerPreference: "high-performance",
    };
  }

  return {
    particleCount: 1000,
    sphereCount: 18,
    fogCount: 120,
    pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    antialias: true,
    connectionSkip: 1,
    parallaxSkip: 1,
    sphereSegments: 24,
    usePhysicalMaterial: true,
    powerPreference: "high-performance",
  };
}

class AIBackgroundScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.tier = getPerformanceTier();
    this.particleCount = this.tier.particleCount;
    this.sphereCount = this.tier.sphereCount;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = this.tier.pixelRatio;
    this.running = false;
    this.clock = new THREE.Clock();
    this.elapsed = 0;
    this.frameCount = 0;

    this.mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.isLightTheme = document.body.classList.contains("theme-light");

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.networkGroup = null;
    this.sphereGroup = null;
    this.glowGroup = null;
    this.particles = null;
    this.lineSegments = null;
    this.mouseLight = null;
    this.ambientLight = null;
    this.centerGlow = null;
    this.fogParticles = null;
    this.spheres = [];

    this.positions = new Float32Array(this.particleCount * 3);
    this.velocities = new Float32Array(this.particleCount * 3);
    this.sphereData = [];

    this.handleResize = this.handleResize.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.animate = this.animate.bind(this);
    this.handleThemeChange = this.handleThemeChange.bind(this);
  }

  init() {
    if (!this.canvas) return;

    this.setupRenderer();
    this.setupScene();
    this.setupCamera();
    this.setupLights();
    this.createNeuralNetwork();
    this.createFloatingSpheres();
    this.createVolumetricGlow();
    this.createFog();

    window.addEventListener("resize", this.handleResize, { passive: true });
    window.addEventListener("pointermove", this.handlePointerMove, { passive: true });
    document.addEventListener("visibilitychange", this.handleVisibilityChange);

    this.themeObserver = new MutationObserver(this.handleThemeChange);
    this.themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    this.running = true;
    this.animate();
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("pointermove", this.handlePointerMove);
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    this.themeObserver?.disconnect();
    this.renderer?.dispose();
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: this.tier.antialias,
      powerPreference: this.tier.powerPreference,
    });
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x060913, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = null;
    this.networkGroup = new THREE.Group();
    this.sphereGroup = new THREE.Group();
    this.glowGroup = new THREE.Group();

    this.scene.add(this.networkGroup);
    this.scene.add(this.sphereGroup);
    this.scene.add(this.glowGroup);
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.1, 200);
    this.camera.position.set(0, 0, 42);
    this.camera.lookAt(0, 0, 0);
  }

  setupLights() {
    this.ambientLight = new THREE.AmbientLight(0x4a6aff, 0.35);
    this.mouseLight = new THREE.PointLight(0x67d1ff, 2.8, 120, 1.6);
    this.mouseLight.position.set(0, 0, 25);

    const centerLight = new THREE.PointLight(0x3a63ff, 1.4, 80, 2);
    centerLight.position.set(0, 0, 5);

    this.scene.add(this.ambientLight);
    this.scene.add(this.mouseLight);
    this.scene.add(centerLight);
  }

  getPalette() {
    return {
      particle: 0x67d1ff,
      line: new THREE.Color(0x7c9cff),
      sphere: 0x4a7fff,
      fog: 0x060913,
      glow: 0x67d1ff,
      ambient: 0x4a6aff,
    };
  }

  createNeuralNetwork() {
    const spread = { x: 55, y: 32, z: 40 };

    for (let i = 0; i < this.particleCount; i += 1) {
      const i3 = i * 3;
      this.positions[i3] = (Math.random() - 0.5) * spread.x * 2;
      this.positions[i3 + 1] = (Math.random() - 0.5) * spread.y * 2;
      this.positions[i3 + 2] = (Math.random() - 0.5) * spread.z * 2;

      this.velocities[i3] = (Math.random() - 0.5) * 0.018;
      this.velocities[i3 + 1] = (Math.random() - 0.5) * 0.014;
      this.velocities[i3 + 2] = (Math.random() - 0.5) * 0.016;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(this.positions, 3));

    const palette = this.getPalette();
    const particleMaterial = new THREE.PointsMaterial({
      color: palette.particle,
      size: this.tier.particleCount <= 500 ? 0.28 : 0.22,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    this.particles = new THREE.Points(particleGeometry, particleMaterial);
    this.particles.frustumCulled = true;
    this.networkGroup.add(this.particles);

    const lineGeometry = new THREE.BufferGeometry();
    const maxLines = this.particleCount * MAX_CONNECTIONS;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);

    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    this.lineSegments.frustumCulled = true;
    this.networkGroup.add(this.lineSegments);
  }

  createSphereMaterial(palette) {
    if (this.tier.usePhysicalMaterial) {
      return new THREE.MeshPhysicalMaterial({
        color: palette.sphere,
        metalness: 0.15,
        roughness: 0.08,
        transmission: 0.82,
        thickness: 0.6,
        transparent: true,
        opacity: 0.55,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        emissive: palette.sphere,
        emissiveIntensity: 0.08,
      });
    }

    return new THREE.MeshStandardMaterial({
      color: palette.sphere,
      metalness: 0.2,
      roughness: 0.15,
      transparent: true,
      opacity: 0.5,
      emissive: palette.sphere,
      emissiveIntensity: 0.12,
    });
  }

  createFloatingSpheres() {
    const palette = this.getPalette();
    const segments = this.tier.sphereSegments;

    for (let i = 0; i < this.sphereCount; i += 1) {
      const radius = 0.6 + Math.random() * 1.8;
      const geometry = new THREE.SphereGeometry(radius, segments, segments);
      const material = this.createSphereMaterial(palette);
      const mesh = new THREE.Mesh(geometry, material);

      const data = {
        mesh,
        baseX: (Math.random() - 0.5) * 70,
        baseY: (Math.random() - 0.5) * 40,
        baseZ: (Math.random() - 0.5) * 50 - 10,
        rotSpeedX: (Math.random() - 0.5) * 0.008,
        rotSpeedY: (Math.random() - 0.5) * 0.012,
        rotSpeedZ: (Math.random() - 0.5) * 0.006,
        floatPhase: Math.random() * Math.PI * 2,
        floatAmp: 0.4 + Math.random() * 1.2,
        glowBase: 0.08,
      };

      mesh.position.set(data.baseX, data.baseY, data.baseZ);
      mesh.frustumCulled = true;
      this.sphereGroup.add(mesh);
      this.sphereData.push(data);
      this.spheres.push(mesh);
    }
  }

  createVolumetricGlow() {
    const palette = this.getPalette();
    const glowTexture = this.createGlowTexture();

    const spriteMaterial = new THREE.SpriteMaterial({
      map: glowTexture,
      color: palette.glow,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.centerGlow = new THREE.Sprite(spriteMaterial);
    this.centerGlow.scale.set(90, 90, 1);
    this.centerGlow.position.set(0, 0, -15);
    this.glowGroup.add(this.centerGlow);

    const fogGeometry = new THREE.BufferGeometry();
    const fogCount = this.tier.fogCount;
    const fogPositions = new Float32Array(fogCount * 3);

    for (let i = 0; i < fogCount; i += 1) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 35;
      fogPositions[i3] = Math.cos(angle) * radius;
      fogPositions[i3 + 1] = (Math.random() - 0.5) * 25;
      fogPositions[i3 + 2] = Math.sin(angle) * radius - 20;
    }

    fogGeometry.setAttribute("position", new THREE.BufferAttribute(fogPositions, 3));

    const fogMaterial = new THREE.PointsMaterial({
      color: palette.glow,
      size: 1.8,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    this.fogParticles = new THREE.Points(fogGeometry, fogMaterial);
    this.glowGroup.add(this.fogParticles);
  }

  createGlowTexture() {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(103, 209, 255, 0.9)");
    gradient.addColorStop(0.25, "rgba(103, 209, 255, 0.35)");
    gradient.addColorStop(0.55, "rgba(58, 99, 255, 0.12)");
    gradient.addColorStop(1, "rgba(58, 99, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  createFog() {
    const palette = this.getPalette();
    this.scene.fog = new THREE.FogExp2(palette.fog, 0.014);
  }

  updateNeuralNetwork() {
    const spread = { x: 55, y: 32, z: 40 };
    const motionScale = this.reducedMotion ? 0.15 : 1;

    for (let i = 0; i < this.particleCount; i += 1) {
      const i3 = i * 3;

      this.positions[i3] += this.velocities[i3] * motionScale;
      this.positions[i3 + 1] += this.velocities[i3 + 1] * motionScale;
      this.positions[i3 + 2] += this.velocities[i3 + 2] * motionScale;

      if (Math.abs(this.positions[i3]) > spread.x) this.velocities[i3] *= -1;
      if (Math.abs(this.positions[i3 + 1]) > spread.y) this.velocities[i3 + 1] *= -1;
      if (Math.abs(this.positions[i3 + 2]) > spread.z) this.velocities[i3 + 2] *= -1;

      this.positions[i3] += Math.sin(this.elapsed * 0.3 + i * 0.1) * 0.002 * motionScale;
      this.positions[i3 + 1] += Math.cos(this.elapsed * 0.25 + i * 0.08) * 0.0015 * motionScale;
    }

    this.particles.geometry.attributes.position.needsUpdate = true;

    if (this.frameCount % this.tier.connectionSkip === 0) {
      this.updateConnections();
    }
  }

  updateConnections() {
    const grid = new Map();
    const palette = this.getPalette();
    const linePositions = this.lineSegments.geometry.attributes.position.array;
    const lineColors = this.lineSegments.geometry.attributes.color.array;

    for (let i = 0; i < this.particleCount; i += 1) {
      const i3 = i * 3;
      const cx = Math.floor(this.positions[i3] / CELL_SIZE);
      const cy = Math.floor(this.positions[i3 + 1] / CELL_SIZE);
      const cz = Math.floor(this.positions[i3 + 2] / CELL_SIZE);
      const key = `${cx},${cy},${cz}`;

      if (!grid.has(key)) grid.set(key, []);
      grid.get(key).push(i);
    }

    let lineIndex = 0;
    const maxLines = this.particleCount * MAX_CONNECTIONS;

    for (let i = 0; i < this.particleCount; i += 1) {
      const i3 = i * 3;
      const cx = Math.floor(this.positions[i3] / CELL_SIZE);
      const cy = Math.floor(this.positions[i3 + 1] / CELL_SIZE);
      const cz = Math.floor(this.positions[i3 + 2] / CELL_SIZE);
      const neighbors = [];

      for (let dx = -1; dx <= 1; dx += 1) {
        for (let dy = -1; dy <= 1; dy += 1) {
          for (let dz = -1; dz <= 1; dz += 1) {
            const key = `${cx + dx},${cy + dy},${cz + dz}`;
            const cell = grid.get(key);
            if (!cell) continue;

            for (const j of cell) {
              if (j <= i) continue;

              const j3 = j * 3;
              const distX = this.positions[i3] - this.positions[j3];
              const distY = this.positions[i3 + 1] - this.positions[j3 + 1];
              const distZ = this.positions[i3 + 2] - this.positions[j3 + 2];
              const dist = Math.sqrt(distX * distX + distY * distY + distZ * distZ);

              if (dist < CONNECTION_DISTANCE) {
                neighbors.push({ j, dist });
              }
            }
          }
        }
      }

      neighbors.sort((a, b) => a.dist - b.dist);
      const connections = neighbors.slice(0, MAX_CONNECTIONS);

      for (const { j, dist } of connections) {
        if (lineIndex >= maxLines) break;

        const j3 = j * 3;
        const li = lineIndex * 6;
        const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.35;

        linePositions[li] = this.positions[i3];
        linePositions[li + 1] = this.positions[i3 + 1];
        linePositions[li + 2] = this.positions[i3 + 2];
        linePositions[li + 3] = this.positions[j3];
        linePositions[li + 4] = this.positions[j3 + 1];
        linePositions[li + 5] = this.positions[j3 + 2];

        lineColors[li] = palette.line.r * opacity;
        lineColors[li + 1] = palette.line.g * opacity;
        lineColors[li + 2] = palette.line.b * opacity;
        lineColors[li + 3] = palette.line.r * opacity;
        lineColors[li + 4] = palette.line.g * opacity;
        lineColors[li + 5] = palette.line.b * opacity;

        lineIndex += 1;
      }
    }

    for (let i = lineIndex * 6; i < linePositions.length; i += 1) {
      linePositions[i] = 0;
      lineColors[i] = 0;
    }

    this.lineSegments.geometry.attributes.position.needsUpdate = true;
    this.lineSegments.geometry.attributes.color.needsUpdate = true;
    this.lineSegments.geometry.setDrawRange(0, lineIndex * 2);
  }

  updateSpheres() {
    const motionScale = this.reducedMotion ? 0.2 : 1;
    const mouseWorldX = (this.mouse.x - 0.5) * 60;
    const mouseWorldY = -(this.mouse.y - 0.5) * 40;

    this.sphereData.forEach((data) => {
      const { mesh } = data;

      if (!this.reducedMotion) {
        mesh.rotation.x += data.rotSpeedX * motionScale;
        mesh.rotation.y += data.rotSpeedY * motionScale;
        mesh.rotation.z += data.rotSpeedZ * motionScale;
      }

      const float = Math.sin(this.elapsed * 0.5 + data.floatPhase) * data.floatAmp;
      mesh.position.x = data.baseX + float * 0.3;
      mesh.position.y = data.baseY + float;
      mesh.position.z = data.baseZ + Math.cos(this.elapsed * 0.35 + data.floatPhase) * 0.5;

      const dx = mouseWorldX - mesh.position.x;
      const dy = mouseWorldY - mesh.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const glowFactor = Math.max(0, 1 - dist / 35);

      mesh.material.emissiveIntensity = data.glowBase + glowFactor * 0.45;
      mesh.material.opacity = 0.45 + glowFactor * 0.25;
    });
  }

  updateCamera() {
    const breatheScale = this.reducedMotion ? 0.3 : 1;
    const breatheX = Math.sin(this.elapsed * 0.35) * 2.2 * breatheScale;
    const breatheY = Math.sin(this.elapsed * 0.28 + 1.2) * 0.8 * breatheScale;
    const parallaxCamX = (this.mouse.x - 0.5) * 3.5;
    const parallaxCamY = -(this.mouse.y - 0.5) * 2.5;

    this.camera.position.x = breatheX + parallaxCamX;
    this.camera.position.y = breatheY + parallaxCamY;
    this.camera.position.z = 42 + Math.sin(this.elapsed * 0.2) * 0.6 * breatheScale;
    this.camera.lookAt(parallaxCamX * 0.3, parallaxCamY * 0.3, 0);
  }

  updateMouseLight() {
    const targetX = (this.mouse.x - 0.5) * 65;
    const targetY = -(this.mouse.y - 0.5) * 45;
    const targetZ = 22 + Math.sin(this.elapsed * 0.5) * 3;

    this.mouseLight.position.x += (targetX - this.mouseLight.position.x) * 0.08;
    this.mouseLight.position.y += (targetY - this.mouseLight.position.y) * 0.08;
    this.mouseLight.position.z += (targetZ - this.mouseLight.position.z) * 0.05;
    this.mouseLight.intensity = 2.2 + Math.sin(this.elapsed * 1.2) * 0.3;
  }

  updateParallax() {
    const mx = this.mouse.x - 0.5;
    const my = this.mouse.y - 0.5;

    this.networkGroup.position.x = mx * 10;
    this.networkGroup.position.y = -my * 8;
    this.sphereGroup.position.x = mx * 20;
    this.sphereGroup.position.y = -my * 16;
    this.glowGroup.position.x = mx * 6;
    this.glowGroup.position.y = -my * 5;

    if (this.centerGlow) {
      const pulse = 1 + Math.sin(this.elapsed * 0.6) * 0.08;
      this.centerGlow.scale.set(90 * pulse, 90 * pulse, 1);
      this.centerGlow.material.opacity = 0.38 + Math.sin(this.elapsed * 0.4) * 0.06;
    }

    if (this.frameCount % this.tier.parallaxSkip !== 0) {
      return;
    }

    const root = document.documentElement;
    root.style.setProperty("--mouse-x", this.mouse.x);
    root.style.setProperty("--mouse-y", this.mouse.y);
    root.style.setProperty("--reflect-angle", `${mx * 40}deg`);
    root.style.setProperty("--reflect-x", `${50 + mx * 30}%`);
    root.style.setProperty("--reflect-y", `${50 + my * 30}%`);
    root.style.setProperty("--parallax-stars-x", `${mx * -2}px`);
    root.style.setProperty("--parallax-stars-y", `${my * -2}px`);
    root.style.setProperty("--parallax-grid-x", `${mx * -5}px`);
    root.style.setProperty("--parallax-grid-y", `${my * -5}px`);
    root.style.setProperty("--parallax-particles-x", `${mx * -8}px`);
    root.style.setProperty("--parallax-particles-y", `${my * -8}px`);
    root.style.setProperty("--parallax-rays-x", `${mx * -12}px`);
    root.style.setProperty("--parallax-rays-y", `${my * -12}px`);
    root.style.setProperty("--parallax-glow-x", `${mx * -15}px`);
    root.style.setProperty("--parallax-glow-y", `${my * -15}px`);
  }

  handlePointerMove(event) {
    this.mouse.targetX = event.clientX / Math.max(window.innerWidth, 1);
    this.mouse.targetY = event.clientY / Math.max(window.innerHeight, 1);
  }

  handleResize() {
    this.tier = getPerformanceTier();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = this.tier.pixelRatio;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(this.width, this.height);
  }

  handleVisibilityChange() {
    if (document.hidden) {
      cancelAnimationFrame(this.animationFrame);
      return;
    }
    this.clock.getDelta();
    this.animate();
  }

  handleThemeChange() {
    this.isLightTheme = document.body.classList.contains("theme-light");
    const palette = this.getPalette();

    this.particles.material.color.setHex(palette.particle);
    this.fogParticles.material.color.setHex(palette.glow);
    this.centerGlow.material.color.setHex(palette.glow);
    this.ambientLight.color.setHex(palette.ambient);
    this.scene.fog.color.setHex(palette.fog);

    this.spheres.forEach((sphere) => {
      sphere.material.color.setHex(palette.sphere);
      sphere.material.emissive.setHex(palette.sphere);
    });
  }

  animate() {
    if (!this.running || document.hidden) return;

    this.animationFrame = requestAnimationFrame(this.animate);
    this.frameCount += 1;

    const delta = this.clock.getDelta();
    this.elapsed += delta;

    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

    this.updateNeuralNetwork();
    this.updateSpheres();
    this.updateCamera();
    this.updateMouseLight();
    this.updateParallax();

    this.renderer.render(this.scene, this.camera);
  }
}

const canvas = document.getElementById("aiScene");

if (canvas) {
  const scene = new AIBackgroundScene(canvas);
  scene.init();
  window.__aiBackground = scene;
}
