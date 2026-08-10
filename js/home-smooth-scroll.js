/**
 * Homepage smooth scroll — matched to other pages (js/smooth-scroll.js).
 */
(() => {
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) return;

  let started = false;

  function startRaf(lenis) {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  function bindGsap(lenis) {
    if (typeof gsap === "undefined") {
      startRaf(lenis);
      return;
    }

    if (typeof ScrollTrigger !== "undefined") {
      lenis.on("scroll", ScrollTrigger.update);
    }

    startRaf(lenis);
  }

  function initLenis() {
    if (started) return true;
    if (typeof Lenis === "undefined") return false;

    started = true;

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
      syncTouch: false,
    });

    window.__lenis = lenis;
    document.documentElement.classList.add("lenis", "lenis-smooth");

    bindGsap(lenis);

    const refresh = () => {
      try {
        lenis.resize();
      } catch (_) {}
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    };

    window.addEventListener("load", refresh);
    window.addEventListener("hashlabs:ready", refresh);
    setTimeout(refresh, 400);
    setTimeout(refresh, 1200);
    setTimeout(refresh, 2800);

    return true;
  }

  function initFallback() {
    if (started) return;
    started = true;

    let current = window.scrollY;
    let target = window.scrollY;
    let ticking = false;
    const ease = 0.085;

    const onWheel = (e) => {
      e.preventDefault();
      const max = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      target += e.deltaY;
      target = Math.max(0, Math.min(target, max));
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(step);
      }
    };

    function step() {
      const max = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      target = Math.max(0, Math.min(target, max));
      current += (target - current) * ease;

      if (Math.abs(target - current) < 0.4) {
        current = target;
        ticking = false;
      } else {
        requestAnimationFrame(step);
      }

      window.scrollTo(0, current);
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.update();
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          current = window.scrollY;
          target = window.scrollY;
        }
      },
      { passive: true }
    );
  }

  document.documentElement.style.scrollBehavior = "auto";

  function boot() {
    if (!initLenis()) {
      setTimeout(() => {
        if (!initLenis()) initFallback();
      }, 150);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  window.addEventListener("load", () => {
    if (!started) boot();
  });
})();
