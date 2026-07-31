/**
 * Shery.js + Three.js enhancements for About / Services / Work / Contact
 * Requires (in order): GSAP, ScrollTrigger, Three r155, controlKit, Shery.js
 */
(function () {
  const reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initShery() {
    if (typeof Shery === "undefined" || reduce) return;

    try {
      Shery.mouseFollower({
        skew: true,
        ease: "cubic-bezier(0.23, 1, 0.320, 1)",
        duration: 0.7,
      });
    } catch (_) {}

    try {
      if (document.querySelector(".magnet")) {
        Shery.makeMagnet(".magnet", {
          ease: "cubic-bezier(0.23, 1, 0.320, 1)",
          duration: 1,
        });
      }
    } catch (_) {}

    try {
      if (document.querySelector(".shery-text")) {
        Shery.textAnimate(".shery-text", {
          style: 1,
          y: 12,
          delay: 0.08,
          duration: 1.4,
          ease: "cubic-bezier(0.23, 1, 0.320, 1)",
          multiplier: 0.08,
        });
      }
    } catch (_) {}

    // Single-image 3D distortion / wave effects
    document.querySelectorAll(".shery-img").forEach((img, i) => {
      if (!img.classList.length) return;
      const cls = "shery-img-" + i;
      img.classList.add(cls);
      try {
        Shery.imageEffect("." + cls, {
          style: Number(img.dataset.sheryStyle || (i % 2 === 0 ? 3 : 4)),
          config: {
            uFrequencyX: { value: 12, range: "uFrequencyX" },
            uFrequencyY: { value: 8, range: "uFrequencyY" },
            uFrequencyZ: { value: 14, range: "uFrequencyZ" },
            geoVertex: { range: [1, 64], value: 32, name: "geoVertex" },
            zindex: { value: -9996999, range: [-9999999, 9999999], name: "zindex" },
            aspect: { value: 0.75 },
            ignoreShapeAspect: { value: true },
            shapePosition: { value: { x: 0, y: 0 } },
            shapeScale: { value: { x: 0.5, y: 0.5 } },
            shapeEdgeSoftness: { value: 0, range: "shapeEdgeSoftness" },
            shapeRadius: { value: 0, name: "shapeRadius" },
            currentScroll: { value: 0 },
            scrollLerp: { value: 0.07 },
            gooey: { value: false },
            infiniteGooey: { value: false },
            growSize: { value: 4, name: "growSize" },
            durationOut: { value: 1, name: "durationOut" },
            durationIn: { value: 1.5, name: "durationIn" },
            displaceAmount: { value: 0.5 },
            masker: { value: true },
            maskVal: { value: 1.2, name: "maskVal" },
            scrollType: { value: 0 },
            a: { value: 1.5, range: [0, 30], name: "a" },
            b: { value: -0.8, range: [-1, 1], name: "b" },
          },
          preset: undefined,
          debug: false,
        });
      } catch (err) {
        console.warn("Shery imageEffect skipped", err);
      }
    });

    // Multi-image gooey / scroll 3D block
    if (document.querySelector(".shery-multi")) {
      try {
        Shery.imageEffect(".shery-multi", {
          style: 5,
          gooey: true,
          config: {
            a: { value: 2, range: [0, 30] },
            b: { value: 0.75, range: [-1, 1] },
            zindex: { value: -9996999, range: [-9999999, 9999999] },
            aspect: { value: 1.2 },
            gooey: { value: true },
            infiniteGooey: { value: true },
            growSize: { value: 4, range: [1, 15] },
            durationOut: { value: 1, range: [0.1, 5] },
            durationIn: { value: 1.5, range: [0.1, 5] },
          },
        });
      } catch (err) {
        console.warn("Shery multi effect skipped", err);
      }
    }

    // Hover media circle on service / work cards when data-images provided
    const hoverHost = document.querySelector(".shery-hover-host");
    if (hoverHost && hoverHost.dataset.images) {
      try {
        const images = hoverHost.dataset.images.split(",").map((s) => s.trim());
        Shery.hoverWithMediaCircle(".shery-hover", { images });
      } catch (_) {}
    }
  }

  function initThreeStage() {
    const stage = document.getElementById("three-stage");
    if (!stage || typeof THREE === "undefined" || reduce) return;

    const free = stage.classList.contains("about-three-free");
    const width = stage.clientWidth || 600;
    const height = Math.max(free ? 320 : 280, stage.clientHeight || 360);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.55, free ? 5.2 : 4.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    stage.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    const ambient = new THREE.AmbientLight(0xffffff, 0.62);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0x38bdf8, 1.25);
    key.position.set(3.2, 4.5, 5);
    scene.add(key);
    const fill = new THREE.PointLight(0x6366f1, 1.35, 24);
    fill.position.set(-3.5, 1.2, 3);
    scene.add(fill);
    const rim = new THREE.PointLight(0x22d3ee, 0.9, 18);
    rim.position.set(1.5, -1.5, -2);
    scene.add(rim);

    const group = new THREE.Group();
    scene.add(group);

    // —— IT sculpture: laptop + floating CPU/chip hologram ——
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.55,
      roughness: 0.35,
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      metalness: 0.4,
      roughness: 0.25,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35,
    });
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x082f49,
      metalness: 0.2,
      roughness: 0.4,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.55,
    });
    const chipMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.7,
      roughness: 0.22,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.85,
      roughness: 0.28,
      emissive: 0xb45309,
      emissiveIntensity: 0.15,
    });

    // Laptop base
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 1.55), bodyMat);
    base.position.set(0, -0.85, 0.15);
    group.add(base);

    // Trackpad
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.03, 0.45), new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.3,
      roughness: 0.5,
    }));
    pad.position.set(0, -0.77, 0.35);
    group.add(pad);

    // Keyboard grid (subtle bars)
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 10; c++) {
        const keyMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.14, 0.025, 0.12),
          new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.2, roughness: 0.6 })
        );
        keyMesh.position.set(-0.95 + c * 0.21, -0.77, -0.25 + r * 0.18);
        group.add(keyMesh);
      }
    }

    // Screen hinge + panel
    const hinge = new THREE.Group();
    hinge.position.set(0, -0.79, -0.62);
    hinge.rotation.x = -0.55;
    group.add(hinge);

    const bezel = new THREE.Mesh(new THREE.BoxGeometry(2.35, 1.45, 0.08), bodyMat);
    bezel.position.set(0, 0.72, 0);
    hinge.add(bezel);

    const screen = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.2, 0.04), screenMat);
    screen.position.set(0, 0.72, 0.05);
    hinge.add(screen);

    // Floating CPU die above the laptop
    const chip = new THREE.Group();
    chip.position.set(0, 0.95, 0.1);
    group.add(chip);

    const die = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.12, 0.95), chipMat);
    chip.add(die);
    const dieCore = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.08, 0.45), accentMat);
    dieCore.position.y = 0.1;
    chip.add(dieCore);

    // Pins / contact pads
    for (let i = 0; i < 8; i++) {
      const pin = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.06), goldMat);
      const a = (i / 8) * Math.PI * 2;
      pin.position.set(Math.cos(a) * 0.55, -0.05, Math.sin(a) * 0.55);
      chip.add(pin);
    }

    // Orbiting data cubes
    const orbiters = [];
    for (let i = 0; i < 6; i++) {
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.14, 0.14),
        i % 2 === 0 ? accentMat : goldMat
      );
      cube.userData = { angle: (i / 6) * Math.PI * 2, radius: 1.55 + (i % 3) * 0.12, speed: 0.55 + i * 0.05 };
      orbiters.push(cube);
      group.add(cube);
    }

    // Soft ring under chip
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.15, 0.03, 12, 80),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        metalness: 0.5,
        roughness: 0.3,
        emissive: 0x0284c7,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.85,
      })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.55;
    group.add(ring);

    // Particles
    const pCount = 90;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const points = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: 0x7dd3fc,
        size: 0.032,
        transparent: true,
        opacity: 0.8,
      })
    );
    scene.add(points);

    let mouseX = 0;
    let mouseY = 0;
    const onMove = (e) => {
      const rect = stage.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    stage.addEventListener("pointermove", onMove);

    let raf = 0;
    const clock = new THREE.Clock();

    function animate() {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      chip.rotation.y = t * 0.55;
      chip.position.y = 0.95 + Math.sin(t * 1.4) * 0.08;
      dieCore.rotation.y = -t * 0.8;

      ring.rotation.z = t * 0.35;
      ring.scale.setScalar(1 + Math.sin(t * 2) * 0.03);

      orbiters.forEach((cube) => {
        const d = cube.userData;
        const a = d.angle + t * d.speed;
        cube.position.set(
          Math.cos(a) * d.radius,
          0.55 + Math.sin(a * 1.5) * 0.35,
          Math.sin(a) * d.radius * 0.75
        );
        cube.rotation.x = t * 1.2;
        cube.rotation.y = t * 0.9;
      });

      hinge.rotation.x = -0.55 + Math.sin(t * 0.6) * 0.04;

      group.rotation.y += (mouseX * 0.4 - group.rotation.y) * 0.05;
      group.rotation.x += (-mouseY * 0.22 - group.rotation.x) * 0.05;
      group.position.y = Math.sin(t * 0.9) * 0.06;

      points.rotation.y = t * 0.04;
      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      const w = stage.clientWidth;
      const h = Math.max(free ? 320 : 280, stage.clientHeight || 360);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (!raf) animate();
            } else {
              cancelAnimationFrame(raf);
              raf = 0;
            }
          });
        },
        { threshold: 0.05 }
      );
      io.observe(stage);
    }
  }

  function boot() {
    // Shery needs layout sizes — slight delay after loader
    const run = () => {
      initShery();
      initThreeStage();
      if (typeof ScrollTrigger !== "undefined") {
        setTimeout(() => ScrollTrigger.refresh(), 400);
      }
    };

    if (document.getElementById("loader") && document.getElementById("loader").style.display !== "none") {
      window.addEventListener("hashlabs:ready", () => setTimeout(run, 200), { once: true });
      // Fallback if loader event never fires
      setTimeout(run, 3200);
    } else {
      setTimeout(run, 400);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
